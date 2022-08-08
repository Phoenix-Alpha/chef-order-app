import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login-page/login.page';
import { SignupPage } from './signup-page/signup.page';
import { EmailVerificationPage } from './email-verification-page/email-verification.page';
import { PasswordResetPage } from './password-reset-page/password-reset.page';
import { PasswordUpdatePage } from './password-update-page/password-update.page';
import { PasswordResetConfirmPage } from './password-reset-confirm-page/password-reset-confirm.page';

import { LoginGuard } from './login.guard';
import { EmptyPage } from '../shared/empty-page/empty.page';
import { GoogleLoginGuard } from './google-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [ LoginGuard ]
  },
  {
    path: 'signup',
    component: SignupPage
  },
  {
    path: 'verify/email',
    component: EmailVerificationPage
  },
  {
    path: 'password/reset',
    component: PasswordResetPage
  },
  {
    path: 'password/reset-confirm',
    component: PasswordResetConfirmPage
  },
  {
    path: 'password/update',
    component: PasswordUpdatePage
  },
  {
    path: 'google/login',
    component: EmptyPage,
    canActivate: [ GoogleLoginGuard ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AuthRoutingModule {}
