import { Action } from '@ngrx/store';
import { PublicChefDetail, PublicChefSuggestionInfo } from '../chef';

export enum PublicChefActionType {
  PublicFetchChefDetail = '[public-chef] PublicFetchChefDetail',
  PublicFetchChefDetailSuccess = '[public-chef] PublicFetchChefDetailSuccess',
  PublicFetchChefDetailFailed = '[public-chef] PublicFetchChefDetailFailed',
  PublicFetchChefSuggestionByName = '[public-chef] PublicFetchChefSuggestionByName',
  PublicFetchChefSuggestionByNameSuccess = '[public-chef] PublicFetchChefSuggestionByNameSuccess',
  PublicFetchChefSuggestionByNameFailed = '[public-chef] PublicFetchChefSuggestionByNameFailed',
}

export class PublicFetchChefDetail implements Action {
  readonly type = PublicChefActionType.PublicFetchChefDetail;
  constructor(public readonly chefId: number, public readonly userAddress: string) {}
}

export class PublicFetchChefDetailSuccess implements Action {
  readonly type = PublicChefActionType.PublicFetchChefDetailSuccess;
  constructor(public readonly response: PublicChefDetail) {}
}

export class PublicFetchChefDetailFailed implements Action {
  readonly type = PublicChefActionType.PublicFetchChefDetailFailed;
  constructor() {}
}

export class PublicFetchChefSuggestionByName implements Action {
  readonly type = PublicChefActionType.PublicFetchChefSuggestionByName;
  constructor(public readonly chefName: string) {}
}

export class PublicFetchChefSuggestionByNameSuccess implements Action {
  readonly type = PublicChefActionType.PublicFetchChefSuggestionByNameSuccess;
  constructor(public readonly response: PublicChefSuggestionInfo[]) {}
}

export class PublicFetchChefSuggestionByNameFailed implements Action {
  readonly type = PublicChefActionType.PublicFetchChefSuggestionByNameFailed;
  constructor() {}
}


export type PublicChefAction =
  PublicFetchChefDetail
  | PublicFetchChefDetailSuccess
  | PublicFetchChefDetailFailed
  | PublicFetchChefSuggestionByName
  | PublicFetchChefSuggestionByNameSuccess
  | PublicFetchChefSuggestionByNameFailed
;
