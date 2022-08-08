import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../shared/custom.validators';
import { AuthService } from '../auth.service';
import { CognitoAuthService } from '../cognito-auth.service';
import { UserRegistrationDetail } from '../../api/types/User';
import { CognitoCallback } from '../cognito.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { AuthState } from '../+state/auth.reducer';
import { Store } from '@ngrx/store';
import { Register } from '../+state/auth.actions';
@Component({
  selector: 'app-signup-page',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
// export class SignupPage implements OnInit, CognitoCallback {
export class SignupPage implements OnInit {
  
  registerForm: FormGroup;
  loading: any;

  validation_messages = {
    'firstName': [
      { type: 'required', message: 'validation.firstName.required' },
      { type: 'minlength', message: 'validation.firstName.minLength' },
      { type: 'maxlength', message: 'validation.firstName.maxLength' },
    ],
    'lastName': [
      { type: 'required', message: 'validation.lastName.required' },
      { type: 'minlength', message: 'validation.lastName.minLength' },
      { type: 'maxlength', message: 'validation.lastName.maxLength' },
    ],
    'email': [
      { type: 'required', message: 'validation.email.required' },
      { type: 'email', message: 'validation.email.notValid' },
    ],
    'password': [
      { type: 'required', message: 'validation.password.required' },
      { type: 'minlength', message: 'validation.password.minLength' },
      { type: 'maxlength', message: 'validation.password.maxLength' },
      { type: 'passwordNumber', message: 'validation.password.containNumber' },
      { type: 'passwordSpecial', message: 'validation.password.containSpecial' },
      { type: 'passwordUppercase', message: 'validation.password.containUppercase' },
      { type: 'passwordLowercase', message: 'validation.password.containLowercase' },
    ],
    'termsAndPolicy': [
      { type: 'required', message: 'validation.termsAndPolicy.required' },
    ],
  }

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<AuthState>,
              private fb: FormBuilder,
              private authService: AuthService,
              private cognitoAuthService: CognitoAuthService,
              private router: Router,
              private toastController: ToastController,
              private loadingController: LoadingController) { }
              

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(32) ])],
      lastName: ['', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(32) ])],
      email: ['', Validators.compose([ Validators.required, CustomValidators.email ])],
      password: ['', Validators.compose([ Validators.required, Validators.minLength(8), Validators.maxLength(32), CustomValidators.password ])],
      termsAndPolicy: [false, Validators.compose([ Validators.requiredTrue ])],
    });
  }

  ionViewWillEnter() {

  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get termsAndPolicy() {
    return this.registerForm.get('termsAndPolicy');
  }

  async onSubmitSignup() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      // dismiss the toaster...
      // this.toastController.dismiss();
      const userDetail: {
        email,
        firstName,
        lastName,
        password,
      } = Object.assign({}, this.registerForm.getRawValue());

      const userRegistrationDetail : UserRegistrationDetail = {
        email: userDetail.email,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        password: userDetail.password,
      }
      this.loading = await this.loadingController.create({
        message: 'Signing up...',
      });
      this.loading.present();
      this.store.dispatch(new Register(userRegistrationDetail));
      // this.cognitoAuthService.register(userRegistrationDetails, this);
    }
  }

  // async cognitoCallback(message: string, result: any) {
  //   // dismiss the loading...
  //   this.loadingController.dismiss();

  //   if (message != null) { //error
  //     // this.errorMessage = message;
  //     console.log("result: " + message);
  //     const toast = await this.toastController.create({
  //       animated: true,
  //       message: message,
  //       duration: 3000,
  //     });
  //     toast.present();
  //   } else { //success
  //     //move to the next step
  //     console.log("redirecting", result);
  //     this.router.navigate(['/auth/verify/email'], { queryParams: { email: result.user.username }});
  //   }
  // }

  onClickSignupWithGoogle() {
    this.loadingController.create({
      message: 'Just a moment...',
      backdropDismiss: true,
    }).then(loading => {
      loading.present();
      // navigating to Congito authorize endpoint out of the app to login with Google
      window.location.href = environment.aws_config.aws_cognito_google_login_endpoint;
    });
  }

  onClickSignupWithFacebook() {
    this.loadingController.create({
      message: 'Just a moment...',
      backdropDismiss: true,
    }).then(loading => {
      loading.present();
      // navigating to Congito authorize endpoint out of the app to login with Google    
      window.location.href = environment.aws_config.aws_cognito_facebook_login_endpoint;
    });
  }
}
