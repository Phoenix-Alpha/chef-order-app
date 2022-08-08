import { Country } from './Country';
import { Language } from './Language';

export interface SocialAccount {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
}

export interface UserProfile {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  countryId?: string;
  country?: Country;
  preferredLanguageId?: number;
  preferredLanguage?: Language;
  googleAccount?: SocialAccount;
  facebookAccount?: SocialAccount;
}

export interface SocialAccountLoginDetails {
    provider: string;
    accessToken: string;
    email: string;
    firstName: string;
    lastName: string;
}

export class NewPasswordUser {
    username: string;
    existingPassword: string;
    password: string;
}

export interface UserRegistrationDetail {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserFetchOrRegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    provider: 'GOOGLE' | 'FACEBOOK' | 'PASSWORD';
    password?: string;
}
