import { Language } from '../../api/types/Language';
import { AuthAction, AuthActionType } from './auth.actions';
import { combineReducers } from '@ngrx/store';
import { LoggedInUser, UserLoginRequest } from '../auth';
import { CognitoTokens, RefreshTokenData, IdTokenData, AccessTokenData } from '../auth';

export type RegistrationStatus = 'INITIAL' | 'REGISTERED' | 'FAILED';
export type AccountVerificationStatus = 'INITIAL' | 'VERIFICATION_SENT' | 'FAILED';
export type ResetPasswordStatus = 'INITIAL' | 'RESET_PASSWORD_SENT' | 'FAILED';
export type UpdatePasswordStatus = 'INITIAL' | 'PASSWORD_UPDATED' | 'FAILED';

export interface LoginState {
  userId: number;
  username: string;
  invalidCredentials: boolean;
  socialAccountLoginFailed: boolean;
}

export interface RegisterState {
  status: RegistrationStatus;
  errorMessage: string;
  loginRequest: UserLoginRequest;
}

export interface PasswordResetState {
  status: ResetPasswordStatus;
  errorMessage: string;
}

export interface PasswordUpdateState {
  status: UpdatePasswordStatus;
  errorMessage: string;
  username: string;
  token: string;
}

export interface Auth {
  loggedInUser: LoggedInUser;
  cognitoTokens: CognitoTokens;
  register: RegisterState;
  accountVerification: AccountVerificationStatus;
  passwordReset: PasswordResetState;
  passwordUpdate: PasswordUpdateState;
}

export interface AuthState {
  auth: Auth;
}

export const authInitialState: Auth = {
  loggedInUser: {
    id: -1,
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postCode: '',
    phoneCode: '',
    phoneNumber: '',
    country: '',
    birthdate: '',
    phoneVerified: 'UNVERIFIED',
    authenticationMethod: 'PASSWORD',
    superAdmin: false,
    isChef: false,
    preferredLanguage: {
      id: -1,
      name: '',
      locale: '',
    },
    roles: [],
    // userRole: '',
    registeredAt: '',
  },
  register: {
    status: 'INITIAL',
    errorMessage: '',
    loginRequest: {
      email: '',
      password: '',
    }
  },
  accountVerification: 'INITIAL',
  passwordReset: {
    status: 'INITIAL',
    errorMessage: ''
  },
  passwordUpdate: {
    status: 'INITIAL',
    errorMessage: '',
    username: '',
    token: ''
  },
  cognitoTokens: {
    accessTokenData: {
      jwtToken: null,
      payload: {}
    },
    idTokenData: {
      jwtToken: null,
      payload: {}
    },
    refreshTokenData: {
      token: null,
    }
  }
};

export function loggedInUser(userState = authInitialState.loggedInUser, action: AuthAction): LoggedInUser {
  switch (action.type) {
    case AuthActionType.UpdateUserDetailBothSuccess:
      return { ...action.response }
    case AuthActionType.FetchLoggedInUserSuccess:
      console.log(action.loggedInUser)
      return { ...action.loggedInUser };
    case AuthActionType.FetchLoggedInUserFailed:
      return { ...authInitialState.loggedInUser };
    case AuthActionType.LogoutSuccess:
      return { ...authInitialState.loggedInUser };
    case AuthActionType.UpdateUserPhoneNumberSuccess:
      return { ...userState, phoneCode: action.request.phoneCode, phoneNumber: action.request.phoneNumber, phoneVerified: 'UNVERIFIED' };
    case AuthActionType.ConfirmUserPhoneNumberSuccess:
      return { ...userState, phoneVerified: 'VERIFIED' };
    case AuthActionType.ConfirmUserPhoneNumberFailed:
      return { ...userState, phoneVerified: 'UNVERIFIED' };
    default:
      return userState;
  }

}

export function register(state = authInitialState.register, action: AuthAction): RegisterState {
  switch (action.type) {
      case AuthActionType.InitializeRegistrationState:
        return authInitialState.register;
      case AuthActionType.RegisterSuccess:
        return { 
          ...state,
          errorMessage: '',
          status: 'REGISTERED',
          loginRequest: { ...action.loginRequest }
        };
      case AuthActionType.RegisterFailed:
        return { 
          ...state,
          errorMessage: action.error,
          status: 'FAILED',
          loginRequest: {
            email: '',
            password: '',
          }
        };
      default:
        return state;
  }
}

export function accountVerification(state = authInitialState.accountVerification, action: AuthAction): AccountVerificationStatus {
  switch (action.type) {
      // case AuthActionType.InitializeRegistrationState:
      //   return authInitialState['register'];
      case AuthActionType.VerifyAccountSuccess:
        return  'VERIFICATION_SENT';
      case AuthActionType.VerifyAccountFailed:
        return 'FAILED';
      default:
        return state;
  }
}

export function passwordReset(state = authInitialState.passwordReset, action: AuthAction): PasswordResetState {
  switch (action.type) {
      case AuthActionType.ResetPasswordInitial:
        return { status: 'INITIAL', errorMessage: '' };
      case AuthActionType.ResetPasswordSuccess:
        return  { status: 'RESET_PASSWORD_SENT' , errorMessage: '' };
      case AuthActionType.ResetPasswordFailed:
        return { status: 'FAILED', errorMessage: action.errorMessage };
      default:
        return state;
  }
}

export function passwordUpdate(state = authInitialState.passwordUpdate, action: AuthAction): PasswordUpdateState {
  switch (action.type) {
      // case AuthActionType.UserForToken:
      //   return  { status: 'INITIAL' , errorMessage: '', username: action.username, token: action.token };
      case AuthActionType.UpdatePasswordFailed:
        return { status: 'FAILED', errorMessage: action.errorMessage, username: '', token: '' };
      default:
        return state;
  }
}

export function cognitoTokens(state = authInitialState.cognitoTokens, action: AuthAction): CognitoTokens {
  switch (action.type) {
    case AuthActionType.SaveCognitoTokens:
      console.log({ ...action.cognitoTokens })
      return { ...action.cognitoTokens };
    case AuthActionType.ResetCognitoTokens:
      return  { ...authInitialState.cognitoTokens };
    default:
      return state;
  }
}

const reducer: (state: Auth, action: AuthAction) => Auth = combineReducers({
  loggedInUser,
  register,
  accountVerification,
  passwordReset,
  passwordUpdate,
  cognitoTokens
});

export function authReducer(state: Auth = authInitialState, action: AuthAction): Auth {
  return reducer(state, action);
}
