import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CheckoutState } from "./checkout.reducer";

export const getCheckoutState = createFeatureSelector<CheckoutState>('checkout');
export const getOrders = createSelector(getCheckoutState, (state: CheckoutState) =>state.basketInfo.orders);
export const getDiscountedTotal = createSelector(getCheckoutState, (state: CheckoutState) => state.basketInfo.discountedTotal);
export const getCheckoutUserInfo = createSelector(getCheckoutState, (state: CheckoutState) =>state.userInfo);