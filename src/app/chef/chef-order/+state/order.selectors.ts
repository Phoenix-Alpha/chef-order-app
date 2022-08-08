import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Order, OrderState } from './order.reducer';

export const getChefOrderState = createFeatureSelector<Order>('order');
export const getChefOrderDetail = createSelector(getChefOrderState, (state: Order) => state.orderDetail);
export const getPendingOrderList = createSelector(getChefOrderState, (state: Order) => state.orderLists.pendingList);
export const getInprepOrderList = createSelector(getChefOrderState, (state: Order) => state.orderLists.inPrepList);
export const getHistoryOrderList = createSelector(getChefOrderState, (state: Order) => state.orderLists.historyList);
