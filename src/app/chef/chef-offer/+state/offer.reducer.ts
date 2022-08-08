import { OfferAction, OfferActionType } from './offer.actions';
import { combineReducers } from '@ngrx/store';
import { OfferDetail, ChefOfferCreateRequest, OfferStatus, OfferType, OfferDeliveryZone } from '../offer';

export type CreateStatus = 'INITIAL' | 'REGISTERED' | 'FAILED' | 'LOADED' | 'UPDATED' | 'UPLOADINGOFFERPICTURE' | 'UPLOADINGOFFERPICTURESUCCESS' | 'UPLOADINGOFFERPICTUREFAILED';

export interface ChefOfferGeneralInfoDetail {
  email: string;
  status: OfferStatus;
  title: string;
  description: string;
  offerPicture1: string;
  offerPicture2: string;
  offerPicture3: string;
  isValid: boolean;
}

export const chefOfferGeneralInfoDetailInitial: ChefOfferGeneralInfoDetail = {
  email: '',
  status: OfferStatus.DRAFT,
  title: '',
  description: '',
  offerPicture1: null,
  offerPicture2: null,
  offerPicture3: null,
  isValid: false,
}

export interface ChefOfferDishInfoDetail {
  cuisines: string[];
  tags: string[];
  allergens: string[];
  weight: number;
  offerType: OfferType;
  servingStart: string;
  servingEnd: string;
  orderUntil: string;
  minPreorderHours: number;
  maxQuantity: number;
  isValid: boolean;
}

export const chefOfferDishInfoDetailInitial: ChefOfferDishInfoDetail = {
  cuisines: [],
  tags: [],
  allergens: [],
  offerType: OfferType.PREORDER,
  weight: null,
  servingStart: null,
  servingEnd: null,
  orderUntil: null,
  maxQuantity: null,
  minPreorderHours: null,
  isValid: false,
}

export interface ChefOfferDeliveryOptionsInfoDetail {
  isPickup: boolean;
  isDelivery: boolean;
  servingAddress: string;
  servingPostcode: string;
  servingCity: string;
  zone1MaxDistance: number;
  zone1DeliveryPrice: number;
  zone2MaxDistance: number;
  zone2DeliveryPrice: number;
  zone3MaxDistance: number;
  zone3DeliveryPrice: number;
  minFreeDeliveryAmount: number;
  isValid: boolean;
}

export const chefOfferDeliveryOptionsInfoDetailInitial: ChefOfferDeliveryOptionsInfoDetail = {
  isPickup: true,
  isDelivery: true,
  servingAddress: null,
  servingPostcode: null,
  servingCity: null,
  zone1MaxDistance: null,
  zone1DeliveryPrice: null,
  zone2MaxDistance: null,
  zone2DeliveryPrice: null,
  zone3MaxDistance: null,
  zone3DeliveryPrice: null,
  minFreeDeliveryAmount: null,
  isValid: false,
}

export interface ChefOfferPriceInfoDetail {
  price: number;
  isValid: boolean;
}

export const chefOfferPriceInfoDetailInitial: ChefOfferPriceInfoDetail = {
  price: 0,
  isValid: false,
}

export interface ChefOfferInfoDetail {
  offerId: number;
  generalInfo: ChefOfferGeneralInfoDetail;
  dishDetailInfo: ChefOfferDishInfoDetail;
  deliveryOptionsInfo: ChefOfferDeliveryOptionsInfoDetail;
  priceInfo: ChefOfferPriceInfoDetail;
}

export interface CreateState {
  status: CreateStatus;
  errorMessage: string;
  detail: ChefOfferInfoDetail;
}

export interface OfferListsByStatus {
  draftList: OfferDetail[];
  activeList: OfferDetail[];
  archiveList: OfferDetail[];
}


export interface Offer {
  offerLists: OfferListsByStatus;
  // offerDetail: OfferDetail;
  register: CreateState;
}

export interface OfferState {
  auth: Offer;
}

export const offerInitialState: Offer = {
  offerLists: {
    draftList: [],
    activeList: [],
    archiveList: [],
  },
  // offerDetail: {
  //   offerId: -1,
  //   status: OfferStatus.DRAFT,
  //   offerType: OfferType.PREORDER,
  //   title: '',
  //   description: '',
  //   weight: 0,
  //   servingAddress: '',
  //   servingPostcode: '',
  //   servingCity: '',
  //   servingStart: '',
  //   servingEnd: '',
  //   price: 0,
  //   maxQuantity: 0,
  //   quantityAvailable: 0,
  //   isPickup: false,
  //   isDelivery: false,
  //   minPreorderHours: 0,
  //   offerPictures: [],
  //   cuisines: [],
  //   tags: [],
  //   allergens: [],
  //   zones: []
  // },
  register: {
    status: 'INITIAL',
    errorMessage: '',
    detail: {
      offerId: -1,
      generalInfo: chefOfferGeneralInfoDetailInitial,
      dishDetailInfo: chefOfferDishInfoDetailInitial,
      deliveryOptionsInfo: chefOfferDeliveryOptionsInfoDetailInitial,
      priceInfo: chefOfferPriceInfoDetailInitial,
    }
  },
};

export function offerLists(state = offerInitialState.offerLists, action: OfferAction): OfferListsByStatus {
  switch (action.type) {
    case OfferActionType.FetchOffersByStatusSuccess:
      {
        if (action.status === OfferStatus.DRAFT) {
          return {
            ...state,
            draftList: [ ...action.offers ]
          }
        } else if (action.status === OfferStatus.ACTIVE) {
          return {
            ...state,
            activeList: [ ...action.offers ]
          }
        } else if (action.status === OfferStatus.ARCHIVE) {
          return {
            ...state,
            archiveList: [ ...action.offers ]
          }
        }
      }
    default:
      return state;
  }
}

// export function offerDetail(state = offerInitialState.offerDetail, action: OfferAction): OfferDetail {
//   switch (action.type) {
//     case OfferActionType.FetchOfferDetailSuccess:
//       return { ...action.offerDetail };
//     case OfferActionType.FetchOfferDetailFailed:
//       return { ...offerInitialState.offerDetail };
//     case OfferActionType.OfferCreateSuccess:
//       return { ...action.response }
//     default:
//       return state;
//   }
// }

export function register(state = offerInitialState.register, action: OfferAction): CreateState {
  switch (action.type) {
    case OfferActionType.InitializeChefOfferInfoDetail:
      return { ...offerInitialState.register };
    case OfferActionType.OfferCreateSuccess:
      return { ...state, errorMessage: '', status: 'REGISTERED'};
    case OfferActionType.OfferCreateFailed:
      return { ...state, errorMessage: action.error, status: 'FAILED'};
    case OfferActionType.UpdateOfferSuccess:
      return { ...state, errorMessage: '', status: 'UPDATED'};
    case OfferActionType.UpdateOfferFailed:
      return { ...state, errorMessage: action.error, status: 'FAILED'};
    case OfferActionType.InitializeChefOfferInfoDetailFromExistingSuccess:
      return { 
        detail: { ...action.detail },
        errorMessage: '',
        status: 'INITIAL',
      };
    case OfferActionType.FetchOfferDetailSuccess:
      return { 
        detail: { ...action.detail },
        errorMessage: '',
        status: 'LOADED'
      };
    case OfferActionType.FetchOfferDetailFailed:
      return { ...offerInitialState.register, status: 'FAILED'};
    case OfferActionType.InitializeChefOfferInfoDetailFromExistingFailed:
      return { ...offerInitialState.register, status: 'FAILED'};
    case OfferActionType.SaveOfferGeneralInfo:
      {
        return { 
          ...state,
          detail: {
            ...state.detail,
            generalInfo: { ...action.gernalInfo }
          }
        };
      }
    case OfferActionType.SaveOfferDishDetailInfo:
      {
        return { 
          ...state,
          detail: {
            ...state.detail,
            dishDetailInfo: { ...action.dishDetailInfo }
          }
        };
      }
    case OfferActionType.SaveOfferDeliveryOptionsInfo:
      {
        return { 
          ...state,
          detail: {
            ...state.detail,
            deliveryOptionsInfo: { ...action.deliveryOptionsInfo }
          }
        };
      }
    case OfferActionType.SaveOfferPriceInfo:
      {
        return { 
          ...state,
          detail: {
            ...state.detail,
            priceInfo: { ...action.priceInfo }
          }
        };
      }
    case OfferActionType.UploadOfferPicture:
      return { ...state, status: 'UPLOADINGOFFERPICTURE' };
    case OfferActionType.UploadOfferPictureSuccess: 
      {
        if (!state.detail.generalInfo.offerPicture1) {
          return { 
            ...state,
            status: 'UPLOADINGOFFERPICTURESUCCESS',
            detail: {
              ...state.detail,
              generalInfo: {
                ...state.detail.generalInfo,
                offerPicture1: action.response.url,
              }
            }
          };
        }

        if (!state.detail.generalInfo.offerPicture2) {
          return { 
            ...state,
            status: 'UPLOADINGOFFERPICTURESUCCESS',
            detail: {
              ...state.detail,
              generalInfo: {
                ...state.detail.generalInfo,
                offerPicture2: action.response.url,
              }
            }
          };
        }

        if (!state.detail.generalInfo.offerPicture3) {
          return { 
            ...state,
            status: 'UPLOADINGOFFERPICTURESUCCESS',
            detail: {
              ...state.detail,
              generalInfo: {
                ...state.detail.generalInfo,
                offerPicture3: action.response.url,
              }
            }
          };
        }

        return state;
      }
    case OfferActionType.UploadOfferPictureFailed:
      return { ...state, status: 'UPLOADINGOFFERPICTUREFAILED' };
    default:
      return state;
  }
}

const reducer: (state: Offer, action: OfferAction) => Offer = combineReducers({
  offerLists,
  // offerDetail,
  register,
});

export function offerReducer(state: Offer = offerInitialState, action: OfferAction): Offer {
  return reducer(state, action);
}
