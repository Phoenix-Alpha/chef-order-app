import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../shared/custom.validators';
import { AuthService } from '../auth.service';
import { CognitoAuthService } from '../cognito-auth.service';
import { UserRegistrationDetail } from '../../api/types/User';
import { CognitoCallback, LoggedInCallback, ChallengeParameters, CognitoUtil } from '../cognito.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AccessTokenData, IdTokenData, RefreshTokenData, UserLoginRequest } from '../auth';
import { AuthState } from '../+state/auth.reducer';
import { Store } from '@ngrx/store';
import { FetchLoggedInUser, Login, SaveCognitoTokens, UpdateCognitoTokensFromSession } from '../+state/auth.actions';

// import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
// export class LoginPage implements OnInit, CognitoCallback {
export class LoginPage implements OnInit {
  
  loginForm: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'validation.email.required' },
      { type: 'email', message: 'validation.email.notValid' },
    ],
    'password': [
      { type: 'required', message: 'validation.password.required' },
    ],
  }
  
  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,
              private cognitoAuthService: CognitoAuthService,
              private router: Router,
              private toastController: ToastController,
              private cognitoUtil: CognitoUtil,
              // private googlePlus: GooglePlus,
              // private SocialAuthService: SocialAuthService,
              private loadingController: LoadingController,
              private store: Store<AuthState>) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([ Validators.required, CustomValidators.email ])],
      password: ['', Validators.compose([ Validators.required ])],
    });
  }

  ionViewWillEnter() {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmitLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      // dismiss the toaster...
      // this.toastController.dismiss();

      const loginDetail: {
        email,
        password,
      } = Object.assign({}, this.loginForm.getRawValue());
      
      this.loadingController.create({
        message: 'Just a moment...',
      }).then(loading => {
        loading.present();
        // this.cognitoAuthService.authenticate(loginDetail.email, loginDetail.password, this);
        const request: UserLoginRequest = {
          email: loginDetail.email,
          password: loginDetail.password,
        }
        this.store.dispatch(new Login(request));
      })
    }
  }

  // async cognitoCallback(message: string, result: any) {
  //   // dismiss the loading...
  //   this.loadingController.dismiss();
  //   if (message != null) { //error
  //     console.log(message, result);
  //     if (result && result.code && result.code == "UserNotConfirmedException") {
  //       this.router.navigate(['/auth/verify/email'], { queryParams: { email: this.email.value }});
  //     } else {
  //       const toast = await this.toastController.create({
  //         animated: true,
  //         message: message,
  //         duration: 3000,
  //       });
  //       toast.present();
  //     }
  //   } else { //success
  //     const cognitoUser = this.cognitoUtil.getCurrentUser();
  //     console.error(result, cognitoUser, this.cognitoUtil.getCognitoCreds());
  //     const accessTokenData: AccessTokenData = {
  //       jwtToken: result.accessToken.jwtToken,
  //       payload: { ...result.accessToken.payload }
  //     }
  //     const idTokenData: IdTokenData = {
  //       jwtToken: result.idToken.jwtToken,
  //       payload: { ...result.idToken.payload }
  //     }
  //     const refreshTokenData: RefreshTokenData = {
  //       token: result.refreshToken.token,
  //     }
  //     this.store.dispatch(new SaveCognitoTokens({ accessTokenData, idTokenData, refreshTokenData }));
  //     this.store.dispatch(new FetchLoggedInUser());
  //     // this.store.dispatch(new UpdateCognitoTokensFromSession())
  //     // this.router.navigate(['/public/welcome']);
  //   }
  // }

  onClickLoginWithGoogle() {
    this.loadingController.create({
      message: 'Just a moment...',
      backdropDismiss: true,
    }).then(loading => {
      loading.present();
      // navigating to Congito authorize endpoint out of the app to login with Google
      window.location.href = environment.aws_config.aws_cognito_google_login_endpoint;
    })
    
  }

  onClickLoginWithFacebook() {
    this.loadingController.create({
      message: 'Just a moment...',
      backdropDismiss: true,
    }).then(loading => {
      loading.present();
      // navigating to Congito authorize endpoint out of the app to login with Google    
      window.location.href = environment.aws_config.aws_cognito_facebook_login_endpoint;
    })
  }

}

