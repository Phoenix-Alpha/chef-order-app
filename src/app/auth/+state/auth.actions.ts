import { SocialAccountLoginDetails, UserFetchOrRegisterRequest, UserProfile, UserRegistrationDetail } from './../../api/types/User';
import { Action } from '@ngrx/store';
import { CognitoTokens, LoggedInUser, UpdateUserDetailRequest, UpdateUserPhoneNumberRequest, UserLoginRequest, UserPhoneVerificationRequest } from '../auth';

export enum AuthActionType {
  Login = '[auth] Login',
  LoginSuccess = '[auth] LoginSuccess',
  LoginFailed = '[auth] LoginFailed',
  Logout = '[auth] Logout',
  LogoutSuccess = '[auth] LogoutSuccess',
  LogoutFailed = '[auth] LogoutFailed',
  InitializeRegistrationState = '[auth] InitializeRegistrationState',
  Register = '[auth] Register',
  RegisterSuccess = '[auth] RegisterSuccess',
  RegisterFailed = '[auth] RegisterFailed',
  VerifyAccount = '[auth] VerifyAccount',
  VerifyAccountSuccess = '[auth] VerifyAccountSuccess',
  VerifyAccountFailed = '[auth] VerifyAccountFailed',
  ResetPassword = '[auth] ResetPassword',
  ResetPasswordInitial = '[auth] ResetPasswordInitial',
  ResetPasswordSuccess = '[auth] ResetPasswordSuccess',
  ResetPasswordFailed = '[auth] ResetPasswordFailed',
  UpdatePassword = '[auth] UpdatePassword',
  UpdatePasswordSuccess = '[auth] UpdatePasswordSuccess',
  UpdatePasswordFailed = '[auth] UpdatePasswordFailed',
  FetchOrRegisterUser = '[auth] FetchOrRegisterUser',
  FetchLoggedInUser = '[auth] FetchLoggedInUser',
  FetchLoggedInUserSuccess = '[auth] FetchLoggedInUserSuccess',
  FetchLoggedInUserFailed = '[auth] FetchLoggedInUserFailed',
  /// Cognito ///
  SaveCognitoTokens = '[auth] SaveCognitoTokens',
  ResetCognitoTokens = '[auth] ResetCognitoTokens',
  UpdateUserDetailBoth = '[auth] UpdateUserDetailBoth',
  UpdateUserDetailBothSuccess = '[auth] UpdateUserDetailBothSuccess',
  UpdateUserDetailBothFailed = '[auth] UpdateUserDetailBothFailed',
  UpdateUserDetail = '[auth] UpdateUserDetail',
  UpdateCognitoTokensFromSession = '[auth] UpdateCognitoTokensFromSession',
  UpdateUserPhoneNumber = '[auth] UpdateUserPhoneNumber',
  UpdateUserPhoneNumberSuccess = '[auth] UpdateUserPhoneNumberSuccess',
  UpdateUserPhoneNumberFailed = '[auth] UpdateUserPhoneNumberFailed',
  ConfirmUserPhoneNumber = '[auth] ConfirmUserPhoneNumber',
  ConfirmUserPhoneNumberSuccess = '[auth] ConfirmUserPhoneNumberSuccess',
  ConfirmUserPhoneNumberFailed = '[auth] ConfirmUserPhoneNumberFailed',
}

/// SNS ///
export class ConfirmUserPhoneNumber implements Action {
  readonly type = AuthActionType.ConfirmUserPhoneNumber;

  constructor(public readonly request: UserPhoneVerificationRequest) { }
}

export class ConfirmUserPhoneNumberSuccess implements Action {
  readonly type = AuthActionType.ConfirmUserPhoneNumberSuccess;

  constructor() { }
}

export class ConfirmUserPhoneNumberFailed implements Action {
  readonly type = AuthActionType.ConfirmUserPhoneNumberFailed;

  constructor() { }
}

export class UpdateUserPhoneNumber implements Action {
  readonly type = AuthActionType.UpdateUserPhoneNumber;

  constructor(public readonly request: UpdateUserPhoneNumberRequest) { }
}

export class UpdateUserPhoneNumberSuccess implements Action {
  readonly type = AuthActionType.UpdateUserPhoneNumberSuccess;

  constructor(public readonly request: UpdateUserPhoneNumberRequest) { }
}

export class UpdateUserPhoneNumberFailed implements Action {
  readonly type = AuthActionType.UpdateUserPhoneNumberFailed;

  constructor() { }
}

/// Cognito ///
export class SaveCognitoTokens implements Action {
  readonly type = AuthActionType.SaveCognitoTokens;

  constructor(public readonly cognitoTokens: CognitoTokens) { }
}

export class ResetCognitoTokens implements Action {
  readonly type = AuthActionType.ResetCognitoTokens;

  constructor() { }
}

export class UpdateUserDetailBoth implements Action {
  readonly type = AuthActionType.UpdateUserDetailBoth;
  constructor(public readonly request: UpdateUserDetailRequest) { }
}

export class UpdateUserDetailBothSuccess implements Action {
  readonly type = AuthActionType.UpdateUserDetailBothSuccess;
  constructor(public readonly response: LoggedInUser) { }
}


export class UpdateUserDetailBothFailed implements Action {
  readonly type = AuthActionType.UpdateUserDetailBothFailed;
  constructor() { }
}

export class UpdateUserDetail implements Action {
  readonly type = AuthActionType.UpdateUserDetail;
  constructor(public readonly request: UpdateUserDetailRequest) { }
}

export class UpdateCognitoTokensFromSession implements Action {
  readonly type = AuthActionType.UpdateCognitoTokensFromSession;

  constructor() { }
}

/// --------- //
export class Login implements Action {
  readonly type = AuthActionType.Login;

  constructor(public readonly request: UserLoginRequest) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionType.LoginSuccess;

  constructor(public readonly response: LoggedInUser) {}
}

export class LoginFailed implements Action {
  readonly type = AuthActionType.LoginFailed;

  constructor() {}
}


export class Logout implements Action {
  readonly type = AuthActionType.Logout;

  constructor() {}
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionType.LogoutSuccess;

  constructor() {}
}

export class LogoutFailed implements Action {
  readonly type = AuthActionType.LogoutFailed;

  constructor() {}
}


export class InitializeRegistrationState implements Action {
  readonly type = AuthActionType.InitializeRegistrationState;

  constructor() {}
}

export class Register implements Action {
  readonly type = AuthActionType.Register;

  constructor(public readonly request: UserRegistrationDetail) {}
}

export class RegisterSuccess implements Action {
  readonly type = AuthActionType.RegisterSuccess;

  constructor(public readonly loginRequest: UserLoginRequest) {}
}

export class RegisterFailed implements Action {
  readonly type = AuthActionType.RegisterFailed;

  constructor(public readonly error: string) {}
}

export class VerifyAccount implements Action {
  readonly type = AuthActionType.VerifyAccount;

  constructor(public readonly email: string) {}
}

export class VerifyAccountSuccess implements Action {
  readonly type = AuthActionType.VerifyAccountSuccess;

  constructor() {}
}

export class VerifyAccountFailed implements Action {
  readonly type = AuthActionType.VerifyAccountFailed;

  constructor() {}
}

export class ResetPassword implements Action {
  readonly type = AuthActionType.ResetPassword;

  constructor(public readonly email: string) {}
}

export class ResetPasswordSuccess implements Action {
  readonly type = AuthActionType.ResetPasswordSuccess;

  constructor() {}
}

export class ResetPasswordInitial implements Action {
  readonly type = AuthActionType.ResetPasswordInitial;

  constructor() {}
}

export class ResetPasswordFailed implements Action {
  readonly type = AuthActionType.ResetPasswordFailed;

  constructor(public readonly errorMessage: string) {}
}

export class UpdatePassword implements Action {
  readonly type = AuthActionType.UpdatePassword;

  constructor(public readonly password: string) {}
}

export class UpdatePasswordSuccess implements Action {
  readonly type = AuthActionType.UpdatePasswordSuccess;

  constructor() {}
}

export class UpdatePasswordFailed implements Action {
  readonly type = AuthActionType.UpdatePasswordFailed;

  constructor(public readonly errorMessage: string) {}
}

export class FetchOrRegisterUser implements Action {
  readonly type = AuthActionType.FetchOrRegisterUser;

  constructor(public readonly request: UserFetchOrRegisterRequest) {}
}

export class FetchLoggedInUser implements Action {
  readonly type = AuthActionType.FetchLoggedInUser;

  constructor() {}
}

export class FetchLoggedInUserSuccess implements Action {
  readonly type = AuthActionType.FetchLoggedInUserSuccess;

  constructor(public readonly loggedInUser: LoggedInUser) {}
}

export class FetchLoggedInUserFailed implements Action {
  readonly type = AuthActionType.FetchLoggedInUserFailed;

  constructor() {}
}

export type AuthAction =
  Logout
  | LogoutSuccess
  | LogoutFailed
  | InitializeRegistrationState
  | Register
  | RegisterSuccess
  | RegisterFailed
  | VerifyAccount
  | VerifyAccountSuccess
  | VerifyAccountFailed
  | ResetPassword
  | ResetPasswordSuccess
  | ResetPasswordFailed
  | ResetPasswordInitial
  | UpdatePassword
  | UpdatePasswordSuccess
  | UpdatePasswordFailed
  | FetchOrRegisterUser
  | FetchLoggedInUser
  | FetchLoggedInUserSuccess
  | FetchLoggedInUserFailed
/// Cognito ///
  | SaveCognitoTokens
  | ResetCognitoTokens
  | UpdateUserDetailBoth
  | UpdateUserDetailBothSuccess
  | UpdateUserDetailBothFailed
  | UpdateUserDetail
  | UpdateCognitoTokensFromSession
  | UpdateUserPhoneNumber
  | UpdateUserPhoneNumberSuccess
  | UpdateUserPhoneNumberFailed
  | ConfirmUserPhoneNumber
  | ConfirmUserPhoneNumberSuccess
  | ConfirmUserPhoneNumberFailed
;
