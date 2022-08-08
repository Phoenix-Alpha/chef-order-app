import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { FetchOffersByStatus } from '../+state/offer.actions';
import { OfferState } from '../+state/offer.reducer';
import { OfferStatus } from '../offer';

@Injectable({
  providedIn: 'root'
})
export class ChefOfferDraftListGuard implements CanActivate {

  constructor(private store: Store<OfferState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    this.store.dispatch(new FetchOffersByStatus(OfferStatus.DRAFT));
    return true;
  }
}