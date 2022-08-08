import { PublicAction, PublicActionType } from './public.actions';
import { combineReducers } from '@ngrx/store';

export interface VisitState {
  visited: boolean;
}

export interface UserInformation {
  currentAddress: string;
}

export interface PublicInfo {
  visitState: VisitState;
}

export interface PublicState {
  state: PublicInfo;
}

export const publicInitialState: PublicInfo = {
  visitState: {
    visited: false,
  },
};


export function visitState(visitState = publicInitialState.visitState, action: PublicAction): VisitState {
  switch (action.type) {
    case PublicActionType.SetVisited:
      {
        const newState = { ...visitState };
        newState.visited = true;
        return newState;
      }
    default:
      return visitState;
  }
}

const reducer: (state: PublicInfo, action: PublicAction) => PublicInfo = combineReducers({
  visitState,
});

export function publicReducer(state: PublicInfo = publicInitialState, action: PublicAction): PublicInfo {
  return reducer(state, action);
}
