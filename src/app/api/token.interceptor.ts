import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, first, flatMap, map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AuthState, cognitoTokens } from '../auth/+state/auth.reducer';
import { getCognitoTokens } from '../auth/+state/auth.selectors';
import { CognitoAuthService } from '../auth/cognito-auth.service';
import { AuthService } from '../auth/auth.service';
import { CognitoTokens } from '../auth/auth';
import { Logout, LogoutSuccess, SaveCognitoTokens } from '../auth/+state/auth.actions';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private refreshTokenSubject: BehaviorSubject<CognitoTokens> = new BehaviorSubject<any>(null);

  constructor(public cognitoAuthService: CognitoAuthService, 
    private router: Router, 
    private store: Store<AuthState>) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authEndpoint = /api\/v1\/auth/gi;

    const authEndpoints = [
      '/api/v1/auth/'
    ];

    return this.store.select(getCognitoTokens).pipe(
      first(),
      mergeMap(cognitoTokens => {
        console.log(cognitoTokens)
        if (authEndpoints.includes(request.url) || request.url.search(authEndpoint) !== -1 ) {
          console.log("inside" ,request.url)
          if (!!cognitoTokens && !!cognitoTokens.idTokenData.jwtToken) {
            request = this.addToken(request, cognitoTokens.idTokenData.jwtToken);
          }
          return next.handle(request).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.handle401Error(request, next);
            } else {
              return throwError(error);
            }
          }));
        } else {
          console.log("outside" ,request.url)
          return next.handle(request);
        }
      }
    ));

  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.cognitoAuthService.isRefreshingToken) {
      this.cognitoAuthService.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);
      
      return this.cognitoAuthService.refreshToken().pipe(
        switchMap((cognitoTokens: CognitoTokens) => {
          this.cognitoAuthService.isRefreshingToken = false;
          this.refreshTokenSubject.next(cognitoTokens);
          this.store.dispatch(new SaveCognitoTokens(cognitoTokens));
          return next.handle(this.addToken(request, cognitoTokens.idTokenData.jwtToken));
        }),
        catchError(error => {
          this.cognitoAuthService.isRefreshingToken = false;
          this.store.dispatch(new Logout());
          this.router.navigate(['/public/home']);
          return throwError(error);
        }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(cognitoTokens => cognitoTokens != null),
        take(1),
        switchMap(cognitoTokens => {
          return next.handle(this.addToken(request, cognitoTokens.idTokenData.jwtToken));
        }));
    }
  }
}
