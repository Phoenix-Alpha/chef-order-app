import { Action } from "@ngrx/store";
import { ChefActivateWalletRequest } from "../../chef";
import { ChefWalletActivateResponse, ChefWalletInfo } from "./wallet.reducer";

export enum ChefWalletActionType {
  ActivateWallet = '[chef-wallet] ActivateWallet',
  ActivateWalletSuccess = '[chef-wallet] ActivateWalletSuccess',
  ActivateWalletFailed = '[chef-wallet] ActivateWalletFailed',
  RedirectToStripeConnect = '[chef-wallet] RedirectToStripeConnect',
  FetchWalletInfo = '[chef-wallet] FetchWalletInfo',
  FetchWalletInfoSuccess = '[chef-wallet] FetchWalletInfoSuccess',
  FetchWalletInfoFailed = '[chef-wallet] FetchWalletInfoFailed',
  UpdateWalletInfo = '[chef-wallet] UpdateWalletInfo',
  RedirectToStripeDashboard = '[chef-wallet] RedirectToStripeDashboard',
  RedirectToStripeDashboardSuccess = '[chef-wallet] RedirectToStripeDashboardSuccess',
  RedirectToStripeDashboardFailed = '[chef-wallet] RedirectToStripeDashboardFailed',
}

// export class ActivateWallet implements Action {
//   readonly type = ChefWalletActionType.ActivateWallet;
//   constructor(public readonly request: ChefActivateWalletRequest){ }
// }

export class ActivateWallet implements Action {
  readonly type = ChefWalletActionType.ActivateWallet;
  constructor(){ }
}

export class ActivateWalletSuccess implements Action {
  readonly type = ChefWalletActionType.ActivateWalletSuccess;
  constructor(public readonly response: ChefWalletInfo){ }
}

export class ActivateWalletFailed implements Action {
  readonly type = ChefWalletActionType.ActivateWalletFailed;
  constructor(){ }
}

export class RedirectToStripeDashboard implements Action {
  readonly type = ChefWalletActionType.RedirectToStripeDashboard;
  constructor(){ }
}

export class RedirectToStripeDashboardSuccess implements Action {
  readonly type = ChefWalletActionType.RedirectToStripeDashboardSuccess;
  constructor(public readonly loginLink: string){ }
}

export class RedirectToStripeDashboardFailed implements Action {
  readonly type = ChefWalletActionType.RedirectToStripeDashboardFailed;
  constructor(){ }
}

export class RedirectToStripeConnect implements Action {
  readonly type = ChefWalletActionType.RedirectToStripeConnect;
  constructor(public readonly redirectUrl: string){ }
}

export class FetchWalletInfo implements Action {
  readonly type = ChefWalletActionType.FetchWalletInfo;
  constructor(){ }
}

export class FetchWalletInfoSuccess implements Action {
  readonly type = ChefWalletActionType.FetchWalletInfoSuccess;
  constructor(public readonly response: ChefWalletInfo){ }
}

export class FetchWalletInfoFailed implements Action {
  readonly type = ChefWalletActionType.FetchWalletInfoFailed;
  constructor(){ }
}

export class UpdateWalletInfo implements Action {
  readonly type = ChefWalletActionType.UpdateWalletInfo;
  constructor(public readonly newState: ChefWalletInfo){ }
}

export type ChefWalletAction  =
  ActivateWallet
  | ActivateWalletSuccess
  | ActivateWalletFailed
  | RedirectToStripeConnect
  | FetchWalletInfo
  | FetchWalletInfoSuccess
  | FetchWalletInfoFailed
  | UpdateWalletInfo;
