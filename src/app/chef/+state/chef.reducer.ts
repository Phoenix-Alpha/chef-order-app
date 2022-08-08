import { Language } from '../../api/types/Language';
import { ChefAction, ChefActionType } from './chef.actions';
import { combineReducers } from '@ngrx/store';
import { ChefDetail, ChefRegistrationDetail } from '../chef';

export type RegistrationStatus = 'INITIAL' | 'REGISTERED' | 'FAILED' | 'UPLOADINGPICTURE' | 'UPLOADINGPICTURESUCCESS' | 'UPLOADINGPICTUREFAILED';

export interface VisitState {
  orderInstructionVisited: boolean;
}
export interface RegisterState {
  status: RegistrationStatus;
  errorMessage: string;
  registrationDetail: ChefRegistrationDetail;
}

export interface Chef {
  visitState: VisitState;
  chefDetail: ChefDetail;
  register: RegisterState;
}

export interface ChefState {
  auth: Chef;
}

export const chefInitialState: Chef = {
  visitState: {
    orderInstructionVisited: false,
  },
  chefDetail: {
    status: 'INITIAL',
    id: -1,
    userId: -1,
    profileName: '',
    profilePicture: '',
    aboutMe: '',
    cuisines: [],
    sellPlan: '',
    activeOffers: 0,
    mealsServed: 0,
    totalReviews: 0,
    rating: 0,
    registeredAt: '',
  },
  register: {
    status: 'INITIAL',
    errorMessage: '',
    registrationDetail: {
      email: '',
      profileName: '',
      profilePicture: '',
      aboutMe: '',
      cuisines: [],
      sellPlan: '',
      referralCode: '',
    }
  },
};

export function visitState(visitState = chefInitialState.visitState, action: ChefAction): VisitState {
  switch (action.type) {
      case ChefActionType.SetChefOrderInstructionVisited:
        return {
          ...visitState,
          orderInstructionVisited: true,
        };
      default:
        return visitState;
  }
}

export function chefDetail(state = chefInitialState.chefDetail, action: ChefAction): ChefDetail {
  switch (action.type) {
    case ChefActionType.FetchChefDetailSuccess:
      return { ...action.chefDetail };
    case ChefActionType.UpdateChefProfileSuccess:
      return { ...action.chefDetail };
    case ChefActionType.FetchChefDetailFailed:
      return { ...chefInitialState.chefDetail };
    case ChefActionType.ChefRegisterSuccess:
      return { ...action.response, status: 'LOADED' };
    case ChefActionType.ChefRegisterFailed:
      return { ...state, status: 'FAILED' };
    case ChefActionType.UpdateChefAvatar:
      return { ...state, status: 'UPDATINGPICTURE' };
    case ChefActionType.UpdateChefAvatarSuccess:
      return { ...state,  status: 'UPDATINGPICTURESUCCESS', profilePicture: action.response.url };
    case ChefActionType.UpdateChefAvatarFailed:
      return { ...state,  status: 'UPDATINGPICTUREFAILED'};
    default:
      return state;
  }
}

export function register(state = chefInitialState.register, action: ChefAction): RegisterState {
  switch (action.type) {
    case ChefActionType.InitializeRegistrationState:
      return chefInitialState.register;
    case ChefActionType.ChefRegisterSuccess:
      return { ...state, errorMessage: '', status: 'REGISTERED'};
    case ChefActionType.ChefRegisterFailed:
      return { ...state, errorMessage: action.error, status: 'FAILED'};
    case ChefActionType.PrepareChefRegister:
      {
        const newState = { ...state };
        newState.registrationDetail = { ...action.registrationDetail };
        newState.status = "INITIAL";
        newState.errorMessage = '';
        console.log("PrepareChefRegister: ", newState);
        return { ...newState };
      }
    case ChefActionType.UploadChefAvatar:
      {
        return {
          ...state,
          status: 'UPLOADINGPICTURE',
        };
      }
    case ChefActionType.UploadChefAvatarSuccess: 
      {
        return {
          ...state,
          status: 'UPLOADINGPICTURESUCCESS',
          registrationDetail: {
            ...state.registrationDetail,
            profilePicture: action.response.url
          }
        };
      }
    case ChefActionType.UploadChefAvatarFailed:
      return {
        ...state,
        status: 'UPLOADINGPICTUREFAILED',
        registrationDetail: {
          ...state.registrationDetail,
          profilePicture: ''
        }
      };
    default:
      return state;
  }
}

const reducer: (state: Chef, action: ChefAction) => Chef = combineReducers({
  visitState,
  chefDetail,
  register,
});

export function chefReducer(state: Chef = chefInitialState, action: ChefAction): Chef {
  return reducer(state, action);
}
