import { ChefService } from './../../chef.service';
import { TranslateService } from '@ngx-translate/core';
import { Inject, Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { ChefWalletActionType, ActivateWallet, ActivateWalletSuccess, ActivateWalletFailed, RedirectToStripeConnect, FetchWalletInfo, FetchWalletInfoSuccess, FetchWalletInfoFailed, RedirectToStripeDashboard, RedirectToStripeDashboardSuccess, RedirectToStripeDashboardFailed } from './wallet.action';

@Injectable()
export class ChefWalletEffects {

  constructor(
    private actions$: Actions,
    private chefService: ChefService) { }

  @Effect()
  onActivateWallet = this.actions$.pipe(
  ofType<ActivateWallet>(ChefWalletActionType.ActivateWallet),
  switchMap(action =>
    // this.chefService.activateWallet(action.request).pipe(
    this.chefService.activateWallet().pipe(
      switchMap(t => {
        return [new ActivateWalletSuccess(t.walletInfo), new RedirectToStripeConnect(t.accountLinkUrl)];
        // return [new ActivateWalletSuccess(t)];
      }),
      catchError(a => of(new ActivateWalletFailed()))
    ))
  );

  @Effect({ dispatch: false })
  onRedirectToStripeConnect = this.actions$.pipe(
    ofType<RedirectToStripeConnect>(ChefWalletActionType.RedirectToStripeConnect),
    tap(action => {
      window.location.href = action.redirectUrl;
    })
  );

  @Effect()
  onFetchWallet = this.actions$.pipe(
  ofType<FetchWalletInfo>(ChefWalletActionType.FetchWalletInfo),
  switchMap(action =>
    this.chefService.getWalletInfo().pipe(
      map(t => new FetchWalletInfoSuccess(t)),
      catchError(a => of(new FetchWalletInfoFailed()))
    ))
  );


  @Effect()
  onRedirectToStripeDashboard = this.actions$.pipe(
  ofType<RedirectToStripeDashboard>(ChefWalletActionType.RedirectToStripeDashboard),
  switchMap(action =>
    this.chefService.redirectToStripeDashboard().pipe(
      map(t => new RedirectToStripeDashboardSuccess(t.loginLinkUrl)),
      catchError(a => {
        console.log(a)
        return of(new RedirectToStripeDashboardFailed())
      })
    ))
  );

  @Effect({ dispatch: false })
  onRedirectToStripeDashboardSuccess = this.actions$.pipe(
    ofType<RedirectToStripeDashboardSuccess>(ChefWalletActionType.RedirectToStripeDashboardSuccess),
    tap(action => {
      window.location.href = action.loginLink;
    })
  );

}
