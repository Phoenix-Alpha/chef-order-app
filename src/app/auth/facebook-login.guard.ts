import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserFetchOrRegisterRequest } from '../api/types/User';
import { FetchChefDetail } from '../chef/+state/chef.actions';
import { FetchLoggedInUserFailed, FetchLoggedInUserSuccess, Logout, SaveCognitoTokens } from './+state/auth.actions';
import { AuthState } from './+state/auth.reducer';
import { UserRole } from './auth';
import { AuthService } from './auth.service';
import { CognitoAuthService } from './cognito-auth.service';

@Injectable({
  providedIn: 'root'
})
export class FacebookLoginGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private cognitoAuthService: CognitoAuthService,
              private store: Store<AuthState>,
              private toastController: ToastController,
              private loadingController: LoadingController,
              private ngZone: NgZone) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const authorization_code = route.queryParams.authorization_code;
    if (authorization_code) {
      return this.cognitoAuthService.retrieveCognitoTokens(authorization_code, environment.aws_config.aws_cognito_google_login_redirect_uri).pipe(
        switchMap(response => this.cognitoAuthService.authenticateWithTokens(response).pipe(
          switchMap(cognitoTokens => {
            if (cognitoTokens) {
              const request: UserFetchOrRegisterRequest = {
                email: cognitoTokens.idTokenData.payload.email,
                firstName: cognitoTokens.idTokenData.payload.given_name,
                lastName: cognitoTokens.idTokenData.payload.family_name,
                provider: 'FACEBOOK'
              }
              this.store.dispatch(new SaveCognitoTokens(cognitoTokens));
              return this.authService.fetchOrRegisterUser(request).pipe(
                switchMap(loggedInUser => {
                  this.loadingController.dismiss();
                  this.store.dispatch(new FetchLoggedInUserSuccess(loggedInUser));
                  if (loggedInUser.roles.includes(UserRole.CHEF)) {
                    // this.store.dispatch(new FetchChefDetail(loggedInUser.id));
                    this.store.dispatch(new FetchChefDetail());
                  }
                  this.router.navigate(['public/welcome']);
                  return of(true);
                }),
                catchError(err => {
                  this.loadingController.dismiss();
                  this.store.dispatch(new FetchLoggedInUserFailed());
                  this.store.dispatch(new Logout());
                  this.toastController.create({
                    animated: true,
                    message: "Login with Facebook failed. Please try agian.",
                    duration: 3000,
                    position: "middle",
                  }).then(toast => {
                    toast.present();
                  });
                  // this.router.navigate(['public/home']);
                  return of(true);
                })
              )
            } else {
              this.loadingController.dismiss();
              this.toastController.create({
                animated: true,
                message: "Login with Facebook failed. Please try agian.",
                duration: 3000,
                position: "middle",
              }).then(toast => {
                toast.present();
              });
              // this.router.navigate(['public/home']);
            }
          })
        ))
      )
    } else {
      this.loadingController.dismiss();
      this.toastController.create({
        animated: true,
        message: "Login with Facebook failed. Please try agian.",
        duration: 3000,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
      // this.router.navigate(['public/home']);
    }
    return true;
  }
}
