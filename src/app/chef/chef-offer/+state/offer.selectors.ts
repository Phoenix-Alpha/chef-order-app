import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Offer, OfferState } from './offer.reducer';

export const getOfferState = createFeatureSelector<Offer>('offer');
export const getOfferCreateState = createSelector(getOfferState, (state: Offer) => state.register);
export const getOfferCreateStatus = createSelector(getOfferState, (state: Offer) => state.register.status);
export const getOfferCreateDetailInfo = createSelector(getOfferState, (state: Offer) => state.register.detail);
export const getOfferCreateGeneralInfo = createSelector(getOfferState, (state: Offer) => state.register.detail.generalInfo);
export const getOfferCreateDishDetailInfo = createSelector(getOfferState, (state: Offer) => state.register.detail.dishDetailInfo);
export const getOfferCreateDeliveryOptionsInfo = createSelector(getOfferState, (state: Offer) => state.register.detail.deliveryOptionsInfo);
export const getOfferCreatePriceInfo = createSelector(getOfferState, (state: Offer) => state.register.detail.priceInfo);
// export const getOfferDetail = createSelector(getOfferState, (state: Offer) => state.offerDetail);
export const getActiveOfferList = createSelector(getOfferState, (state: Offer) => state.offerLists.activeList);
export const getDraftOfferList = createSelector(getOfferState, (state: Offer) => state.offerLists.draftList);
export const getArchiveOfferList = createSelector(getOfferState, (state: Offer) => state.offerLists.archiveList);
