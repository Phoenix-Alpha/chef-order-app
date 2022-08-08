import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicOrder, PublicOrderState } from './order.reducer';

export const getPublicOrderState = createFeatureSelector<PublicOrder>('public-order');
export const getPublicOrderDetail = createSelector(getPublicOrderState, (state: PublicOrder) => state.orderDetail);
export const getPendingOrderList = createSelector(getPublicOrderState, (state: PublicOrder) => state.orderLists.pendingList);
export const getInprepOrderList = createSelector(getPublicOrderState, (state: PublicOrder) => state.orderLists.inPrepList);
export const getHistoryOrderList = createSelector(getPublicOrderState, (state: PublicOrder) => state.orderLists.historyList);
