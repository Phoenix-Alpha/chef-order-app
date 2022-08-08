import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FetchOfferDetail, FetchOffersByStatus, InitializeChefOfferInfoDetail } from '../+state/offer.actions';
import { OfferState } from '../+state/offer.reducer';

@Injectable({
  providedIn: 'root'
})
export class OfferPageGuard implements CanActivate {

  constructor(private store: Store<OfferState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.params.offerId) {
      const offerId = parseInt(route.params.offerId);
      if (offerId > 0) {
        this.store.dispatch(new FetchOfferDetail(offerId));
      }
    }
    return true;
  }
}