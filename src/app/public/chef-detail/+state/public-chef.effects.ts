import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  PublicChefActionType, PublicFetchChefDetail, PublicFetchChefDetailFailed, PublicFetchChefDetailSuccess, PublicFetchChefSuggestionByName, PublicFetchChefSuggestionByNameFailed, PublicFetchChefSuggestionByNameSuccess,
} from './public-chef.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { PublicChefState } from './public-chef.reducer';
import { PublicChefService } from '../public-chef.service';

@Injectable()
export class PublicChefEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<PublicChefState>,
    private publicChefService: PublicChefService,
    private translateService: TranslateService) { }

  @Effect()
  onPublcFetchChefDetail = this.actions$.pipe(
    ofType<PublicFetchChefDetail>(PublicChefActionType.PublicFetchChefDetail),
    switchMap(action =>
      this.publicChefService.publicFetchChefDetail(action.chefId, action.userAddress).pipe(
        map(t => {
          return new PublicFetchChefDetailSuccess(t);
        }),
        catchError(a => of(new PublicFetchChefDetailFailed()))
      ))
  );

  @Effect()
  onPublcFetchChefSuggestions = this.actions$.pipe(
    ofType<PublicFetchChefSuggestionByName>(PublicChefActionType.PublicFetchChefSuggestionByName),
    switchMap(action =>
      this.publicChefService.publicFetchChefSuggestionByName(action.chefName).pipe(
        map(t => {
          return new PublicFetchChefSuggestionByNameSuccess(t);
        }),
        catchError(a => of(new PublicFetchChefSuggestionByNameFailed()))
      ))
  );

}
