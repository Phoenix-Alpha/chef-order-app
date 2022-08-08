import { Action } from '@ngrx/store';
import { UploadAvatarResponse } from '../../chef';
import { ChefOfferCreateRequest, ChefUpdateOfferRequest, OfferDetail, OfferStatus } from '../offer';
import { ChefOfferInfoDetail, ChefOfferDeliveryOptionsInfoDetail, ChefOfferDishInfoDetail, ChefOfferGeneralInfoDetail, ChefOfferPriceInfoDetail } from './offer.reducer';

export enum OfferActionType {
  FetchOffersByStatus = '[offer] FetchOffersByStatus',
  FetchOffersByStatusSuccess = '[offer] FetchOffersByStatusSuccess',
  FetchOffersByStatusFailed = '[offer] FetchOffersByStatusFailed',
  FetchOfferDetail = '[offer] FetchOfferDetail',
  FetchOfferDetailSuccess = '[offer] FetchOfferDetailSuccess',
  FetchOfferDetailFailed = '[offer] FetchOfferDetailFailed',
  InitializeChefOfferInfoDetail = '[offer] InitializeChefOfferInfoDetail',
  InitializeChefOfferInfoDetailFromExisting = '[offer] InitializeChefOfferInfoDetailFromExisting',
  InitializeChefOfferInfoDetailFromExistingSuccess = '[offer] InitializeChefOfferInfoDetailFromExistingSuccess',
  InitializeChefOfferInfoDetailFromExistingFailed = '[offer] InitializeChefOfferInfoDetailFromExistingFailed',
  SaveOfferGeneralInfo = '[offer] SaveOfferGeneralInfo',
  SaveOfferDishDetailInfo = '[offer] SaveOfferDishDetailInfo',
  SaveOfferDeliveryOptionsInfo = '[offer] SaveOfferDeliveryOptionsInfo',
  SaveOfferPriceInfo = '[offer] SaveOfferPriceInfo',
  OfferCreate = '[offer] OfferCreate',
  OfferCreateSuccess = '[offer] OfferCreateSuccess',
  OfferCreateFailed = '[offer] OfferCreateFailed',
  DeleteOffer = '[offer] DeleteOffer',
  DeleteOfferSuccess = '[offer] DeleteOfferSuccess',
  DeleteOfferFailed = '[offer] DeleteOfferFailed',
  UpdateOffer = '[offer] UpdateOffer',
  UpdateOfferSuccess = '[offer] UpdateOfferSuccess',
  UpdateOfferFailed = '[offer] UpdateOfferFailed',
  UploadOfferPicture = '[offer] UploadOfferPicture',
  UploadOfferPictureSuccess = '[offer] UploadOfferPictureSuccess',
  UploadOfferPictureFailed = '[offer] UploadOfferPictureFailed',
  
}

export class FetchOffersByStatus implements Action {
  readonly type = OfferActionType.FetchOffersByStatus;

  constructor(public readonly status: OfferStatus) {}
  
}

export class FetchOffersByStatusSuccess implements Action {
  readonly type = OfferActionType.FetchOffersByStatusSuccess;

  constructor(public readonly status: OfferStatus, public readonly offers: OfferDetail[]) {}
  
}

export class FetchOffersByStatusFailed implements Action {
  readonly type = OfferActionType.FetchOffersByStatusFailed;

  constructor() {}
  
}

export class FetchOfferDetail implements Action {
  readonly type = OfferActionType.FetchOfferDetail;

  constructor(public readonly offerId: number) {}
  
}

export class FetchOfferDetailSuccess implements Action {
  readonly type = OfferActionType.FetchOfferDetailSuccess;

  constructor(public readonly detail: ChefOfferInfoDetail) {}
}

export class FetchOfferDetailFailed implements Action {
  readonly type = OfferActionType.FetchOfferDetailFailed;

  constructor() {}
}

export class InitializeChefOfferInfoDetailFromExisting implements Action {
  readonly type = OfferActionType.InitializeChefOfferInfoDetailFromExisting;

  constructor(public readonly offerId: number) {}
  
}

export class InitializeChefOfferInfoDetailFromExistingSuccess implements Action {
  readonly type = OfferActionType.InitializeChefOfferInfoDetailFromExistingSuccess;

  constructor(public readonly detail: ChefOfferInfoDetail) {}
}

export class InitializeChefOfferInfoDetailFromExistingFailed implements Action {
  readonly type = OfferActionType.InitializeChefOfferInfoDetailFromExistingFailed;

  constructor() {}
}

export class InitializeChefOfferInfoDetail implements Action {
  readonly type = OfferActionType.InitializeChefOfferInfoDetail;

  constructor() {}
}

export class SaveOfferGeneralInfo implements Action {
  readonly type = OfferActionType.SaveOfferGeneralInfo;

  constructor(public readonly gernalInfo: ChefOfferGeneralInfoDetail) {}
}

export class SaveOfferDishDetailInfo implements Action {
  readonly type = OfferActionType.SaveOfferDishDetailInfo;

  constructor(public readonly dishDetailInfo: ChefOfferDishInfoDetail) {}
}

export class SaveOfferDeliveryOptionsInfo implements Action {
  readonly type = OfferActionType.SaveOfferDeliveryOptionsInfo;

  constructor(public readonly deliveryOptionsInfo: ChefOfferDeliveryOptionsInfoDetail) {}
}

export class SaveOfferPriceInfo implements Action {
  readonly type = OfferActionType.SaveOfferPriceInfo;

  constructor(public readonly priceInfo: ChefOfferPriceInfoDetail) {}
}

export class OfferCreate implements Action {
  readonly type = OfferActionType.OfferCreate;

  constructor(public readonly offerCreateRequest: ChefOfferCreateRequest) {}
}

export class OfferCreateSuccess implements Action {
  readonly type = OfferActionType.OfferCreateSuccess;

  constructor(public readonly response: OfferDetail) {}
}

export class OfferCreateFailed implements Action {
  readonly type = OfferActionType.OfferCreateFailed;

  constructor(public readonly error: any) {}
}

export class UpdateOffer implements Action {
  readonly type = OfferActionType.UpdateOffer;

  constructor(public readonly request: ChefUpdateOfferRequest) {}
}

export class UpdateOfferSuccess implements Action {
  readonly type = OfferActionType.UpdateOfferSuccess;

  constructor(public readonly response: OfferDetail) {}
}

export class UpdateOfferFailed implements Action {
  readonly type = OfferActionType.UpdateOfferFailed;

  constructor(public readonly error: any) {}
}


export class UploadOfferPicture implements Action {
  readonly type = OfferActionType.UploadOfferPicture;

  constructor(public readonly imageData: string) {}
}

export class UploadOfferPictureSuccess implements Action {
  readonly type = OfferActionType.UploadOfferPictureSuccess;

  constructor(public readonly response: UploadAvatarResponse) {}
}

export class UploadOfferPictureFailed implements Action {
  readonly type = OfferActionType.UploadOfferPictureFailed;

  constructor(public readonly errors: string[]) {}
}

export type OfferAction =
  InitializeChefOfferInfoDetailFromExisting
  | InitializeChefOfferInfoDetailFromExistingSuccess
  | InitializeChefOfferInfoDetailFromExistingFailed
  | FetchOffersByStatus
  | FetchOffersByStatusSuccess
  | FetchOffersByStatusFailed
  | FetchOfferDetail
  | FetchOfferDetailSuccess
  | FetchOfferDetailFailed
  | OfferCreate
  | OfferCreateSuccess
  | OfferCreateFailed
  | UpdateOffer
  | UpdateOfferSuccess
  | UpdateOfferFailed
  | UploadOfferPicture
  | UploadOfferPictureSuccess
  | UploadOfferPictureFailed
  | InitializeChefOfferInfoDetail
  | SaveOfferGeneralInfo
  | SaveOfferDishDetailInfo
  | SaveOfferDeliveryOptionsInfo
  | SaveOfferPriceInfo
;
