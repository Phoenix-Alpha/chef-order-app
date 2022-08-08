import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  PublicActionType,
} from './public.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { PublicState } from './public.reducer';

@Injectable()
export class PublicEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<PublicState>,
    private translateService: TranslateService) { }

}
