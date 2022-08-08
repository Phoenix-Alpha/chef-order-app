import { CheckoutActionType } from './../../../public/checkout/+state/checkout.actions';
import { state } from '@angular/animations';
import { ActivateWallet, ActivateWalletSuccess, ActivateWalletFailed, ChefWalletActionType, ChefWalletAction } from "./wallet.action";
import { WalletType, WalletStatus } from "../wallet";

export type APISTATUS = 'INITIAL' | 'LOADED' | 'FAILED' | 'LOADING';

export interface ChefWalletActivateResponse {
  walletInfo: ChefWalletInfo;
  accountLinkUrl: string;
  expiresAt: number;
}

export interface ChefWalletInfo {
  id: number;
  userId: number;
  type: WalletType;
  status: WalletStatus;
  hold: number;
  balance: number;
  stripeAccountId: string;
  apiStatus?: APISTATUS;
}

export interface ChefWalletState {
  state: ChefWalletInfo;
}

export const chefWalletInfoInitialState: ChefWalletInfo = {
  id: -1,
  userId: -1,
  type: WalletType.CHEF,
  status: WalletStatus.INITIAL,
  hold: 0,
  balance: 0,
  stripeAccountId: null,
  apiStatus: 'INITIAL',
}

export  function reducer(state = chefWalletInfoInitialState, action: ChefWalletAction): ChefWalletInfo {
  switch (action.type) {
    case ChefWalletActionType.ActivateWallet:
      return { ...state, apiStatus: 'LOADING' };
    case ChefWalletActionType.ActivateWalletSuccess:
      return { ...action.response, apiStatus: 'LOADED' };
    case ChefWalletActionType.ActivateWalletFailed:
      return { ...chefWalletInfoInitialState, apiStatus: 'FAILED' };
    case ChefWalletActionType.FetchWalletInfoSuccess:
      return { ...action.response, apiStatus: 'LOADED' };
    case ChefWalletActionType.FetchWalletInfoFailed:
      return { ...chefWalletInfoInitialState, apiStatus: 'FAILED' };
    case ChefWalletActionType.UpdateWalletInfo:
      return { ...action.newState };
    default:
      return state;
  }
}

export function chefWalletReducer(state: ChefWalletInfo = chefWalletInfoInitialState, action: ChefWalletAction) {
  return reducer(state, action);
}
