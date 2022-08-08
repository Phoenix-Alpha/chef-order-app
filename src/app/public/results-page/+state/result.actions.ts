import { Action } from '@ngrx/store';
import { PageableResults } from 'src/app/api/types/Pageable';
import { PublicOfferInfo, PublicOfferSearchFilterState } from './result.reducer';

export enum ResultActionType {
  InitializeOffers = '[result] InitializeOffers',
  SearchOffers = '[result] SearchOffers',
  SearchOffersSuccess = '[result] SearchOffersSuccess',
  SearchOffersFailed = '[result] SearchOffersFailed',
  InitializePublicOfferSearchFilterState = '[result] InitializePublicOfferSearchFilterState',
  UpdatePublicOfferSearchFilterState = '[result] UpdatePublicOfferSearchFilterState',
}

export class InitializeOffers implements Action {
  readonly type = ResultActionType.InitializeOffers;
  constructor() {}
}

export class SearchOffers implements Action {
  readonly type = ResultActionType.SearchOffers;
  constructor() {}
}

export class SearchOffersSuccess implements Action {
  readonly type = ResultActionType.SearchOffersSuccess;
  constructor(public readonly offers: PageableResults<PublicOfferInfo>) {}
}

export class SearchOffersFailed implements Action {
  readonly type = ResultActionType.SearchOffersFailed;
  constructor() {}
}

export class InitializePublicOfferSearchFilterState implements Action {
  readonly type = ResultActionType.InitializePublicOfferSearchFilterState;
  constructor() {}
}

export class UpdatePublicOfferSearchFilterState implements Action {
  readonly type = ResultActionType.UpdatePublicOfferSearchFilterState;
  constructor(public readonly newState: PublicOfferSearchFilterState) {}
}

export type ResultAction =
  InitializeOffers
  | SearchOffers
  | SearchOffersSuccess
  | SearchOffersFailed
  | InitializePublicOfferSearchFilterState
  | UpdatePublicOfferSearchFilterState
;
