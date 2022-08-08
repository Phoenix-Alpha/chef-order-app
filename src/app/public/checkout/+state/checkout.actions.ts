import { PublicOrderResponse } from './../checkout';
import { Action } from '@ngrx/store';
import { BasketStatus, PublicOrder, UserInfo } from './checkout.reducer';
import { PublicOrderCreateRequest } from '../checkout';

export enum CheckoutActionType {
  InitializeBasket = '[public-checkout] InitializeBasket',
  AddOrderToBasket = '[public-checkout] AddOrderToBasket',
  ReduceOrderAmount = '[public-checkout] ReduceOrderAmount',
  IncrementOrderAmount = '[public-checkout] IncrementOrderAmount',
  UpdateTotal = '[public-checkout] UpdateTotal',
  UpdateSpecialNote = '[public-checkout] UpdateSpecialNote',
  PublicOrderCreate = '[public-checkout] PublicOrderCreate',
  PublicOrderCreateSuccess = '[public-checkout] PublicOrderCreateSuccess',
  RedirectToStripeCheckout = '[public-checkout] RedirectToStripeCheckout',
  PublicOrderCreateFailed = '[public-checkout] PublicOrderCreateFailed',
  UpdateCheckoutUserInfo = '[public-checkout] UpdateCheckoutUserInfo',
  PresentStripePaymentSheet = '[public-checkout] PresentStripePaymentSheet',
  UpdateCheckoutBasketStatus = '[public-checkout] UpdateCheckoutBasketStatus',
}

export class InitializeBasket implements Action {
  readonly type = CheckoutActionType.InitializeBasket;
  constructor(){}
}

export class AddOrderToBasket implements Action {
  readonly type = CheckoutActionType.AddOrderToBasket;
  constructor(public readonly order: PublicOrder){}
}

export class UpdateTotal implements Action {
  readonly type = CheckoutActionType.UpdateTotal;
  constructor(public readonly total: number){}
}

export class UpdateSpecialNote implements Action {
  readonly type = CheckoutActionType.UpdateSpecialNote;
  constructor(public readonly offerId: number, public readonly specialNote: string){}
}

export class ReduceOrderAmount implements Action {
  readonly type = CheckoutActionType.ReduceOrderAmount;
  constructor(public readonly offerId: number){}
}

export class IncrementOrderAmount implements Action {
  readonly type = CheckoutActionType.IncrementOrderAmount;
  constructor(public readonly offerId: number){}
}

export class PublicOrderCreate implements Action {
  readonly type = CheckoutActionType.PublicOrderCreate;
  constructor( public readonly request: PublicOrderCreateRequest){}
}

export class PublicOrderCreateSuccess implements Action {
  readonly type = CheckoutActionType.PublicOrderCreateSuccess;
  constructor(public readonly publicOrderResponse: PublicOrderResponse){}
}

export class PublicOrderCreateFailed implements Action {
  readonly type = CheckoutActionType.PublicOrderCreateFailed;
  constructor(){}
}

export class RedirectToStripeCheckout implements Action {
  readonly type = CheckoutActionType.RedirectToStripeCheckout;
  constructor(public readonly stripeCheckoutSessionUrl: string){}
}

export class UpdateCheckoutUserInfo implements Action {
  readonly type = CheckoutActionType.UpdateCheckoutUserInfo;
  constructor(public readonly newUserInfo: UserInfo){}
}

export class UpdateCheckoutBasketStatus implements Action {
  readonly type = CheckoutActionType.UpdateCheckoutBasketStatus;
  constructor(public readonly newStatus: BasketStatus){}
}

export class PresentStripePaymentSheet implements Action {
  readonly type = CheckoutActionType.PresentStripePaymentSheet;
  constructor(public readonly response: PublicOrderResponse){}
}



export type CheckoutAction =
  InitializeBasket
  | AddOrderToBasket
  | UpdateTotal
  | UpdateSpecialNote
  | ReduceOrderAmount
  | IncrementOrderAmount
  | PublicOrderCreate
  | PublicOrderCreateSuccess
  | RedirectToStripeCheckout
  | PublicOrderCreateFailed
  | UpdateCheckoutUserInfo
  | UpdateCheckoutBasketStatus
;
