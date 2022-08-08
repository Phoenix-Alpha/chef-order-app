import { Inject, Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from "./cognito.service";
import { AuthenticationDetails, CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUser, CognitoUserAttribute, CognitoUserSession, ISignUpResult } from "amazon-cognito-identity-js";

import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";

import { AccessTokenData, CognitoTokens, IdTokenData, LoggedInUser, RefreshTokenData, UpdateUserDetailRequest, UserLoginRequest } from './auth';
import { UserRegistrationDetail } from "../api/types/User";
import { NewPasswordUser } from "../api/types/User";
import { environment } from "src/environments/environment";
import { SaveCognitoTokens } from "./+state/auth.actions";
import { Store } from "@ngrx/store";
import { AuthState } from './+state/auth.reducer';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { take, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CognitoAuthService {

    private isRefreshToken = false;

    // constructor(public ddb: DynamoDBService, public cognitoUtil: CognitoUtil) {
    // }
    constructor(@Inject(CognitoUtil) public cognitoUtil: CognitoUtil,
        private store: Store<AuthState>,
        private http: HttpClient) {

    }

    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {

        console.log("In authenticateUser onSuccess callback");

        AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());

        // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
        // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
        // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
        // security credentials. The identity is then injected directly into the credentials object.
        // If the first SDK call we make wants to use our IdentityID, we have a
        // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
        // very innocuous API call that forces this behavior.
        let clientParams: any = {};
        if (environment.aws_config.sts_endpoint) {
            clientParams.endpoint = environment.aws_config.sts_endpoint;
        }
        let sts = new STS(clientParams);
        sts.getCallerIdentity(function (err, data) {
            console.log("UserLoginService: Successfully set the AWS credentials");
            callback.cognitoCallback(null, session);
        });
    }

    private onLoginError = (callback: CognitoCallback, err) => {
        callback.cognitoCallback(err.message, err);
    }

    
    authenticate(username: string, password: string, callback: CognitoCallback) {
        console.log("UserLoginService: starting the authentication");

        let authenticationData = {
            Username: username,
            Password: password,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err),
            mfaRequired: (challengeName, challengeParameters) => {
                callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    cognitoUser.sendMFACode(confirmationCode, {
                        onSuccess: result => this.onLoginSuccess(callback, result),
                        onFailure: err => this.onLoginError(callback, err)
                    });
                });
            }
        });
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function () {
                callback.cognitoCallback("onSuccess", null);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);
        

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function () {
                callback.cognitoCallback(null, null);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }

    logout() {
        if (this.cognitoUtil.getCurrentUser()) {
            console.log("UserLoginService: Logging out");
            this.cognitoUtil.getCurrentUser().signOut();
        } else {
            console.log("UserLoginService: Not logged in now");
        }
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw("UserLoginService: Callback in isAuthenticated() cannot be null");

        let cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false);
                }
                else {
                    console.log("UserLoginService: Session is " + session.isValid());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            console.log("UserLoginService: can't retrieve the current user");
            callback.isLoggedIn("Can't retrieve the CurrentUser", false);
        }
    }

    isAuthenticatedObservable(): Observable<boolean> {
        let cognitoUser = this.cognitoUtil.getCurrentUser();
        if (cognitoUser != null) {
            return new Observable(observer => {
                cognitoUser.getSession(function (err, session) {
                    if (err) {
                        observer.next(false);
                    }
                    else {
                        observer.next(session.isValid());
                    }
                    observer.complete();
                });
            })
        } else {
            return of(false);
        }
    }

    getSession(): Observable<CognitoUserSession> {
        return new Observable(observer => {
            let cognitoUser = this.cognitoUtil.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    if (err) {
                        observer.next(null);
                        observer.complete();
                    }
                    else if (session.isValid()) {
                        observer.next(session);
                        observer.complete();
                    } else {
                        observer.next(null);
                        observer.complete();
                    }
                });
            } else {
                observer.next(null);
                observer.complete();
            }
        });
    }

    register(user: UserRegistrationDetail, callback: CognitoCallback): void {
        console.log("UserRegistrationService: user is " + user);

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: user.email
        };
        let dataFirstName = {
            Name: 'given_name',
            Value: user.firstName
        };
        let dataLastName = {
            Name: 'family_name',
            Value: user.lastName
        };
        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataFirstName));
        attributeList.push(new CognitoUserAttribute(dataLastName));

        this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                console.log("UserRegistrationService: registered user is " + result);
                callback.cognitoCallback(null, result);
            }
        });

    }

    confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    resendCode(username: string, callback: CognitoCallback): void {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {
        console.log(newPasswordUser);
        // Get these details and call
        //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        let authenticationData = {
            Username: newPasswordUser.username,
            Password: newPasswordUser.existingPassword,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: newPasswordUser.username,
            Pool: this.cognitoUtil.getUserPool()
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                    onSuccess: function (result) {
                        callback.cognitoCallback(null, userAttributes);
                    },
                    onFailure: function (err) {
                        callback.cognitoCallback(err, null);
                    }
                });
            },
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err, null);
            }
        });
    }

    /// Observable ///
    authenticateObservable(request: UserLoginRequest): Observable<CognitoUserSession> {
        return new Observable(observer => {
            console.log("UserLoginService: starting the authentication");
            let authenticationData = {
                Username: request.email,
                Password: request.password,
            };
            let authenticationDetails = new AuthenticationDetails(authenticationData);
            let userData = {
                Username: request.email,
                Pool: this.cognitoUtil.getUserPool()
            };
            console.log("UserLoginService: Params set...Authenticating the user");
            let cognitoUser = new CognitoUser(userData);
            console.log("UserLoginService: config is " + AWS.config);
            cognitoUser.authenticateUser(authenticationDetails, {
                newPasswordRequired: (userAttributes, requiredAttributes) => {
                    // callback.cognitoCallback(`User needs to set password.`, null)
                    observer.next(null);
                    observer.complete();
                },
                onSuccess: (result) => {
                    // this.onLoginSuccess(callback, result)
                    observer.next(result);
                    observer.complete();
                },
                onFailure: (err) => {
                    // this.onLoginError(callback, err)
                    observer.next(null);
                    observer.complete();
                },
                mfaRequired: (challengeName, challengeParameters) => {
                    // callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    //     cognitoUser.sendMFACode(confirmationCode, {
                    //         onSuccess: result => this.onLoginSuccess(callback, result),
                    //         onFailure: err => this.onLoginError(callback, err)
                    //     });
                    // });
                    observer.next(null);
                    observer.complete();
                }
            });
        })
    }

    registerCognitoUser(user: UserRegistrationDetail): Observable<ISignUpResult> {
        return new Observable(observer => {
            console.log("UserRegistrationService: user is ", user);
            let attributeList = [];
            let dataEmail = {
                Name: 'email',
                Value: user.email
            };
            let dataFirstName = {
                Name: 'given_name',
                Value: user.firstName
            };
            let dataLastName = {
                Name: 'family_name',
                Value: user.lastName
            };
            attributeList.push(new CognitoUserAttribute(dataEmail));
            attributeList.push(new CognitoUserAttribute(dataFirstName));
            attributeList.push(new CognitoUserAttribute(dataLastName));
            this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
                console.log("UserRegistrationService: ", err, result);
                if (err) {
                    observer.next(null);
                    observer.complete();
                } else {
                    observer.next(result);
                    observer.complete();
                }
            });
        })
    }

    retrieveCognitoTokens(authorizationCode: string, redirect_uri: string): Observable<any> {
        console.log("ssss!!!")
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/x-www-form-urlencoded',
        });

        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('client_id', environment.aws_config.aws_user_pools_web_client_id)
            .set('code', authorizationCode)
            .set('redirect_uri', redirect_uri);

        console.log(body.toString());
        return this.http.post<any>(environment.aws_config.aws_cognito_token_endpoint, body.toString(), {
            headers: httpHeaders
        })
    }

    authenticateWithTokens(response: any): Observable<CognitoTokens> {
        return new Observable(observer => {
            const AccessToken = new CognitoAccessToken({ AccessToken: response.access_token });
            const IdToken = new CognitoIdToken({ IdToken: response.id_token });
            const RefreshToken = new CognitoRefreshToken({ RefreshToken: response.refresh_token });
            const token_type = response.token_type;
            const expires_in = response.expires_in;
            console.log(AccessToken, IdToken, RefreshToken);
            let userSession = new CognitoUserSession({ IdToken, AccessToken, RefreshToken });
            const userData = {
                Username: IdToken.payload.email,
                Pool: this.cognitoUtil.getUserPool()
            };
            console.log(userData)
            let cognitoUser = new CognitoUser(userData);
            cognitoUser.setSignInUserSession(userSession);
            const _this = this;
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    observer.next(null);
                    observer.complete();
                } else {
                    console.log("Session is " + session.isValid());
                    if (session.isValid()) {
                        const accessTokenData: AccessTokenData = {
                            jwtToken: AccessToken.getJwtToken(),
                            payload: AccessToken.payload,
                        }
                        const idTokenData: IdTokenData = {
                            jwtToken: IdToken.getJwtToken(),
                            payload: IdToken.payload,
                        }
                        const refreshTokenData: RefreshTokenData = {
                            token: RefreshToken.getToken(),
                        }
                        observer.next({ accessTokenData, idTokenData, refreshTokenData });
                        observer.complete();
                    } else {
                        observer.next(null);
                        observer.complete();
                    }
                }
            });
        })
    }

    // updateUserAttribute(username: string, callback: CognitoCallback) {
    //     let userData = {
    //         Username: username,
    //         Pool: this.cognitoUtil.getUserPool()
    //     };

    //     let cognitoUser = new CognitoUser(userData);

    //     cognitoUser.getAttributeVerificationCode('phone_number', {
    //         onSuccess: function () {
    //             callback.cognitoCallback("onSuccess", null);
    //         },
    //         onFailure: function (err) {
    //             callback.cognitoCallback(err.message, null);
    //         },
    //         inputVerificationCode() {
    //             callback.cognitoCallback(null, null);
    //         }
    //     });
    // }

    // returns true if update is successs, or false

    updateCognitoUserDetail(request: UpdateUserDetailRequest): Observable<any> {
        return new Observable(observer => {
            let cognitoUser = this.cognitoUtil.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession(function (session_err, session) {
                    if (session_err) {
                        observer.next({
                            success: false,
                            errMsg: session_err
                        });
                        observer.complete();
                    } else if (session.isValid()) {
                        let attributeList = [];
                        let firstNameAttribute = new CognitoUserAttribute({
                        Name: 'given_name',
                        Value: request.firstName
                        })
                        attributeList.push(firstNameAttribute);
            
                        let lastNameAttribute = new CognitoUserAttribute({
                        Name: 'family_name',
                        Value: request.lastName
                        })
                        attributeList.push(lastNameAttribute);
            
                        let addressAttribute = new CognitoUserAttribute({
                        Name: 'address',
                        Value: request.address
                        })
                        attributeList.push(addressAttribute);
            
                        let cityAttribute = new CognitoUserAttribute({
                        Name: 'custom:city',
                        Value: request.city
                        })
                        attributeList.push(cityAttribute);
            
                        let postcodeAttribute = new CognitoUserAttribute({
                        Name: 'custom:postcode',
                        Value: request.postCode
                        })
                        attributeList.push(postcodeAttribute);
            
                        cognitoUser.updateAttributes(attributeList, function(update_err, result) {
                            if (update_err) {
                                console.log(update_err);
                                observer.next({
                                    success: false,
                                    errMsg: update_err
                                });
                                observer.complete();
                            } else {
                                console.log(result);
                                cognitoUser.refreshSession(session.refreshToken, function(refresh_token_err, result) {
                                    if (refresh_token_err) {
                                        console.log(refresh_token_err);
                                        observer.next({
                                            success: false,
                                            errMsg: refresh_token_err
                                        });
                                        observer.complete();
                                    } else {
                                        console.log(result);

                                        observer.next({
                                            success: true,
                                            errMsg: '',
                                        });
                                        observer.complete();
                                    }
                                })
                            }
                        })
                    } else {
                        observer.next({
                            success: false,
                            errMsg: 'Cognito user session invalid'
                        });
                        observer.complete();
                    }
                });
            } else {
                observer.next({
                    success: false,
                    errMsg: 'Cognito user null'
                });
                observer.complete();
            }
        });
    }

    // cognitoUser.getAttributeVerificationCode('phone_number', {
    //   onSuccess: () => {

    //   },
    //   onFailure: (err) => {
    //     console.log(err)
    //   },
    //   inputVerificationCode: (data) => {
    //     console.log(data);
    //   }
    // })

    confirmPhoneNumber(confirmationCode: string, callback: CognitoCallback): void {
        const cognitoUser: CognitoUser = this.cognitoUtil.getCurrentUser();
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log(err);
                callback.cognitoCallback(err.message, null);
            } else {
                if (session.isValid()) {
                    cognitoUser.verifyAttribute('phone_number', confirmationCode, {
                        onSuccess: (success) => {
                            console.log(success);
                            callback.cognitoCallback(null, success);
                        },
                        onFailure: (err) => {
                            console.log(err);
                            callback.cognitoCallback(err.message, null);
                        }
                    })
                } else {
                    console.log('Session invalid');
                    callback.cognitoCallback('Session invalid', null);
                }
            }
        });
    }

    refreshToken(): Observable<CognitoTokens> {
        return new Observable(observer => {
            const cognitoUser: CognitoUser = this.cognitoUtil.getCurrentUser();
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    observer.next(null);
                    observer.complete();
                } else {
                    cognitoUser.refreshSession(session.refreshToken, function (err, newSession: CognitoUserSession) {
                        if (err) {
                            observer.next(null);
                            observer.complete();
                        } else {
                            console.log(newSession);
                            const accessTokenData: AccessTokenData = {
                                jwtToken: newSession.getAccessToken().getJwtToken(),
                                payload: newSession.getAccessToken().payload,
                            }
                            const idTokenData: IdTokenData = {
                                jwtToken: newSession.getIdToken().getJwtToken(),
                                payload: newSession.getIdToken().payload,
                            }
                            const refreshTokenData: RefreshTokenData = {
                                token: newSession.getRefreshToken().getToken(),
                            }
                            observer.next({ accessTokenData, idTokenData, refreshTokenData });
                            observer.complete();
                        }
                    })
                }
            });
        });
    }

    get isRefreshingToken() {
        return this.isRefreshToken;
    }

    set isRefreshingToken(isrefreshToken: boolean) {
        this.isRefreshToken = isrefreshToken;
    }
}
