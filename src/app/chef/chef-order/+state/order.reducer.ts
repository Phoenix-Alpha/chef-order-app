import { combineReducers } from '@ngrx/store';
import { ChefOrderDetail, DeliveryMethod, OrderStatus } from '../order';
import { OrderAction, OrderActionType } from './order.actions';

export interface OrderListsByStatus {
  pendingList: ChefOrderDetail[];
  inPrepList: ChefOrderDetail[];
  historyList: ChefOrderDetail[];
}

export interface Order {
  orderLists: OrderListsByStatus;
  orderDetail: ChefOrderDetail;
}

export interface OrderState {
  auth: Order;
}

export const orderInitialState: Order = {
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
    deliveryCost: -1,
    deliveryMethod: null,
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

export function orderLists(state = orderInitialState.orderLists, action: OrderAction): OrderListsByStatus {
  switch (action.type) {
    case OrderActionType.FetchPendingOrdersSuccess:
      {
        return {
          ...state,
          pendingList: [ ...action.orders ]
        }
      }
      case OrderActionType.FetchInprepOrdersSuccess:
      {
        return {
          ...state,
          inPrepList: [ ...action.orders ]
        }
      }
      case OrderActionType.FetchHistoryOrdersSuccess:
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

export function orderDetail(state = orderInitialState.orderDetail, action: OrderAction): ChefOrderDetail {
  switch (action.type) {
    case OrderActionType.FetchOrderDetailSuccess:
      return { ...action.response };
    case OrderActionType.FetchOrderDetailFailed:
      return { ...orderInitialState.orderDetail };
    case OrderActionType.ConfirmOrderDeliverySuccess:
      return {
        ...state,
        status: OrderStatus.CONFIRMED
      }
    default:
      return state;
  }
}


const reducer: (state: Order, action: OrderAction) => Order = combineReducers({
  orderLists,
  orderDetail,
});

export function orderReducer(state: Order = orderInitialState, action: OrderAction): Order {
  return reducer(state, action);
}
