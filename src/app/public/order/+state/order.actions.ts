import { Action } from '@ngrx/store';
import { PublicOrderResponse } from '../../checkout/checkout';
import { PublicOrderSubmitReviewRequest } from '../public-order';

export enum PublicOrderActionType {
  FetchPendingOrders = '[public-order] FetchPendingOrders',
  FetchPendingOrdersSuccess = '[public-order] FetchPendingOrdersSuccess',
  FetchPendingOrdersFailed = '[public-order] FetchPendingOrdersFailed',
  
  FetchInprepOrders = '[public-order] FetchInprepOrders',
  FetchInprepOrdersSuccess = '[public-order] FetchInprepOrdersSuccess',
  FetchInprepOrdersFailed = '[public-order] FetchInprepOrdersFailed',

  FetchHistoryOrders = '[public-order] FetchHistoryOrders',
  FetchHistoryOrdersSuccess = '[public-order] FetchHistoryOrdersSuccess',
  FetchHistoryOrdersFailed = '[public-order] FetchPendingOrdersFailed',

  FetchOrderDetail = '[public-order] FetchOrderDetail',
  FetchOrderDetailSuccess = '[public-order] FetchOrderDetailSuccess',
  FetchOrderDetailFailed = '[public-order] FetchOrderDetailFailed',

  SubmitPublicOrderReview = '[public-order] SubmitPublicOrderReview',
  SubmitPublicOrderReviewSuccess = '[public-order] SubmitPublicOrderReviewSuccess',
  SubmitPublicOrderReviewFailed = '[public-order] SubmitPublicOrderReviewFailed',
}

export class FetchPendingOrders implements Action {
  readonly type = PublicOrderActionType.FetchPendingOrders;

  constructor() {}
}

export class FetchPendingOrdersSuccess implements Action {
  readonly type = PublicOrderActionType.FetchPendingOrdersSuccess;

  constructor(public readonly orders: PublicOrderResponse[]) {}
}

export class FetchPendingOrdersFailed implements Action {
  readonly type = PublicOrderActionType.FetchPendingOrdersFailed;

  constructor() {}
}

export class FetchInprepOrders implements Action {
  readonly type = PublicOrderActionType.FetchInprepOrders;

  constructor() {}
}

export class FetchInprepOrdersSuccess implements Action {
  readonly type = PublicOrderActionType.FetchInprepOrdersSuccess;

  constructor(public readonly orders: PublicOrderResponse[]) {}
}

export class FetchInprepOrdersFailed implements Action {
  readonly type = PublicOrderActionType.FetchInprepOrdersFailed;

  constructor() {}
}

export class FetchHistoryOrders implements Action {
  readonly type = PublicOrderActionType.FetchHistoryOrders;

  constructor() {}
}

export class FetchHistoryOrdersSuccess implements Action {
  readonly type = PublicOrderActionType.FetchHistoryOrdersSuccess;

  constructor(public readonly orders: PublicOrderResponse[]) {}
}

export class FetchHistoryOrdersFailed implements Action {
  readonly type = PublicOrderActionType.FetchHistoryOrdersFailed;

  constructor() {}
}

export class FetchOrderDetail implements Action {
  readonly type = PublicOrderActionType.FetchOrderDetail;

  constructor(public readonly orderUuid: string) {}
}

export class FetchOrderDetailSuccess implements Action {
  readonly type = PublicOrderActionType.FetchOrderDetailSuccess;

  constructor(public readonly response: PublicOrderResponse) {}
}

export class FetchOrderDetailFailed implements Action {
  readonly type = PublicOrderActionType.FetchOrderDetailFailed;

  constructor() {}
}

export class SubmitPublicOrderReview implements Action {
  readonly type = PublicOrderActionType.SubmitPublicOrderReview;

  constructor(public readonly request: PublicOrderSubmitReviewRequest) {}
}

export class SubmitPublicOrderReviewSuccess implements Action {
  readonly type = PublicOrderActionType.SubmitPublicOrderReviewSuccess;

  constructor() {}
}

export class SubmitPublicOrderReviewFailed implements Action {
  readonly type = PublicOrderActionType.SubmitPublicOrderReviewFailed;

  constructor() {}
}

export type PublicOrderAction =
  FetchPendingOrders
  | FetchPendingOrdersSuccess
  | FetchPendingOrdersFailed
  | FetchInprepOrders
  | FetchInprepOrdersSuccess
  | FetchInprepOrdersFailed
  | FetchHistoryOrders
  | FetchHistoryOrdersSuccess
  | FetchHistoryOrdersFailed
  | FetchOrderDetail
  | FetchOrderDetailSuccess
  | FetchOrderDetailFailed
  | SubmitPublicOrderReview
  | SubmitPublicOrderReviewSuccess
  | SubmitPublicOrderReviewFailed
;
