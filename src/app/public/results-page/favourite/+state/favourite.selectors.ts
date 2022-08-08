import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavouriteInfo, FavouriteState } from './favourite.reducer';

export const getFavouriteState = createFeatureSelector<FavouriteInfo>('favourite');
export const getFavouriteOffers = createSelector(getFavouriteState, (state: FavouriteInfo) => state.offers);
export const getFavouriteChefs = createSelector(getFavouriteState, (state: FavouriteInfo) => state.chefs);
