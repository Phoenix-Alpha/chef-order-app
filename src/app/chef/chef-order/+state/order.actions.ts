import { Action } from '@ngrx/store';
import { OrderStatus } from 'src/app/public/checkout/checkout';
import { ChefHandlePendingRequest, ChefOrderConfirmDeliveryRequest, ChefOrderDetail } from '../order';

export enum OrderActionType {
  FetchPendingOrders = '[chef-order] FetchPendingOrders',
  FetchPendingOrdersSuccess = '[chef-order] FetchPendingOrdersSuccess',
  FetchPendingOrdersFailed = '[chef-order] FetchPendingOrdersFailed',
  
  FetchInprepOrders = '[chef-order] FetchInprepOrders',
  FetchInprepOrdersSuccess = '[chef-order] FetchInprepOrdersSuccess',
  FetchInprepOrdersFailed = '[chef-order] FetchInprepOrdersFailed',

  FetchHistoryOrders = '[chef-order] FetchHistoryOrders',
  FetchHistoryOrdersSuccess = '[chef-order] FetchHistoryOrdersSuccess',
  FetchHistoryOrdersFailed = '[chef-order] FetchPendingOrdersFailed',

  FetchOrderDetail = '[chef-order] FetchOrderDetail',
  FetchOrderDetailSuccess = '[chef-order] FetchOrderDetailSuccess',
  FetchOrderDetailFailed = '[chef-order] FetchOrderDetailFailed',

  HandlePendingOrder = '[chef-order] HandlePendingOrder',
  HandlePendingOrderSuccess = '[chef-order] HandlePendingOrderSuccess',
  HandlePendingOrderFailed = '[chef-order] HandlePendingOrderFailed',
  
  ConfirmOrderDelivery = '[chef-order] ConfirmOrderDelivery',
  ConfirmOrderDeliverySuccess = '[chef-order] ConfirmOrderDeliverySuccess',
  ConfirmOrderDeliveryFailed = '[chef-order] ConfirmOrderDeliveryFailed',
}

export class FetchPendingOrders implements Action {
  readonly type = OrderActionType.FetchPendingOrders;

  constructor() {}
}

export class FetchPendingOrdersSuccess implements Action {
  readonly type = OrderActionType.FetchPendingOrdersSuccess;

  constructor(public readonly orders: ChefOrderDetail[]) {}
}

export class FetchPendingOrdersFailed implements Action {
  readonly type = OrderActionType.FetchPendingOrdersFailed;

  constructor() {}
}

export class FetchInprepOrders implements Action {
  readonly type = OrderActionType.FetchInprepOrders;

  constructor() {}
}

export class FetchInprepOrdersSuccess implements Action {
  readonly type = OrderActionType.FetchInprepOrdersSuccess;

  constructor(public readonly orders: ChefOrderDetail[]) {}
}

export class FetchInprepOrdersFailed implements Action {
  readonly type = OrderActionType.FetchInprepOrdersFailed;

  constructor() {}
}

export class FetchHistoryOrders implements Action {
  readonly type = OrderActionType.FetchHistoryOrders;

  constructor() {}
}

export class FetchHistoryOrdersSuccess implements Action {
  readonly type = OrderActionType.FetchHistoryOrdersSuccess;

  constructor(public readonly orders: ChefOrderDetail[]) {}
}

export class FetchHistoryOrdersFailed implements Action {
  readonly type = OrderActionType.FetchHistoryOrdersFailed;

  constructor() {}
}

export class FetchOrderDetail implements Action {
  readonly type = OrderActionType.FetchOrderDetail;

  constructor(public readonly orderUuid: string) {}
}

export class FetchOrderDetailSuccess implements Action {
  readonly type = OrderActionType.FetchOrderDetailSuccess;

  constructor(public readonly response: ChefOrderDetail) {}
}

export class FetchOrderDetailFailed implements Action {
  readonly type = OrderActionType.FetchOrderDetailFailed;

  constructor() {}
}

export class HandlePendingOrder implements Action {
  readonly type = OrderActionType.HandlePendingOrder;

  constructor(public readonly request: ChefHandlePendingRequest) {}
}

export class HandlePendingOrderSuccess implements Action {
  readonly type = OrderActionType.HandlePendingOrderSuccess;

  constructor() {}
}

export class HandlePendingOrderFailed implements Action {
  readonly type = OrderActionType.HandlePendingOrderFailed;

  constructor() {}
}

export class ConfirmOrderDelivery implements Action {
  readonly type = OrderActionType.ConfirmOrderDelivery;

  constructor(public readonly request: ChefOrderConfirmDeliveryRequest) {}
}

export class ConfirmOrderDeliverySuccess implements Action {
  readonly type = OrderActionType.ConfirmOrderDeliverySuccess;

  constructor() {}
}

export class ConfirmOrderDeliveryFailed implements Action {
  readonly type = OrderActionType.ConfirmOrderDeliveryFailed;

  constructor() {}
}


export type OrderAction =
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
  | HandlePendingOrder
  | HandlePendingOrderSuccess
  | HandlePendingOrderFailed
  | ConfirmOrderDelivery
  | ConfirmOrderDeliverySuccess
  | ConfirmOrderDeliveryFailed
;
