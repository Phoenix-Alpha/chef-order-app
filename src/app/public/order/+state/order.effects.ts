import { TranslateService } from '@ngx-translate/core';
import { Inject, Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { LocalStorageService } from 'src/app/local-storage.service';

import {
  FetchHistoryOrders,
  FetchHistoryOrdersFailed,
  FetchHistoryOrdersSuccess,
  FetchInprepOrders,
  FetchInprepOrdersFailed,
  FetchInprepOrdersSuccess,
  FetchOrderDetail,
  FetchOrderDetailFailed,
  FetchOrderDetailSuccess,
  FetchPendingOrders,
  FetchPendingOrdersFailed,
  FetchPendingOrdersSuccess,
  PublicOrderActionType,
  SubmitPublicOrderReview,
  SubmitPublicOrderReviewFailed,
  SubmitPublicOrderReviewSuccess,
} from './order.actions';
import { PublicOrderState } from './order.reducer';
import { PublicOrderService } from '../public-order.service';

@Injectable()
export class PublicOrderEffects {

  constructor(
    private actions$: Actions,
    private publicOrderService: PublicOrderService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private store: Store<PublicOrderState>,
    private storageService: LocalStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private translateService: TranslateService) { }

  @Effect()
  onFetchPendingOrders = this.actions$.pipe(
    ofType<FetchPendingOrders>(PublicOrderActionType.FetchPendingOrders),
    switchMap(action =>
      this.publicOrderService.fetchPendingOrders().pipe(
        map(t => new FetchPendingOrdersSuccess(t)),
        catchError(a => of(new FetchPendingOrdersFailed()))
      ))
  );

  @Effect()
  onFetchInprepOrders = this.actions$.pipe(
    ofType<FetchInprepOrders>(PublicOrderActionType.FetchInprepOrders),
    switchMap(action =>
      this.publicOrderService.fetchInprepOrders().pipe(
        map(t => new FetchInprepOrdersSuccess(t)),
        catchError(a => of(new FetchInprepOrdersFailed()))
      ))
  );

  @Effect()
  onFetchHistoryOrders = this.actions$.pipe(
    ofType<FetchHistoryOrders>(PublicOrderActionType.FetchHistoryOrders),
    switchMap(action =>
      this.publicOrderService.fetchHistoryOrders().pipe(
        map(t => new FetchHistoryOrdersSuccess(t)),
        catchError(a => of(new FetchHistoryOrdersFailed()))
      ))
  );

  @Effect()
  onFetchOrderDetail = this.actions$.pipe(
    ofType<FetchOrderDetail>(PublicOrderActionType.FetchOrderDetail),
    switchMap(action =>
      this.publicOrderService.fetchOrderDetail(action.orderUuid).pipe(
        map(t => new FetchOrderDetailSuccess(t)),
        catchError(a => of(new FetchOrderDetailFailed()))
      ))
  );

  @Effect()
  onSubmitPublicOrderReview = this.actions$.pipe(
    ofType<SubmitPublicOrderReview>(PublicOrderActionType.SubmitPublicOrderReview),
    switchMap(action =>
      this.publicOrderService.submitPublicOrderReview(action.request).pipe(
        map(t => new SubmitPublicOrderReviewSuccess(t)),
        catchError(a => of(new SubmitPublicOrderReviewFailed()))
      ))
  );

  @Effect({ dispatch: false })
  onSubmitPublicOrderReviewSuccess = this.actions$.pipe(
    ofType<SubmitPublicOrderReviewSuccess>(PublicOrderActionType.SubmitPublicOrderReviewSuccess),
    tap(() => {
      this.toastController.create({
        animated: true,
        message: "Review submitted successfully!",
        duration: 1500,
        position: "middle",
      }).then(toast => {
        toast.present();
        this.router.navigate(['/public/order'])
      });
    })
  );

  @Effect({ dispatch: false })
  onSubmitPublicOrderReviewFailed = this.actions$.pipe(
    ofType<SubmitPublicOrderReviewFailed>(PublicOrderActionType.SubmitPublicOrderReviewFailed),
    tap(() => {
      this.toastController.create({
        animated: true,
        message: "Review submission failed!",
        duration: 1500,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
    })
  );

}
