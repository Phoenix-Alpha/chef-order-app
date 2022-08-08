import { PublicOfferAction, PublicOfferActionType } from './offer.actions';
import { combineReducers } from '@ngrx/store';
import { PublicOfferInfo } from '../../results-page/+state/result.reducer';
import { PublicOfferSuggestionInfo } from '../offer';

export interface OfferInfo {
  offerDetail: PublicOfferInfo;
  suggestions: PublicOfferSuggestionInfo[];
  topOffers: PublicOfferSuggestionInfo[];
}

export interface OfferState {
  state: OfferInfo;
}

export const offerInitialState: OfferInfo = {
  offerDetail: null,
  suggestions: [],
  topOffers: [],
};


export function offerDetail(state = offerInitialState.offerDetail, action: PublicOfferAction): PublicOfferInfo {
  switch (action.type) {
    case PublicOfferActionType.PublicFetchOfferDetailSuccess:
      state = { ...action.offerDetail };
      return state;
    default:
      return state;
  }
}

export function suggestions(state = offerInitialState.suggestions, action: PublicOfferAction): PublicOfferSuggestionInfo[] {
  switch (action.type) {
    case PublicOfferActionType.PublicFetchOfferSuggestionsSuccess:
      state = [ ...action.response ];
      return state;
    default:
      return state;
  }
}

export function topOffers(state = offerInitialState.topOffers, action: PublicOfferAction): PublicOfferSuggestionInfo[] {
  switch (action.type) {
    case PublicOfferActionType.PublicFetchTopOffersSuccess:
      state = [ ...action.response ];
      return state;
    default:
      return state;
  }
}

const reducer: (state: OfferInfo, action: PublicOfferAction) => OfferInfo = combineReducers({
  offerDetail,
  suggestions,
  topOffers
});

export function publicOfferReducer(state: OfferInfo = offerInitialState, action: PublicOfferAction): OfferInfo {
  return reducer(state, action);
}
