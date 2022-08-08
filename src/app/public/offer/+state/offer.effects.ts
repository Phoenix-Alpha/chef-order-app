import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  PublicFetchOfferDetail,
  PublicFetchOfferDetailFailed,
  PublicFetchOfferDetailSuccess,
  PublicFetchOfferSuggestions,
  PublicFetchOfferSuggestionsFailed,
  PublicFetchOfferSuggestionsSuccess,
  PublicFetchTopOffers,
  PublicFetchTopOffersFailed,
  PublicFetchTopOffersSuccess,
  PublicOfferActionType,
} from './offer.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OfferState } from './offer.reducer';
import { PublicOfferService } from '../public-offer.service';

@Injectable()
export class PublicOfferEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<OfferState>,
    private publicOfferService: PublicOfferService,
    private translateService: TranslateService) { }

  
  @Effect()
  onPublicFetchOfferDetail = this.actions$.pipe(
    ofType<PublicFetchOfferDetail>(PublicOfferActionType.PublicFetchOfferDetail),
    switchMap(action =>
      this.publicOfferService.publicFetchOfferDetail(action.offerId, action.userAddress).pipe(
        map(t => {
          return new PublicFetchOfferDetailSuccess(t);
        }),
        catchError(a => of(new PublicFetchOfferDetailFailed()))
      ))
  );

  @Effect()
  onPublicFetchOfferSuggestions = this.actions$.pipe(
    ofType<PublicFetchOfferSuggestions>(PublicOfferActionType.PublicFetchOfferSuggestions),
    switchMap(action =>
      this.publicOfferService.publicFetchOfferSuggestions(action.offerName).pipe(
        map(t => {
          return new PublicFetchOfferSuggestionsSuccess(t);
        }),
        catchError(a => of(new PublicFetchOfferSuggestionsFailed()))
      ))
  );

  @Effect()
  onPublicFetchTopOffers = this.actions$.pipe(
    ofType<PublicFetchTopOffers>(PublicOfferActionType.PublicFetchTopOffers),
    switchMap(action =>
      this.publicOfferService.publicFetchTopOffers().pipe(
        map(t => {
          return new PublicFetchTopOffersSuccess(t);
        }),
        catchError(a => of(new PublicFetchTopOffersFailed()))
      ))
  );
}
