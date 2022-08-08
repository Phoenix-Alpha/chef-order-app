import { FavouriteAction, FavouriteActionType } from './favourite.actions';
import { combineReducers } from '@ngrx/store';
import { PublicOfferInfo } from '../../+state/result.reducer';
import { PublicChefDetail } from 'src/app/public/chef-detail/chef';

export interface FavouriteInfo {
  offers: PublicOfferInfo[];
  chefs: PublicChefDetail[];
}

export interface FavouriteState {
  state: FavouriteInfo;
}

export const favouriteInitialState: FavouriteInfo = {
  offers: [],
  chefs: [],
};


export function offers(state = favouriteInitialState.offers, action: FavouriteAction): PublicOfferInfo[] {
  switch (action.type) {
    case FavouriteActionType.AddFavouriteOffer:
      {
        const newState = [ ...state ];
        const index = newState.findIndex(o => o.offerId === action.offer.offerId);
        if (index < 0) {
          newState.push(action.offer);
        }
        return [ ...newState ];
      }
    case FavouriteActionType.RemoveFavouriteOffer:
      {
        const newState = [ ...state ];
        const index = newState.findIndex(o => o.offerId === action.offerId);
        if (index >= 0) {
          newState.splice(index, 1);
        }
        return [ ...newState ];
      }
    case FavouriteActionType.UpdateFavouriteOfferInfo:

    default:
      return state;
  }
}

export function chefs(state = favouriteInitialState.chefs, action: FavouriteAction): PublicChefDetail[] {
  switch (action.type) {
    case FavouriteActionType.AddFavouriteChef:
      {
        const newState = [ ...state ];
        const index = newState.findIndex(o => o.id === action.chef.id);
        if (index < 0) {
          newState.push(action.chef);
        }
        return [ ...newState ];
      }
    case FavouriteActionType.RemoveFavouriteChef:
      {
        const newState = [ ...state ];
        const index = newState.findIndex(o => o.id === action.chefId);
        if (index >= 0) {
          newState.splice(index, 1);
        }
        return [ ...newState ];
      }
    case FavouriteActionType.UpdateFavouriteChefInfo:

    default:
      return state;
  }
}


const reducer: (state: FavouriteInfo, action: FavouriteAction) => FavouriteInfo = combineReducers({
  offers,
  chefs,
});

export function publicFavouriteReducer(state: FavouriteInfo = favouriteInitialState, action: FavouriteAction): FavouriteInfo {
  return reducer(state, action);
}
