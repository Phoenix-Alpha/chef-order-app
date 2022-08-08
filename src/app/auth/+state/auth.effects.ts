import { TranslateService } from '@ngx-translate/core';
import { Inject, Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  AuthActionType,
  Register,
  RegisterSuccess,
  RegisterFailed,
  VerifyAccount,
  VerifyAccountSuccess,
  VerifyAccountFailed,
  ResetPassword,
  ResetPasswordSuccess,
  ResetPasswordFailed,
  UpdatePassword,
  UpdatePasswordSuccess,
  UpdatePasswordFailed,
  Logout,
  LogoutSuccess,
  LogoutFailed,
  FetchOrRegisterUser,
  FetchLoggedInUser,
  FetchLoggedInUserSuccess,
  FetchLoggedInUserFailed,
  AuthAction,
  SaveCognitoTokens,
  UpdateUserDetailBoth,
  UpdateUserDetailBothSuccess,
  UpdateUserDetailBothFailed,
  UpdateUserDetail,
  UpdateCognitoTokensFromSession,
  ResetCognitoTokens,
  UpdateUserPhoneNumber,
  UpdateUserPhoneNumberSuccess,
  UpdateUserPhoneNumberFailed,
  ConfirmUserPhoneNumber,
  ConfirmUserPhoneNumberSuccess,
  ConfirmUserPhoneNumberFailed,
  Login,
  LoginFailed,
} from './auth.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AuthState, loggedInUser } from './auth.reducer';
import { getPasswordUpdate } from './auth.selectors';
import { LocalStorageService } from 'src/app/local-storage.service';
import { AUTH_LOCAL_STORAGE_KEY } from '../auth.tokens';
import { AccessTokenData, IdTokenData, RefreshTokenData, CognitoTokens, UserRole, LoggedInUser } from '../auth';
import { CognitoAuthService } from '../cognito-auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { FetchChefDetail, FetchChefDetailFailed } from 'src/app/chef/+state/chef.actions';
import { UserFetchOrRegisterRequest } from 'src/app/api/types/User';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private store: Store<AuthState>,
    private storageService: LocalStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    @Inject(AUTH_LOCAL_STORAGE_KEY) private localStorageKey,
    private translateService: TranslateService) { }

  ngrxOnInitEffects(): AuthAction {
    const authStateFromLocalStorage = this.storageService.getSavedState(this.localStorageKey);
    const cognitoTokens = authStateFromLocalStorage ? authStateFromLocalStorage.cognitoTokens as CognitoTokens : null;
    return cognitoTokens.accessTokenData.jwtToken ? new SaveCognitoTokens(cognitoTokens) : new ResetCognitoTokens();
  }

  /// Cognito ///
  @Effect()
  updateUserDetailBoth = this.actions$.pipe(
    ofType<UpdateUserDetailBoth>(AuthActionType.UpdateUserDetailBoth),
    switchMap(action =>
      this.cognitoAuthService.updateCognitoUserDetail(action.request).pipe(
        switchMap(t => {
          if (t && t.success) {
            // // display toast...
            // this.toastController.create({
            //   animated: true,
            //   message: "Personal details updated successfully.",
            //   duration: 1500,
            //   position: "middle",
            // }).then(toast => {
            //   toast.present();
            // });
            return [new UpdateCognitoTokensFromSession(), new UpdateUserDetail(action.request)];
          } else {
            this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
            this.toastController.create({
              animated: true,
              message: "Personal details update failed.",
              duration: 3000,
              position: "middle",
            }).then(toast => {
              toast.present();
            });
            return of(new UpdateUserDetailBothFailed());
          }
        }),
        catchError(e => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Personal details update failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateUserDetailBothFailed())
        })
      )
    )
  );
  
  @Effect()
  updateCognitoTokensFromSession = this.actions$.pipe(
    ofType<UpdateCognitoTokensFromSession>(AuthActionType.UpdateCognitoTokensFromSession),
    switchMap(action =>
      this.cognitoAuthService.getSession().pipe(
        map(session => {
            if (!session) {
              console.error("Cognito user session invalid...")
              return new UpdateUserDetailBothFailed()
            } else {
              const accessTokenData: AccessTokenData = {
                  jwtToken: session.getAccessToken().getJwtToken(),
                  payload: session.getAccessToken().payload,
              }
              const idTokenData: IdTokenData = {
                  jwtToken: session.getIdToken().getJwtToken(),
                  payload: session.getIdToken().payload,
              }
              const refreshTokenData: RefreshTokenData = {
                  token: session.getRefreshToken().getToken(),
              }
              return new SaveCognitoTokens({ accessTokenData, idTokenData, refreshTokenData });
            }
        })
      )
    )
  )

  @Effect()
  updateUserDetail = this.actions$.pipe(
    ofType<UpdateUserDetail>(AuthActionType.UpdateUserDetail),
    switchMap(action =>
      this.authService.updateUserDetail(action.request).pipe(
        switchMap(t => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Personal details updated successfully.",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateUserDetailBothSuccess(t));
        }),
        catchError(e => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Personal details update failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateUserDetailBothFailed())
        })
      )
    )
  )
  

  /// -------------- ///

  // @Effect()
  // logout = this.actions$.pipe(
  //   ofType<Logout>(AuthActionType.Logout),
  //   switchMap(action =>
  //     this.authService.logout()
  //     .pipe(
  //       map(_ => new LogoutSuccess()),
  //       catchError(_ => of(new LogoutFailed()))
  //     )
  //   )
  // );

  @Effect()
  resetPassword = this.actions$.pipe(
    ofType<ResetPassword>(AuthActionType.ResetPassword),
    switchMap(action =>
      this.authService.resetPassword(action.email)
      .pipe(
        map(t => new ResetPasswordSuccess()),
        catchError(e => {
          const errors = e.error.errors.map(err => err.message);
          if (e.status === 400 && errors.filter(err => err.includes('User with email'))) {
            return of(new ResetPasswordFailed('User with email does not exist in the system'));
          } else if (e.status === 400) {
            return of(new ResetPasswordFailed(errors.join()));
          }
          return of(new ResetPasswordFailed(this.translateService.instant('admin.store.message.errorTryAgain')));
        })
      ))
  );

  @Effect({dispatch: false})
  onResetPasswordSuccess = this.actions$.pipe(
    ofType<ResetPasswordSuccess>(AuthActionType.ResetPasswordSuccess),
    tap(a => this.router.navigate(['/password/reset/success']))
  );

  @Effect()
  updatePassword = this.actions$.pipe(
    ofType<UpdatePassword>(AuthActionType.UpdatePassword),
    withLatestFrom(this.store.pipe(select(getPasswordUpdate), map(s => s.token))),
    switchMap(([action, token]) =>
      this.authService.updatePassword(action.password, token)
      .pipe(
        map(t => new UpdatePasswordSuccess()),
        catchError(e => {
          if (e.error.status === 400) {
            return of(new UpdatePasswordFailed(e.error.errors[0].message));
          }
          return of(new UpdatePasswordFailed(this.translateService.instant('admin.store.message.errorTryAgain')));
        })
      ))
  );

  @Effect({dispatch: false})
  updatePasswordSuccess = this.actions$.pipe(
    ofType<UpdatePasswordSuccess>(AuthActionType.UpdatePasswordSuccess),
    tap(_ => this.router.navigate(['/login'], {queryParams: {resetPassword: true}}))
  );

  /// ------- ///

  @Effect()
  login = this.actions$.pipe(
    ofType<Login>(AuthActionType.Login),
    switchMap(action => {
      return this.cognitoAuthService.authenticateObservable(action.request).pipe(
        switchMap(session => {
          if (session) {
            const accessTokenData: AccessTokenData = {
              jwtToken: session.getAccessToken().getJwtToken(),
              payload: session.getAccessToken().payload,
            }
            const idTokenData: IdTokenData = {
                jwtToken: session.getIdToken().getJwtToken(),
                payload: session.getIdToken().payload,
            }
            const refreshTokenData: RefreshTokenData = {
                token: session.getRefreshToken().getToken(),
            }
            const request: UserFetchOrRegisterRequest = {
              email: action.request.email,
              firstName: idTokenData.payload.given_name,
              lastName: idTokenData.payload.family_name,
              provider: 'PASSWORD',
              password: action.request.password,
            }
            return [new SaveCognitoTokens({ accessTokenData, idTokenData, refreshTokenData }), new FetchOrRegisterUser(request)];
          } else {
            this.loadingController.getTop().then(loading => {
              if (loading) {
                loading.dismiss()
              }
            });
            this.toastController.create({
              animated: true,
              message: "User login failed.",
              duration: 3000,
              position: "middle",
            }).then(toast => {
              toast.present();
            });
            return of(new LoginFailed());
          }
        }),
        catchError(err => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "User login failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new LoginFailed())
        })
      )
    })
  );


  @Effect()
  logout = this.actions$.pipe(
    ofType<Logout>(AuthActionType.Logout),
    switchMap(action => {
      this.cognitoAuthService.logout();
      return [new ResetCognitoTokens(), new LogoutSuccess(), new FetchChefDetailFailed()];
    })
  );

  @Effect({dispatch: false})
  logoutSuccess = this.actions$.pipe(
    ofType<LogoutSuccess>(AuthActionType.LogoutSuccess),
    tap(_ => this.router.navigate(['/login']))
  );

  @Effect()
  fetchLoggedInUser = this.actions$.pipe(
    ofType<FetchLoggedInUser>(AuthActionType.FetchLoggedInUser),
    switchMap(action =>
      this.authService.fetchLoggedInUser()
      .pipe(
        map(t => new FetchLoggedInUserSuccess(t)),
        catchError(e => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "User login failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return [new FetchLoggedInUserFailed(), new Logout()];
        })
      ))
  );

  @Effect({dispatch: false})
  fetchLoggedInUserSuccess = this.actions$.pipe(
    ofType<FetchLoggedInUserSuccess>(AuthActionType.FetchLoggedInUserSuccess),
    tap(action => {
      // change preferred language
      if (this.translateService.getLangs().includes(action.loggedInUser.preferredLanguage.locale)) {
        this.translateService.use(action.loggedInUser.preferredLanguage.locale);
      } else {
        this.translateService.use('fr');
      }
      this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
      this.router.navigate(['/public/welcome']);
    })
  );

  /// ------- SNS ------- ///
  @Effect()
  onUpdateUserPhoneNumber = this.actions$.pipe(
    ofType<UpdateUserPhoneNumber>(AuthActionType.UpdateUserPhoneNumber),
    switchMap(action => {
      return this.authService.updateUserPhoneNumber(action.request).pipe(
        map(t => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          console.log("dismissed");
          this.router.navigate(['/public/chef/phone-verification/confirm'])
          return new UpdateUserPhoneNumberSuccess(action.request);
        }),
        catchError(err => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Sending SMS failed. Please make sure if the phone number is valid and try agian.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateUserPhoneNumberFailed());
        })
      )
    })
  )

  @Effect()
  onConfirmUserPhoneNumber = this.actions$.pipe(
    ofType<ConfirmUserPhoneNumber>(AuthActionType.ConfirmUserPhoneNumber),
    switchMap(action => {
      return this.authService.confirmUserPhoneNumber(action.request).pipe(
        map(t => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.router.navigate(['/public/chef/engagements']);
          return new ConfirmUserPhoneNumberSuccess();
        }),
        catchError(err => {
          console.log(err)
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Invalid verification code. Please try again.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new ConfirmUserPhoneNumberFailed());
        })
      )
    })
  )

  @Effect()
  onFetchOrRegisterUser = this.actions$.pipe(
    ofType<FetchOrRegisterUser>(AuthActionType.FetchOrRegisterUser),
    switchMap(action => {
      return this.authService.fetchOrRegisterUser(action.request).pipe(
        switchMap(loggedInUser => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          let newActions = [];
          newActions.push(new FetchLoggedInUserSuccess(loggedInUser));
          if (loggedInUser.roles.includes(UserRole.CHEF)) {
            newActions.push(new FetchChefDetail());
          }
          return newActions;
        }),
        catchError(err => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          return of(new FetchLoggedInUserFailed());
        })
      )
    })
  )

  @Effect()
  onRegister = this.actions$.pipe(
    ofType<Register>(AuthActionType.Register),
    switchMap(action => {
      return this.cognitoAuthService.registerCognitoUser(action.request).pipe(
        switchMap(result => {
          if (result) {
            this.loadingController.getTop().then(loading => {
              if (loading) {
                loading.dismiss()
              }
            })
            this.router.navigate(['/auth/verify/email']);
            return of(new RegisterSuccess({ email: result.user.getUsername(), password: action.request.password }));
          } else {
            this.loadingController.getTop().then(loading => {
              if (loading) {
                loading.dismiss()
              }
            })
            this.toastController.create({
              animated: true,
              message: "User registration failed.",
              duration: 3000,
              position: "middle",
            }).then(toast => {
              toast.present();
            });
            return of(new RegisterFailed("User registration failed."));
          }
        }),
        catchError(err => {
          console.log(err);
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          })
          this.toastController.create({
            animated: true,
            message: "User registration failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new RegisterFailed("User registration failed."))
        })
      )
    })
  )

  // @Effect()
  // onRegister = this.actions$.pipe(
  //   ofType<Register>(AuthActionType.Register),
  //   switchMap(action => {
  //     return this.cognitoAuthService.registerCognitoUser(action.request).pipe(
  //       switchMap(result => {
  //         if (result) {
  //           return this.authService.register(action.request).pipe(
  //             switchMap(loggedInUser => {
  //               this.loadingController.getTop().then(loading => {
  //                 if (loading) {
  //                   loading.dismiss()
  //                 }
  //               })
  //               this.router.navigate(['/auth/verify/email'], { queryParams: { email: loggedInUser.email }});
  //               return [new RegisterSuccess(), new FetchLoggedInUserSuccess(loggedInUser)];
  //             }),
  //             catchError(err => {
  //               console.log(err);
  //               this.loadingController.getTop().then(loading => {
  //                 if (loading) {
  //                   loading.dismiss()
  //                 }
  //               })
  //               return of(new RegisterFailed("User registration failed."))
  //             })
  //           );
  //         } else {
  //           this.loadingController.getTop().then(loading => {
  //             if (loading) {
  //               loading.dismiss()
  //             }
  //           })
  //           return of(new RegisterFailed("User registration failed."));
  //         }
  //       }),
  //       catchError(err => {
  //         console.log(err);
  //         this.loadingController.getTop().then(loading => {
  //           if (loading) {
  //             loading.dismiss()
  //           }
  //         })
  //         return of(new RegisterFailed("Cognito user registration failed."))
  //       })
  //     )
  //   })
  // )
}
