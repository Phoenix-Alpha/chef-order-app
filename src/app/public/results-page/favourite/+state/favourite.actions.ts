import { Action } from '@ngrx/store';
import { PublicChefDetail } from 'src/app/public/chef-detail/chef';
import { PublicOfferInfo } from '../../+state/result.reducer';

export enum FavouriteActionType {
  AddFavouriteOffer = '[favourite] AddFavouriteOffer',
  RemoveFavouriteOffer = '[favourite] RemoveFavouriteOffer',
  UpdateFavouriteOfferInfo = '[favourite] UpdateFavouriteOfferInfo',
  AddFavouriteChef = '[favourite] AddFavouriteChef',
  RemoveFavouriteChef = '[favourite] RemoveFavouriteChef',
  UpdateFavouriteChefInfo = '[favourite] UpdateFavouriteChefInfo',
}

export class AddFavouriteOffer implements Action {
  readonly type = FavouriteActionType.AddFavouriteOffer;
  constructor(public readonly offer: PublicOfferInfo) {}
}

export class RemoveFavouriteOffer implements Action {
  readonly type = FavouriteActionType.RemoveFavouriteOffer;
  constructor(public readonly offerId: number) {}
}

export class UpdateFavouriteOfferInfo implements Action {
  readonly type = FavouriteActionType.UpdateFavouriteOfferInfo;
  constructor() {}
}

export class AddFavouriteChef implements Action {
  readonly type = FavouriteActionType.AddFavouriteChef;
  constructor(public readonly chef: PublicChefDetail) {}
}

export class RemoveFavouriteChef implements Action {
  readonly type = FavouriteActionType.RemoveFavouriteChef;
  constructor(public readonly chefId: number) {}
}

export class UpdateFavouriteChefInfo implements Action {
  readonly type = FavouriteActionType.UpdateFavouriteChefInfo;
  constructor() {}
}

export type FavouriteAction =
  AddFavouriteOffer
  | RemoveFavouriteOffer
  | UpdateFavouriteOfferInfo
  | AddFavouriteChef
  | RemoveFavouriteChef
  | UpdateFavouriteChefInfo
;
