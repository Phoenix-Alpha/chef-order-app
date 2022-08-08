import { Action } from '@ngrx/store';
import { ChefDetail, ChefRegistrationDetail, UpdateChefProfileRequest, UploadAvatarResponse } from '../chef';

export enum ChefActionType {
  SetChefOrderInstructionVisited = '[chef] SetChefOrderInstructionVisited',
  FetchChefDetail = '[chef] FetchChefDetail',
  FetchChefDetailSuccess = '[chef] FetchChefDetailSuccess',
  FetchChefDetailFailed = '[chef] FetchChefDetailFailed',
  InitializeRegistrationState = '[chef] InitializeRegistrationState',
  PrepareChefRegister = '[chef] PrepareChefRegister',
  ChefRegister = '[chef] ChefRegister',
  ChefRegisterSuccess = '[chef] ChefRegisterSuccess',
  ChefRegisterFailed = '[chef] ChefRegisterFailed',
  UploadChefAvatar = '[chef] UploadChefAvatar',
  UploadChefAvatarSuccess = '[chef] UploadChefAvatarSuccess',
  UploadChefAvatarFailed = '[chef] UploadChefAvatarFailed',
  UpdateChefAvatar = '[chef] UpdateChefAvatar',
  UpdateChefAvatarSuccess = '[chef] UpdateChefAvatarSuccess',
  UpdateChefAvatarFailed = '[chef] UpdateChefAvatarFailed',
  UpdateChefProfile = '[chef] UpdateChefProfile',
  UpdateChefProfileSuccess = '[chef] UpdateChefProfileSuccess',
  UpdateChefProfileFailed = '[chef] UpdateChefProfileFailed',
}

export class SetChefOrderInstructionVisited implements Action {
  readonly type = ChefActionType.SetChefOrderInstructionVisited;
  constructor() {}
}

export class UpdateChefProfile implements Action {
  readonly type = ChefActionType.UpdateChefProfile;

  constructor(public readonly request: UpdateChefProfileRequest) {}
}

export class UpdateChefProfileSuccess implements Action {
  readonly type = ChefActionType.UpdateChefProfileSuccess;

  constructor(public readonly chefDetail: ChefDetail) {}
}

export class UpdateChefProfileFailed implements Action {
  readonly type = ChefActionType.UpdateChefProfileFailed;

  constructor() {}
}

export class FetchChefDetail implements Action {
  readonly type = ChefActionType.FetchChefDetail;

  // constructor(public readonly userId: number) {}
  constructor() {}
}

export class FetchChefDetailSuccess implements Action {
  readonly type = ChefActionType.FetchChefDetailSuccess;

  constructor(public readonly chefDetail: ChefDetail) {}
}

export class FetchChefDetailFailed implements Action {
  readonly type = ChefActionType.FetchChefDetailFailed;

  constructor() {}
}

export class InitializeRegistrationState implements Action {
  readonly type = ChefActionType.InitializeRegistrationState;

  constructor() {}
}

export class PrepareChefRegister implements Action {
  readonly type = ChefActionType.PrepareChefRegister;

  constructor(public readonly registrationDetail: ChefRegistrationDetail) {}
}

export class ChefRegister implements Action {
  readonly type = ChefActionType.ChefRegister;

  constructor(public readonly registrationDetail: ChefRegistrationDetail) {}
}

export class ChefRegisterSuccess implements Action {
  readonly type = ChefActionType.ChefRegisterSuccess;

  constructor(public readonly response: ChefDetail) {}
}

export class ChefRegisterFailed implements Action {
  readonly type = ChefActionType.ChefRegisterFailed;

  constructor(public readonly error: any) {}
}

export class UploadChefAvatar implements Action {
  readonly type = ChefActionType.UploadChefAvatar;

  constructor(public readonly file: any) {}
}

export class UploadChefAvatarSuccess implements Action {
  readonly type = ChefActionType.UploadChefAvatarSuccess;

  constructor(public readonly response: UploadAvatarResponse) {}
}

export class UploadChefAvatarFailed implements Action {
  readonly type = ChefActionType.UploadChefAvatarFailed;

  constructor(public readonly errors: string[]) {}
}

export class UpdateChefAvatar implements Action {
  readonly type = ChefActionType.UpdateChefAvatar;

  constructor(public readonly file: any) {}
}

export class UpdateChefAvatarSuccess implements Action {
  readonly type = ChefActionType.UpdateChefAvatarSuccess;

  constructor(public readonly response: UploadAvatarResponse) {}
}

export class UpdateChefAvatarFailed implements Action {
  readonly type = ChefActionType.UpdateChefAvatarFailed;

  constructor(public readonly errors: string[]) {}
}


export type ChefAction =
  SetChefOrderInstructionVisited
  | UpdateChefProfile
  | UpdateChefProfileSuccess
  | UpdateChefProfileFailed
  | FetchChefDetail
  | FetchChefDetailSuccess
  | FetchChefDetailFailed
  | InitializeRegistrationState
  | PrepareChefRegister
  | ChefRegister
  | ChefRegisterSuccess
  | ChefRegisterFailed
  | UploadChefAvatar
  | UploadChefAvatarSuccess
  | UploadChefAvatarFailed
  | UpdateChefAvatar
  | UpdateChefAvatarSuccess
  | UpdateChefAvatarFailed
;
