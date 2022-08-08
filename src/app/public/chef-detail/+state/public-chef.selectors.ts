import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicChefInfo, PublicChefState } from './public-chef.reducer';

export const getPublicState = createFeatureSelector<PublicChefInfo>('public-chef');
export const getPublicChefDetail = createSelector(getPublicState, (state: PublicChefInfo) => state.detail);
export const getPublicChefSuggestions = createSelector(getPublicState, (state: PublicChefInfo) => state.suggestions);