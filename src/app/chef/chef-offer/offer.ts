export enum OfferStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVE = "ARCHIVE",
}

export enum OfferType {
  PREORDER = "PREORDER",
  ONDEMAND = "ONDEMAND",
}

export enum DeliveryMode {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export class OfferDeliveryZone {
  maxDistance: number;
	deliveryPrice: number;
}

export class ChefOfferCreateRequest {
  email: string;
  status: OfferStatus;
  offerType: OfferType;
  isPickup: boolean;
  isDelivery: boolean;
  title?: string;
  description?: string;
  weight?: number;
  servingAddress?: string;
  servingPostcode?: string;
  servingCity?: string;
  servingStart?: string;
  servingEnd?: string;
  orderUntil?: string;
  price?: number;
  maxQuantity?: number;
  minPreorderHours?: number;
  minFreeDeliveryAmount?: number;
  zone1MaxDistance?: number;
  zone1DeliveryPrice?: number;
  zone2MaxDistance?: number;
  zone2DeliveryPrice?: number;
  zone3MaxDistance?: number;
  zone3DeliveryPrice?: number;
  offerPicture1?: string;
  offerPicture2?: string;
  offerPicture3?: string;
  cuisines: string[];
  tags: string[];
  allergens: string[];
}

// export const chefOfferCreateRequestInitial: ChefOfferCreateRequest = {
//   email: '',
//   status: OfferStatus.DRAFT,
//   offerType: OfferType.PREORDER,
//   isPickup: false,
//   isDelivery: false,
//   title?: '',
//   description?: '',
//   weight?: number,
//   servingAddress?: string,
//   servingPostcode?: string,
//   servingCity?: string,
//   servingStart?: string,
//   servingEnd?: string,
//   price?: number,
//   maxQuantity?: number,
//   minPreorderHours?: number,
//   minFreeDeliveryAmount?: number,
//   zone1MaxDistance?: number,
//   zone1DeliveryPrice?: number,
//   zone2MaxDistance?: number,
//   zone2DeliveryPrice?: number,
//   zone3MaxDistance?: number,
//   zone3DeliveryPrice?: number,
//   offerPicture1?: string,
//   offerPicture2?: string,
//   offerPicture3?: string,
//   cuisines?: string[],
//   tags?: string[],
//   allergens?: string[],
// }

export class ChefUpdateOfferRequest {
  email: string;
  offerId: number;
  status?: OfferStatus;
  offerType?: OfferType;
  isPickup?: boolean;
  isDelivery?: boolean;
  title?: string;
  description?: string;
  weight?: number;
  servingAddress?: string;
  servingPostcode?: string;
  servingCity?: string;
  servingStart?: string;
  servingEnd?: string;
  orderUntil?: string;
  price?: number;
  maxQuantity?: number;
  quantityAvailable?: number;
  minPreorderHours?: number;
  minFreeDeliveryAmount?: number;
  zone1MaxDistance?: number;
  zone1DeliveryPrice?: number;
  zone2MaxDistance?: number;
  zone2DeliveryPrice?: number;
  zone3MaxDistance?: number;
  zone3DeliveryPrice?: number;
  offerPicture1?: string;
  offerPicture2?: string;
  offerPicture3?: string;
  cuisines?: string[];
  tags?: string[];
  allergens?: string[];
}

export class OfferDetail {
  offerId: number;
  status: OfferStatus;
  offerType: OfferType;
  title: string;
  description: string;
  weight: number;
  servingAddress: string;
  servingPostcode: string;
  servingCity: string;
  servingStart: string;
  servingEnd: string;
  orderUntil: string;
  price: number;
  maxQuantity: number;
  quantityAvailable: number;
  isPickup: boolean;
  isDelivery: boolean;
  minPreorderHours: number;
  minFreeDeliveryAmount: number;
  offerPictures: string[];
  cuisines: string[];
  tags: string[];
  allergens: string[];
  zones: OfferDeliveryZone[]
}

export const TagList = [
  {
    id: "Vegetarian",
    label: "Vegetarian"
  },
  {
    id: "Bio",
    label: "Bio"
  },
  {
    id: "Spicy",
    label: "Spicy"
  },
  {
    id: "Vegan",
    label: "Vegan"
  },
  {
    id: "GlutenFree",
    label: "Gluten Free"
  },
  {
    id: "Fish",
    label: "Fish"
  },
  {
    id: "Meat",
    label: "Meat"
  },
  {
    id: "BakedFood",
    label: "Baked Food"
  },
];

export const AllergenList = [
  {
    id: "Peanuts",
    label: "Peanuts"
  },
  {
    id: "Seasame",
    label: "Seasame"
  },
  {
    id: "Soybeans",
    label: "Soybeans"
  },
  {
    id: "TreeNuts",
    label: "Tree nuts"
  },
  {
    id: "Guten",
    label: "Guten"
  },
  {
    id: "Crustaceans",
    label: "Crustaceans"
  },
  {
    id: "Egg",
    label: "Egg"
  },
  {
    id: "Lupin",
    label: "Lupin"
  },
  {
    id: "Milk",
    label: "Milk"
  },
  {
    id: "Molluscs",
    label: "Molluscs"
  },
  {
    id: "Mustard",
    label: "Mustard"
  },
  {
    id: "Sulphite",
    label: "Sulphite"
  },
]

export const OfferTypeList = [
  {
    id: "PREORDER",
    label: "Pre-order"
  },
  {
    id: "ONDEMAND",
    label: "On-demand"
  },
]

export const DeliveryTypeList = [
  {
    id: "PICKUP",
    label: "Only Pick-up"
  },
  {
    id: "DELIVERY",
    label: "Only Delivery"
  },
  {
    id: "BOTH",
    label: "Delivery & Pick-up"
  },
]
