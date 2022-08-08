import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { catchError, mapTo, tap, first, flatMap, map } from 'rxjs/operators';

import { UserFetchOrRegisterRequest, UserProfile, UserRegistrationDetail } from './../api/types/User';
import { LoggedInUser, UpdateUserDetailRequest, UpdateUserPhoneNumberRequest, UserPhoneVerificationRequest } from './auth';
import { Store } from '@ngrx/store';
import { AuthState } from './+state/auth.reducer';
import { getCognitoTokens } from './+state/auth.selectors';
import { UpdateUserPhoneNumber } from './+state/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private isRefreshToken = false;
  
    constructor(private http: HttpClient, private store: Store<AuthState>) { }

    register(data: UserRegistrationDetail): Observable<LoggedInUser> {
        return this.http.post<LoggedInUser>('/api/v1/auth/user/register', data);
    }

    resetPassword(email: string): Observable<{}> {
        return this.http.post<{}>('/api/v1/auth/password/reset', email);
    }

    updatePassword(password: string, token: string): Observable<{}> {
        return this.http.post<{}>('/api/v1/auth/password/update', {password, token});
    }

    logout() {
        return this.http.post<any>('/api/v1/auth/logout', {});
    }

    isLoggedIn(): Observable<boolean> {
        return this.store.select(getCognitoTokens).pipe(first(), map(tokens => !!tokens.accessTokenData.jwtToken));
    }

    get isRefreshingToken() {
        return this.isRefreshToken;
    }

    set isRefreshingToken(isrefreshToken: boolean) {
        this.isRefreshToken = isrefreshToken;
    }

    fetchLoggedInUser(): Observable<LoggedInUser> {
        return this.http.get<LoggedInUser>('/api/v1/auth/user/get');
    }

    fetchOrRegisterUser(request: UserFetchOrRegisterRequest): Observable<LoggedInUser> {
        return this.http.post<LoggedInUser>('/api/v1/auth/user/fetchorregister', request);
    }

    updateUserDetail(request: UpdateUserDetailRequest): Observable<LoggedInUser> {
        return this.http.post<LoggedInUser>('/api/v1/auth/user/update', request);
    }

    /// ---------- SNS  ---------- //

    confirmUserPhoneNumber(request: UserPhoneVerificationRequest): Observable<any> {
        return this.http.post<any>('/api/v1/auth/user/phone/verify', request);
    }

    updateUserPhoneNumber(request: UpdateUserPhoneNumberRequest): Observable<any> {
        return this.http.post<any>('/api/v1/auth/user/phone/update', request);
    }
}
