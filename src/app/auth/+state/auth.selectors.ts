import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Auth, AuthState } from './auth.reducer';

export const getAuthState = createFeatureSelector<Auth>('auth');
export const getLoggedInUser = createSelector(getAuthState, (state: Auth) => state.loggedInUser);
export const getUserId = createSelector(getAuthState, (state: Auth) => state.loggedInUser.id);
export const getRegistrationState = createSelector(getAuthState, (state: Auth) => state.register);
export const getRegistrationStatus = createSelector(getAuthState, (state: Auth) => state.register.status);
export const getRegistrationErrorMessage = createSelector(getAuthState, (state: Auth) => state.register.errorMessage);
export const getAccountVerificationStatus = createSelector(getAuthState, (state: Auth) => state.accountVerification);
export const getPasswordReset = createSelector(getAuthState, (state: Auth) => state.passwordReset);
export const getPasswordUpdate = createSelector(getAuthState, (state: Auth) => state.passwordUpdate);
export const getCognitoTokens = createSelector(getAuthState, (state: Auth) => state.cognitoTokens);