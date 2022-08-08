import { OfferType } from "src/app/chef/chef-offer/offer";

export enum OfferSortMode {
  BESTMATCH = "BESTMATCH",
  REVIEWS = "REVIEWS",
  DISTANCE = "DISTANCE",
  PRICE = "PRICE",
  DELIVERYCOST = "DELIVERYCOST",
  SERVINGDATE = "SERVINGDATE",
}

export const ResultSortModes = [
  {
    mode: OfferSortMode.BESTMATCH,
    label: "Best match",
  },
  {
    mode: OfferSortMode.REVIEWS,
    label: "Reviews",
  },
  {
    mode: OfferSortMode.DISTANCE,
    label: "Distance",
  },
  {
    mode: OfferSortMode.PRICE,
    label: "Price",
  },
  {
    mode: OfferSortMode.DELIVERYCOST,
    label: "Delivery cost",
  },
  {
    mode: OfferSortMode.SERVINGDATE,
    label: "Serving date",
  },
]

export interface PublicOfferSearchRequest {
  chefName?: string;
  chefRating?: number;
  userAddress: string;
  offerType?: OfferType | null;
  offerName?: string
  distance: number;
  sortMode: OfferSortMode;
  servingDate?: string;
  isPickup?: boolean;
  isDelivery?: boolean;
}