import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ResultInfo, ResultState } from './result.reducer';

export const getResultState = createFeatureSelector<ResultInfo>('result');
export const getOffers = createSelector(getResultState, (state: ResultInfo) => state.offers);
export const getFilterState = createSelector(getResultState, (state: ResultInfo) => state.filterState);