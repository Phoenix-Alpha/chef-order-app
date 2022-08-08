import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ApiModule } from '../api/api.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthEffects } from './+state/auth.effects';
import { authReducer } from './+state/auth.reducer';
import { storageMetaReducer } from '../storage.metareducer';
import { LocalStorageService } from '../local-storage.service';
import { AUTH_LOCAL_STORAGE_KEY, AUTH_STORAGE_KEYS, AUTH_CONFIG_TOKEN } from './auth.tokens';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginPage } from './login-page/login.page';
import { SignupPage } from './signup-page/signup.page';
import { EmailVerificationPage } from './email-verification-page/email-verification.page';
import { PasswordResetPage } from './password-reset-page/password-reset.page';
import { PasswordUpdatePage } from './password-update-page/password-update.page';
import { AuthService } from './auth.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { CodeInputModule } from 'angular-code-input';
import { PasswordResetConfirmPage } from './password-reset-confirm-page/password-reset-confirm.page';

export function getAuthConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ loggedInUser, cognitoTokens }) => ({ loggedInUser, cognitoTokens }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AuthRoutingModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CodeInputModule,
    NgOtpInputModule,
    StoreModule.forFeature('auth', authReducer, AUTH_CONFIG_TOKEN),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [ 
    LoginPage, 
    SignupPage,
    EmailVerificationPage,
    PasswordResetPage,
    PasswordResetConfirmPage,
    PasswordUpdatePage,
  ],
  providers: [
    AuthService,
    AuthEffects,
    {
      provide: AUTH_LOCAL_STORAGE_KEY,
      useValue: '__auth_storage__'
    },
    { 
      provide: AUTH_STORAGE_KEYS,
      useValue: 'auth'
    },
    {
      provide: AUTH_CONFIG_TOKEN,
      deps: [ AUTH_STORAGE_KEYS, AUTH_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getAuthConfig
    }
  ]
})
export class AuthModule {}
