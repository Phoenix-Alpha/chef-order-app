import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { PublicState } from './+state/public.reducer';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocationPermissionGuard implements CanActivate {

  constructor(private store: Store<PublicState>,
    private diagnostic: Diagnostic,
    protected platform: Platform,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.diagnostic.isLocationAuthorized().then(value => {
          if (value) {
            this.router.navigate(['public/instruction']);
          }
          resolve(true);
        }).catch(err => {
          resolve(true);
        })
      })
    })
  }
}