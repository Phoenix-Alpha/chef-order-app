import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OfferInfo, OfferState } from './offer.reducer';

export const getOfferState = createFeatureSelector<OfferInfo>('public-offer');
export const getOfferDetail = createSelector(getOfferState, (state: OfferInfo) => state.offerDetail);
export const getOfferSuggestions = createSelector(getOfferState, (state: OfferInfo) => state.suggestions);
export const getTopOffers = createSelector(getOfferState, (state: OfferInfo) => state.topOffers);