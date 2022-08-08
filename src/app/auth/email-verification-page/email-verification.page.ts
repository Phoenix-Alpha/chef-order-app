import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getRegistrationState } from 'src/app/auth/+state/auth.selectors'
import { Login } from '../+state/auth.actions';
import { AuthState } from '../+state/auth.reducer';

import { CognitoAuthService } from '../cognito-auth.service';
import { CognitoCallback } from '../cognito.service';

@Component({
  selector: 'app-email-verification-page',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit, OnDestroy, CognitoCallback {
  
  verifyEmail: string;
  password: string;
  confirmCode: string;

  loading: any;

  private destroy$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private cognitoAuthService: CognitoAuthService,
              private toastController: ToastController,
              private loadingController: LoadingController,
              private store: Store<AuthState>,
              private router: Router) { }

  ngOnInit() {
    this.store.select(getRegistrationState).pipe(takeUntil(this.destroy$)).subscribe((state) => {
      console.log("register login request", state)
      this.verifyEmail = state.loginRequest.email;
      this.password = state.loginRequest.password;
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // this called every time when user changed the code
  onCodeChanged(code: string) {
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.confirmCode = code;
  }

  async onConfirm() {
    if (this.verifyEmail && this.password && this.confirmCode) {
      this.loading = await this.loadingController.create({
        message: 'Just a moment...',
      });
      this.loading.present();
      this.cognitoAuthService.confirmRegistration(this.verifyEmail, this.confirmCode, this);
    }
  }
  
  async onResendCode() {
    if (this.verifyEmail) {
      this.loading = await this.loadingController.create({
        message: 'Resending code...',
      });
      this.loading.present();
      this.cognitoAuthService.resendCode(this.verifyEmail, new VerificationCodeResend(this.verifyEmail, this.loadingController, this.toastController))
    }
  }

  async cognitoCallback(message: string, result: any) {
    // dismiss the loading...
    this.loadingController.dismiss();

    if (message != null) { //error
        console.log("message: " + message);
        const toast = await this.toastController.create({
          animated: true,
          message: message,
          duration: 3000,
          position: "middle",
        });
        toast.present();
    } else { //success
        // console.log("Moving to login page", result);
        // this.router.navigate(['/auth/login']);
        console.log("try to login...", result);
        this.store.dispatch(new Login({ email: this.verifyEmail, password: this.password }));
    }
  }
}

export class VerificationCodeResend implements CognitoCallback {

  constructor(private verifyEmail: string,
              private loadingController: LoadingController,
              private toastController: ToastController) { }

  async cognitoCallback(message: string, result: any) {
    // dismiss the loading...
    this.loadingController.dismiss();

    if (message != null) { //error
        console.log("message: " + message);
        const toast = await this.toastController.create({
          animated: true,
          message: message,
          duration: 3000,
          position: "middle",
        });
        toast.present();
    } else { //success
        const toast = await this.toastController.create({
          animated: true,
          message: `Verification code resent successfully to ${this.verifyEmail}!`,
          duration: 3000,
          position: "middle",
        });
        toast.present();
    }
  }
}