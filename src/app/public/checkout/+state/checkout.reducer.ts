import { PublicOrderResponse } from './../checkout';
import { CheckoutAction, CheckoutActionType } from './checkout.actions';
import { PublicOfferInfo } from '../../results-page/+state/result.reducer';
import { combineReducers } from '@ngrx/store';

export enum BasketStatus {
  DRAFT = "DRAFT",
  SUBMITTING = "SUBMITTING",
  // SUBMITTED = "SUBMITTED",
  PAYMENTPROGRESS = "PAYMENTPROGRESS",
  PAYMENTCOMPLETE = "PAYMENTCOMPLETE",
  PAYMENTFAILED = "PAYMENTFAILED",
  FAILED = "FAILED",
}

export interface PublicOrder {
  offer: PublicOfferInfo;
  amount: number;
  discountedTotal: number;
  nonDiscountedTotal: number;
  pickupDate: string;
  specialNote: string;
}

export interface BasketInfo {
  orders: PublicOrder[];
  user: UserInfo;
  voucherCode: string;
  discountedTotal: number;
  nonDiscountedTotal: number;
  publicOrderResponse: PublicOrderResponse;
  status: BasketStatus;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetHouseNumber: string;
  postcode: string;
  city: string;
  coupon: string;
}

export interface CheckoutState {
  basketInfo: BasketInfo;
  userInfo: UserInfo;
}
export const userInfoInitialState: UserInfo = {
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  streetHouseNumber: null,
  postcode: null,
  city: null,
  coupon: null,
}

export const basketInitialState: BasketInfo = {
  orders: [],
  user: null,
  voucherCode: null,
  discountedTotal: 0.0,
  nonDiscountedTotal: 0.0,
  publicOrderResponse: null,
  status: BasketStatus.DRAFT,
};

export const checkoutInitialState: CheckoutState = {
  basketInfo: basketInitialState,
  userInfo: userInfoInitialState,
}

export function basketInfo(state = basketInitialState, action: CheckoutAction): BasketInfo {
  switch (action.type) {
    case CheckoutActionType.InitializeBasket:
      return { ...basketInitialState };
    case CheckoutActionType.AddOrderToBasket:
      {
        const index = state.orders.findIndex((item) => item.offer.offerId === action.order.offer.offerId);
        if (index !== -1) {
          const newState = {
            ...state,
            orders:  [...state.orders],
            discountedTotal: state.discountedTotal,
          };
          newState.orders[index] = {
            ...newState.orders[index],
            amount: newState.orders[index].amount + action.order.amount,
            discountedTotal: (newState.orders[index].amount + action.order.amount) * newState.orders[index].offer.price,
            nonDiscountedTotal: (newState.orders[index].amount + action.order.amount) * newState.orders[index].offer.price,
          };
          newState.discountedTotal = state.discountedTotal + newState.orders[index].discountedTotal;
          return newState;
        }
        return {
          ...state,
          orders: state.orders.concat([action.order]),
        };
      }
    case CheckoutActionType.ReduceOrderAmount:
      {
        const index = state.orders.findIndex((item) => item.offer.offerId === action.offerId);
        if (index === -1) {
          return state;
        }
        if (state.orders[index].amount === 1) {
          return {
            ...state,
            orders: state.orders.filter((item) => item.offer.offerId !== action.offerId),
          };
        }
        const newState = {
          ...state,
          orders:  [...state.orders],
        };
        newState.orders[index] = {
          ...newState.orders[index],
          amount: newState.orders[index].amount - 1,
          discountedTotal: (newState.orders[index].amount - 1) * newState.orders[index].offer.price,
          nonDiscountedTotal: (newState.orders[index].amount - 1) * newState.orders[index].offer.price,
        };
        return newState;
      }
    case CheckoutActionType.IncrementOrderAmount:
      {
        const index = state.orders.findIndex((item) => item.offer.offerId === action.offerId);
        const newState = {
          ...state,
          orders:  [...state.orders],
        };
        newState.orders[index] = {
          ...newState.orders[index],
          amount: newState.orders[index].amount + 1,
          discountedTotal: (newState.orders[index].amount + 1) * newState.orders[index].offer.price,
          nonDiscountedTotal: (newState.orders[index].amount + 1) * newState.orders[index].offer.price,
        };
        return newState;
      }
    case CheckoutActionType.UpdateTotal:
      {
        const newState = {
          ...state,
          nonDiscountedTotal: state.nonDiscountedTotal,
          discountedTotal: state.discountedTotal,
        };
        newState.discountedTotal = action.total;
        newState.nonDiscountedTotal = action.total;
        return newState;
      }
    // needs to be modified when multiple orders enabled
    case CheckoutActionType.UpdateSpecialNote:
      {
        const index = state.orders.findIndex((item) => item.offer.offerId === action.offerId);
        const newState = {
          ...state,
          orders:  [...state.orders],
        };
        newState.orders[index] = {
          ...newState.orders[index],
          specialNote: action.specialNote,
        }
        return newState;
      }
    case CheckoutActionType.PublicOrderCreate:
      {
        const newState = {
          ...state,
          status: BasketStatus.SUBMITTING,
        }
        return newState;
      }
    case CheckoutActionType.PublicOrderCreateSuccess:
      {
        const newState = {
          ...state,
          // status: BasketStatus.SUBMITTED,
          status: BasketStatus.PAYMENTPROGRESS,
          publicOrderResponse: state.publicOrderResponse,
        }
        newState.publicOrderResponse = action.publicOrderResponse;
        return newState;
      }
    case CheckoutActionType.PublicOrderCreateFailed:
      {
        const newState = {
          ...state,
          status: BasketStatus.FAILED,
        }
        return newState;
      }
    case CheckoutActionType.UpdateCheckoutBasketStatus:
      {
        const newState = {
          ...state,
          status: action.newStatus,
        }
        return newState;
      }
    default:
      return state;
  }
}

export function userInfo(state = userInfoInitialState, action: CheckoutAction): UserInfo {
  switch (action.type) {
    case CheckoutActionType.UpdateCheckoutUserInfo:
      return { ...action.newUserInfo };
    default:
      return state;
  }
}

const reducer: (state: CheckoutState, action: CheckoutAction) => CheckoutState = combineReducers({
  basketInfo,
  userInfo,
});

export function checkoutReducer(state: CheckoutState = checkoutInitialState, action: CheckoutAction) {
  return reducer(state, action);
}
