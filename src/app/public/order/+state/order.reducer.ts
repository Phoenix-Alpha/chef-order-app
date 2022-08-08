import { combineReducers } from '@ngrx/store';
import { PublicOrderResponse } from '../../checkout/checkout';
import { PublicOrderAction, PublicOrderActionType } from './order.actions';


export interface PublicOrderListsByStatus {
  pendingList: PublicOrderResponse[];
  inPrepList: PublicOrderResponse[];
  historyList: PublicOrderResponse[];
}

export interface PublicOrder {
  orderLists: PublicOrderListsByStatus;
  orderDetail: PublicOrderResponse;
}

export interface PublicOrderState {
  auth: PublicOrder;
}

export const publicOrderInitialState: PublicOrder = {
  orderLists: {
    pendingList: [],
    inPrepList: [],
    historyList: [],
  },
  orderDetail: {
    uuid: '',
    orderNumber: '',
    status: null,
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhoneNumber: '',
    deliveryStreetAddress: '',
    deliveryCity: '',
    deliveryPostcode: '',
    deliveryMethod: null,
    pickupCode: null,
    pickupDate: null,
    offer: null,
    quantity: -1,
    totalNonDiscountedCost: -1,
    totalDiscountedCost: -1,
    coupon: '',
    paymentMethod: null,
    paymentStatus: null,
  },
};

export function orderLists(state = publicOrderInitialState.orderLists, action: PublicOrderAction): PublicOrderListsByStatus {
  switch (action.type) {
    case PublicOrderActionType.FetchPendingOrdersSuccess:
      {
        return {
          ...state,
          pendingList: [ ...action.orders ]
        }
      }
      case PublicOrderActionType.FetchInprepOrdersSuccess:
      {
        return {
          ...state,
          inPrepList: [ ...action.orders ]
        }
      }
      case PublicOrderActionType.FetchHistoryOrdersSuccess:
      {
        return {
          ...state,
          historyList: [ ...action.orders ]
        }
      }
    default:
      return state;
  }
}

export function orderDetail(state = publicOrderInitialState.orderDetail, action: PublicOrderAction): PublicOrderResponse {
  switch (action.type) {
    case PublicOrderActionType.FetchOrderDetailSuccess:
      return { ...action.response };
    case PublicOrderActionType.FetchOrderDetailFailed:
      return { ...publicOrderInitialState.orderDetail };
    default:
      return state;
  }
}


const reducer: (state: PublicOrder, action: PublicOrderAction) => PublicOrder = combineReducers({
  orderLists,
  orderDetail,
});

export function publicOrderReducer(state: PublicOrder = publicOrderInitialState, action: PublicOrderAction): PublicOrder {
  return reducer(state, action);
}
