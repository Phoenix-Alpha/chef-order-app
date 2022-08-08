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
  selector: 'app-password-update-page',
  templateUrl: './password-update.page.html',
  styleUrls: ['./password-update.page.scss'],
})
export class PasswordUpdatePage implements OnInit {
  
  email: string;
  passwordResetConfirmForm: FormGroup;

  validation_messages = {
    'newPassword': [
      { type: 'required', message: 'validation.password.required' },
    ],
    'newPasswordConfirm': [
      { type: 'required', message: 'validation.newPasswordConfirm.required' },
      { type: 'notMatching', message: 'validation.newPasswordConfirm.notMatching' },
    ]
  }

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.email = window.history.state.email;
    this.passwordResetConfirmForm = this.fb.group({
      newPassword: ['', Validators.compose([ Validators.required ])],
      newPasswordConfirm: ['', Validators.compose([ Validators.required ])],
    });
  }

  get newPassword() {
    return this.passwordResetConfirmForm.get('newPassword');
  }

  get newPasswordConfirm() {
    return this.passwordResetConfirmForm.get('newPasswordConfirm');
  }

  onClickNext() {
    this.passwordResetConfirmForm.markAllAsTouched();
    if (this.passwordResetConfirmForm.valid) {
      this.router.navigate(['/auth/password/reset-confirm'], { state: { email: this.email, newPassword: this.newPassword.value } });
    }
  }

}
