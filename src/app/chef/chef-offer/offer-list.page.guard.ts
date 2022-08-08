import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { FetchOfferDetail, FetchOffersByStatus, InitializeChefOfferInfoDetail } from './+state/offer.actions';
import { OfferState } from './+state/offer.reducer';
import { OfferStatus } from './offer';

@Injectable({
  providedIn: 'root'
})
export class OfferListPageGuard implements CanActivate {

  constructor(private store: Store<OfferState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    this.router.navigate(['/public/chef/offer/list/active'], { queryParams: { ...route.queryParams } });
    return true;
  }
}