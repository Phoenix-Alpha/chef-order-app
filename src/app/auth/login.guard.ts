import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CognitoAuthService } from './cognito-auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router, 
              private cognitoAuthService: CognitoAuthService,
              private ngZone: NgZone) { }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.cognitoAuthService.isAuthenticatedObservable().pipe(
      map(isAuthenticated => {
        console.log('isAuthenticated: ', isAuthenticated)
        if (isAuthenticated) {
          this.router.navigate(['public/home']);
        } else {
          return true;
        }
      })
    );
  }
}
