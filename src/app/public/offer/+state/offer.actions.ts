import { Action } from '@ngrx/store';
import { PublicOfferInfo } from '../../results-page/+state/result.reducer';
import { PublicOfferSuggestionInfo } from '../offer';

export enum PublicOfferActionType {
  PublicFetchOfferDetail = '[public-offer] PublicFetchOfferDetail',
  PublicFetchOfferDetailSuccess = '[public-offer] PublicFetchOfferDetailSuccess',
  PublicFetchOfferDetailFailed = '[public-offer] PublicFetchOfferDetailFailed',
  PublicFetchOfferSuggestions = '[public-offer] PublicFetchOfferSuggestions',
  PublicFetchOfferSuggestionsSuccess = '[public-offer] PublicFetchOfferSuggestionsSuccess',
  PublicFetchOfferSuggestionsFailed = '[public-offer] PublicFetchOfferSuggestionsFailed',
  PublicFetchTopOffers = '[result] PublicFetchTopOffers',
  PublicFetchTopOffersSuccess = '[result] PublicFetchTopOffersSuccess',
  PublicFetchTopOffersFailed = '[result] PublicFetchTopOffersFailed',
}

export class PublicFetchOfferDetail implements Action {
  readonly type = PublicOfferActionType.PublicFetchOfferDetail;
  constructor(public readonly offerId: number, public readonly userAddress: string) {}
}

export class PublicFetchOfferDetailSuccess implements Action {
  readonly type = PublicOfferActionType.PublicFetchOfferDetailSuccess;
  constructor(public readonly offerDetail: PublicOfferInfo) {}
}

export class PublicFetchOfferDetailFailed implements Action {
  readonly type = PublicOfferActionType.PublicFetchOfferDetailFailed;
  constructor() {}
}

export class PublicFetchOfferSuggestions implements Action {
  readonly type = PublicOfferActionType.PublicFetchOfferSuggestions;
  constructor(public readonly offerName: string) {}
}

export class PublicFetchOfferSuggestionsSuccess implements Action {
  readonly type = PublicOfferActionType.PublicFetchOfferSuggestionsSuccess;
  constructor(public readonly response: PublicOfferSuggestionInfo[]) {}
}

export class PublicFetchOfferSuggestionsFailed implements Action {
  readonly type = PublicOfferActionType.PublicFetchOfferSuggestionsFailed;
  constructor() {}
}

export class PublicFetchTopOffers implements Action {
  readonly type = PublicOfferActionType.PublicFetchTopOffers;
  constructor() {}
}

export class PublicFetchTopOffersSuccess implements Action {
  readonly type = PublicOfferActionType.PublicFetchTopOffersSuccess;
  constructor(public readonly response: PublicOfferSuggestionInfo[]) {}
}

export class PublicFetchTopOffersFailed implements Action {
  readonly type = PublicOfferActionType.PublicFetchTopOffersFailed;
  constructor() {}
}

export type PublicOfferAction =
  PublicFetchOfferDetail
  | PublicFetchOfferDetailSuccess
  | PublicFetchOfferDetailFailed
  | PublicFetchOfferSuggestions
  | PublicFetchOfferSuggestionsSuccess
  | PublicFetchOfferSuggestionsFailed
  | PublicFetchTopOffers
  | PublicFetchTopOffersSuccess
  | PublicFetchTopOffersFailed
;
