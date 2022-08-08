import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { PublicFetchOfferDetail } from './+state/offer.actions';

@Injectable({
  providedIn: 'root'
})
export class PublicOfferPageGuard implements CanActivate {

  constructor(private store: Store<any>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    console.log("PublicOfferPageGuard", route)
    if (route.params.offerId) {
      const offerId = parseInt(route.params.offerId);
      const userAddress = route.queryParams.userAddress;
      console.error(offerId, userAddress)
      if (offerId > 0 && userAddress) {
        this.store.dispatch(new PublicFetchOfferDetail(offerId, userAddress));
      }
    }
    return true;
  }
}