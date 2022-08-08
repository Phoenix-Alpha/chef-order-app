import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicInfo, PublicState } from './public.reducer';

export const getPublicState = createFeatureSelector<PublicInfo>('public');
export const getVisited = createSelector(getPublicState, (state: PublicInfo) => state.visitState.visited);
