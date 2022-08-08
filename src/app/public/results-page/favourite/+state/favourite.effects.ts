import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  FavouriteActionType,
} from './favourite.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FavouriteState } from './favourite.reducer';

@Injectable()
export class FavouriteEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<FavouriteState>,
    private translateService: TranslateService) { }

}
