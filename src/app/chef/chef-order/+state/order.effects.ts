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
  ConfirmOrderDelivery,
  ConfirmOrderDeliveryFailed,
  ConfirmOrderDeliverySuccess,
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
  HandlePendingOrder,
  HandlePendingOrderFailed,
  HandlePendingOrderSuccess,
  OrderActionType,
} from './order.actions';
import { ChefOrderService } from '../order.service';
import { OrderState } from './order.reducer';

@Injectable()
export class OrderEffects {

  constructor(
    private actions$: Actions,
    private chefOrderService: ChefOrderService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private store: Store<OrderState>,
    private storageService: LocalStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private translateService: TranslateService) { }

  @Effect()
  onFetchPendingOrders = this.actions$.pipe(
    ofType<FetchPendingOrders>(OrderActionType.FetchPendingOrders),
    switchMap(action =>
      this.chefOrderService.fetchPendingOrders().pipe(
        map(t => new FetchPendingOrdersSuccess(t)),
        catchError(a => of(new FetchPendingOrdersFailed()))
      ))
  );

  @Effect()
  onFetchInprepOrders = this.actions$.pipe(
    ofType<FetchInprepOrders>(OrderActionType.FetchInprepOrders),
    switchMap(action =>
      this.chefOrderService.fetchInprepOrders().pipe(
        map(t => new FetchInprepOrdersSuccess(t)),
        catchError(a => of(new FetchInprepOrdersFailed()))
      ))
  );

  @Effect()
  onFetchHistoryOrders = this.actions$.pipe(
    ofType<FetchHistoryOrders>(OrderActionType.FetchHistoryOrders),
    switchMap(action =>
      this.chefOrderService.fetchHistoryOrders().pipe(
        map(t => new FetchHistoryOrdersSuccess(t)),
        catchError(a => of(new FetchHistoryOrdersFailed()))
      ))
  );

  @Effect()
  onFetchOrderDetail = this.actions$.pipe(
    ofType<FetchOrderDetail>(OrderActionType.FetchOrderDetail),
    switchMap(action =>
      this.chefOrderService.fetchOrderDetail(action.orderUuid).pipe(
        map(t => new FetchOrderDetailSuccess(t)),
        catchError(a => of(new FetchOrderDetailFailed()))
      ))
  );

  @Effect()
  onHandlePendingOrder = this.actions$.pipe(
    ofType<HandlePendingOrder>(OrderActionType.HandlePendingOrder),
    switchMap(action =>
      this.chefOrderService.handlePendingOrder(action.request).pipe(
        map(t => new HandlePendingOrderSuccess()),
        catchError(a => of(new HandlePendingOrderFailed()))
      ))
  );

  @Effect({ dispatch: false })
  onHandlePendingOrderSuccess = this.actions$.pipe(
    ofType<HandlePendingOrderSuccess>(OrderActionType.HandlePendingOrderSuccess),
    tap(a => this.router.navigate(['/public/chef/order/list/inprep']))
  );

  @Effect()
  onConfirmOrderDelivery = this.actions$.pipe(
    ofType<ConfirmOrderDelivery>(OrderActionType.ConfirmOrderDelivery),
    switchMap(action =>
      this.chefOrderService.confirmDelivery(action.request).pipe(
        map(t => new ConfirmOrderDeliverySuccess()),
        catchError(a => of(new ConfirmOrderDeliveryFailed()))
      ))
  );

  @Effect({ dispatch: false })
  onConfirmOrderDeliveryFailed = this.actions$.pipe(
    ofType<ConfirmOrderDeliveryFailed>(OrderActionType.ConfirmOrderDeliveryFailed),
    tap(action => {
      this.toastController.create({
        animated: true,
        message: "Confirmation code incorrect. Please try again.",
        duration: 1500,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
    })
  );

}
