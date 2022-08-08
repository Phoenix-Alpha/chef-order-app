import { ResultAction, ResultActionType } from './result.actions';
import { combineReducers } from '@ngrx/store';
import { OfferDeliveryZone, OfferStatus, OfferType } from 'src/app/chef/chef-offer/offer';
import { OfferSortMode } from '../results';

export interface PublicOfferInfo {
  chefId: number;
	chefProfileName: string;
	chefProfilePicture: string;
	chefTotalReviews: number;
	chefRating: number;
	
	offerId: number;
	status: OfferStatus;
	offerType: OfferType;
	title: string;
	description: string;
	weight: number;
	
	servingAddress: string;
	servingPostcode: string;
	servingCity: string;
	latitude: number;
	longitude: number;
	distance: number;
	distanceScore: number;
	
	servingStart: string;
	servingEnd: string;
	orderUntil: string;
	dateDiff: number;
	dateScore: number;
	
	price: number;
	priceScore: number;
	
	minFreeDeliveryAmount: number;
	deliveryCost: number;
	deliveryCostScore: number;
	
	maxQuantity: number;
	quantityAvailable: number;
	
	isPickup: boolean;
	isDelivery: boolean;
	minPreorderHours: number;
	
	zones: OfferDeliveryZone[];
	offerPictures: string[];
  cuisines: string[];
  allergens: string[];
  tags: string[];
  
  totalScore: number;
}

export interface PublicOfferSearchFilterState {
  chefName: string;
  chefRating: number;
  userAddress: string;
  offerName: string;
  offerType: OfferType | null;
  distance: number;
  sortMode: OfferSortMode;
  servingDate: string;
  isPickup: boolean;
  isDelivery: boolean;
}

export interface ResultInfo {
  offers: PublicOfferInfo[];
  filterState: PublicOfferSearchFilterState;
}

export interface ResultState {
  state: ResultInfo;
}

export const resultInitialState: ResultInfo = {
  offers: [],
  filterState: {
    chefName: null,
    chefRating: 0.0,
    userAddress: '54 rue Nationale, Paris',
    offerName: null,
    offerType: null,
    distance: 30.0,
    sortMode: OfferSortMode.BESTMATCH,
    servingDate: null,
    isPickup: null,
    isDelivery: null,
  },
};


export function offers(state = resultInitialState.offers, action: ResultAction): PublicOfferInfo[] {
  switch (action.type) {
    case ResultActionType.InitializeOffers:
      return [];
    case ResultActionType.SearchOffersSuccess:
      return [ ...action.offers.data ];
    case ResultActionType.SearchOffersFailed:
      return [];
    default:
      return state;
  }
}

export function filterState(state = resultInitialState.filterState, action: ResultAction): PublicOfferSearchFilterState {
  switch (action.type) {
    case ResultActionType.InitializePublicOfferSearchFilterState:
      return { ...resultInitialState.filterState };
    case ResultActionType.UpdatePublicOfferSearchFilterState:
      return { ...action.newState };
    default:
      return state;
  }
}

const reducer: (state: ResultInfo, action: ResultAction) => ResultInfo = combineReducers({
  offers,
  filterState,
});

export function resultReducer(state: ResultInfo = resultInitialState, action: ResultAction): ResultInfo {
  return reducer(state, action);
}
