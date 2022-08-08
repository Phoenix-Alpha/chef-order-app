import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  ResultActionType, SearchOffers, SearchOffersFailed, SearchOffersSuccess
} from './result.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { PublicOfferSearchFilterState, ResultState } from './result.reducer';
import { ResultsService } from '../results.service';
import { getFilterState } from './result.selectors';
import { PublicOfferSearchRequest } from '../results';

@Injectable()
export class ResultEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<ResultState>,
    private resultsService: ResultsService,
    private translateService: TranslateService) { }

  
  filterStateToRequestMapper(filterState: PublicOfferSearchFilterState) {
    let result: PublicOfferSearchRequest = {
      userAddress: filterState.userAddress,
      distance: filterState.distance,
      sortMode: filterState.sortMode,
    }
    if (filterState.offerType) {
      result.offerType = filterState.offerType;
    }
    if (filterState.chefRating) {
      result.chefRating = filterState.chefRating;
    }
    if (filterState.servingDate) {
      result.servingDate = filterState.servingDate;
    }
    if (filterState.isPickup) {
      result.isPickup = filterState.isPickup;
    }
    if (filterState.isDelivery) {
      result.isDelivery = filterState.isDelivery;
    }
    if (filterState.chefName) {
      result.chefName = filterState.chefName;
    }
    if (filterState.offerName) {
      result.offerName = filterState.offerName;
    }
    return result;
  }

  @Effect()
  onSearchOffers = this.actions$.pipe(
    ofType<SearchOffers>(ResultActionType.SearchOffers),
    withLatestFrom(this.store.select(getFilterState)),
    switchMap(([action, filterState]) => {
      let request: PublicOfferSearchRequest = this.filterStateToRequestMapper(filterState);
      return this.resultsService.searchOffers(request).pipe(
        map(r => new SearchOffersSuccess(r)),
        catchError(e => {
          return of(new SearchOffersFailed());
        })
      )
    })
  );

}
