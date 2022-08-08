import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../shared/custom.validators';
import { AuthService } from '../auth.service';
import { CognitoAuthService } from '../cognito-auth.service';
import { CognitoCallback, LoggedInCallback, ChallengeParameters } from '../cognito.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit, CognitoCallback {
  
  passwordResetForm: FormGroup;
  loading: any;

  validation_messages = {
    'email': [
      { type: 'required', message: 'validation.email.required' },
      { type: 'email', message: 'validation.email.notValid' },
    ],
  }

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,
              private cognitoAuthService: CognitoAuthService,
              private router: Router,
              private toastController: ToastController,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.passwordResetForm = this.fb.group({
      email: ['', Validators.compose([ Validators.required, CustomValidators.email ])],
    });
  }

  get email() {
    return this.passwordResetForm.get('email');
  }

  async onSendPasswordResetEmail() {
    this.passwordResetForm.markAllAsTouched();
    if (this.passwordResetForm.valid) {
      // dismiss the toaster...
      // this.toastController.dismiss();

      const passwordResetFormDetails: {
        email
      } = Object.assign({}, this.passwordResetForm.getRawValue());
      
      this.loading = await this.loadingController.create({
        message: 'Just a moment...',
      });
      this.loading.present();
      this.cognitoAuthService.forgotPassword(passwordResetFormDetails.email, this);
    }
  }

  cognitoCallback(message: string, result: any) {
    // dismiss the loading...
    this.loadingController.dismiss();

    if (message == null && result == null) { // should input verification code
      // navigating to password reset confirm page
      this.router.navigate(['/auth/password/update'], { state: { email: this.email.value }});
    } else { //success
      console.error(message)
    }
  }

}
