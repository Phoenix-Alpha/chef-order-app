import { Language } from 'src/app/api/types/Language';

export enum UserRole {
  VISITOR = "VISITOR",
  CUSTOMER = "CUSTOMER",
  CHEF = "CHEF",
  SUPERADMIN = "SUPERADMIN",
}
export class LoggedInUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postCode: string;
  phoneCode: string;
  phoneNumber: string;
  birthdate: string;
  country: string;
  phoneVerified: 'UNVERIFIED' | 'VERIFIED' | 'BOUNCED';
  authenticationMethod: 'PASSWORD' | 'GOOGLE' | 'FACEBOOK';
  superAdmin: boolean;
  isChef: boolean;
  preferredLanguage: Language;
  roles: UserRole[];
  // userRole: string;
  registeredAt: string;
}

/// Cognito ///
export class UserLoginRequest {
  email: string;
  password: string;
}

export class AccessTokenData {
  jwtToken: string;
  payload: { [key: string]: any };
}

export class IdTokenData {
  jwtToken: string;
  payload: { [key: string]: any };
}

export class RefreshTokenData {
  token: string;
}

export class CognitoTokens {
  accessTokenData: AccessTokenData;
  idTokenData: IdTokenData;
  refreshTokenData: RefreshTokenData;
}

export class UpdateUserDetailRequest {
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  postCode?: string;
  city?: string;
  country?: string;
  birthdate?: string;
  phoneCode?: string;
  phoneNumber?: string;
  preferredLanguageId?: number;
}

export class UpdateUserPhoneNumberRequest {
  email: string;
  phoneCode: string;
  phoneNumber: string;
}

export class UserPhoneVerificationRequest {
  email: string;
  phoneVerificationCode: string;
}