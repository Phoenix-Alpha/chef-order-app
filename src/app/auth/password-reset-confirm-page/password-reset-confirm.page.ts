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
  selector: 'app-password-reset-confirm-page',
  templateUrl: './password-reset-confirm.page.html',
  styleUrls: ['./password-reset-confirm.page.scss'],
})
export class PasswordResetConfirmPage implements OnInit, CognitoCallback {
  email: string;
  newPassword: string;
  verificationCode: string;
  loading: any;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private cognitoAuthService: CognitoAuthService,
              private router: Router,
              private toastController: ToastController,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.email = window.history.state.email;
    this.newPassword = window.history.state.newPassword;
    console.log(this.email, this.newPassword);
  }

  // this called every time when user changed the code
  onCodeChanged(code: string) {
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.verificationCode = code;
  }

  async onConfirmPasswordReset() {
    if (this.email && this.verificationCode && this.newPassword) {
      this.loading = await this.loadingController.create({
        message: 'Just a moment...',
      });
      this.loading.present();
      this.cognitoAuthService.confirmNewPassword(this.email, this.verificationCode, this.newPassword, this);
    }
  }

  async cognitoCallback(message: string) {
    // dismiss the loading...
    this.loadingController.dismiss();

    if (message != null) { // show error toaster...
      console.log("result: ", message);
      const toast = await this.toastController.create({
        animated: true,
        message: message,
        duration: 3000,
        position: "middle",
      });
      toast.present();
    } else { // navigate to login page when success
      console.log("result2: ", message);
      this.router.navigate(['/auth/login']);
    }
  }

  async onResendForgotPasswordEmail() {
    this.loading = await this.loadingController.create({
      message: 'Just a moment...',
    });
    this.loading.present();
    this.cognitoAuthService.forgotPassword(this.email, new ForgotPasswordCallback(this.email, this.toastController, this.loadingController));
  }
}

export class ForgotPasswordCallback implements CognitoCallback {

  constructor(private email: string,
    private toastController: ToastController,
    private loadingController: LoadingController) {

  }

  async cognitoCallback(message: string, result: any) {
    // dismiss the loading...
    this.loadingController.dismiss();

    if (message == null && result == null) { // should input verification code
      // just show toaster...
      const toast = await this.toastController.create({
        animated: true,
        message: `Email resent successfully to ${this.email}.`,
        duration: 3000,
        position: "middle",
      });
      toast.present();
    } else { // show error toaster
      const toast = await this.toastController.create({
        animated: true,
        message: message,
        duration: 3000,
        position: "middle",
      });
      toast.present();
    }
  }
}
