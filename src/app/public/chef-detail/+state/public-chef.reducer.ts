import { PublicChefAction, PublicChefActionType } from './public-chef.actions';
import { combineReducers } from '@ngrx/store';
import { PublicChefDetail, PublicChefSuggestionInfo } from '../chef';

export interface VisitState {
  visited: boolean;
}

export interface PublicChefInfo {
  detail: PublicChefDetail;
  suggestions: PublicChefSuggestionInfo[];
}

export interface PublicChefState {
  state: PublicChefInfo;
}

export const publicInitialState: PublicChefInfo = {
  detail: {
    id: -1,
    profileName: null,
    profilePicture: null,
    aboutMe: null,
    cuisines: [],
    activeOffers: null,
    mealsServed: null,
    rating: null,
    totalReviews: null,
    offers: [],
  },
  suggestions: [],
};


export function detail(state = publicInitialState.detail, action: PublicChefAction): PublicChefDetail {
  switch (action.type) {
    case PublicChefActionType.PublicFetchChefDetailSuccess:
      state = { ...action.response };
      return state;
    default:
      return state;
  }
}

export function suggestions(state = publicInitialState.suggestions, action: PublicChefAction): PublicChefSuggestionInfo[] {
  switch (action.type) {
    case PublicChefActionType.PublicFetchChefSuggestionByNameSuccess:
      state = [ ...action.response ];
      return state;
    default:
      return state;
  }
}

const reducer: (state: PublicChefInfo, action: PublicChefAction) => PublicChefInfo = combineReducers({
  detail,
  suggestions,
});

export function publicChefReducer(state: PublicChefInfo = publicInitialState, action: PublicChefAction): PublicChefInfo {
  return reducer(state, action);
}
