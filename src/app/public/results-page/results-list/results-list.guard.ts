import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { InitializeOffers, SearchOffers } from '../+state/result.actions';
import { ResultState } from '../+state/result.reducer';
import { PublicFetchTopOffers } from '../../offer/+state/offer.actions';

@Injectable({
  providedIn: 'root'
})
export class ResultsListGuard implements CanActivate {

  constructor(private store: Store<ResultState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    
    this.store.dispatch(new InitializeOffers());
    
    this.store.dispatch(new SearchOffers());

    this.store.dispatch(new PublicFetchTopOffers())

    return true;
  }
}