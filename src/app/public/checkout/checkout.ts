import { PublicOfferInfo } from './../results-page/+state/result.reducer';
import { DeliveryMethod } from 'aws-sdk/clients/amplifybackend';
import { PatchDeploymentStatus } from 'aws-sdk/clients/ssm';
import { DeliveryMode } from './../../chef/chef-offer/offer';

export class PublicOrderCreateRequest {
  //  userAddress: string;
   offerId: number;
   quantity: number;
   deviceIdentifier: string;
   customerEmail: string;
   customerPhoneNumber: string;
   customerFirstName: string;
   customerLastName: string;
   deliveryStreetAddress: string;
   deliveryCity: string;
   deliveryPostcode: string;
   deliveryMethod:DeliveryMode;
   paymentMethod: PaymentMethod;
   specialNote: string;
   pickupDate: string;
   coupon?: string;
}

export class PublicOrderResponse {
  uuid: string;
  orderNumber: string;
  status: OrderStatus;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  deliveryStreetAddress: string;
  deliveryCity: string;
  deliveryPostcode: string;
  deliveryMethod: DeliveryMethod;
  offer: PublicOfferInfo;
  quantity: number;
  totalNonDiscountedCost: number;
  totalDiscountedCost: number;
  coupon: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pickupCode: string;
  pickupDate: string;
  paymentLogs?: string;
  reviewRating?: number;
  reviewComment?: string;
  stripeCheckoutSessionUrl?: string;
  paymentIntentClientSecret?: string;
	ephemeralKey?: string;
	stripeCustomerId?: string;
}

export enum OrderStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  RECEIVED = "RECEIVED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CUSTOMERCANCELLED = "CUSTOMERCANCELLED",
  CHEFCANCELLED = "CHEFCANCELLED",
  CONFIRMED = "CONFIRMED",
  REVIEWED = "REVIEWED",
  DISPUTED = "DISPUTED",
}

export enum PaymentStatus {
  INITIAL = "INITIAL",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESSFULLY_COMPLETED = "SUCCESSFULLY_COMPLETED",
  FAILED = "FAILED",
}

export enum PaymentMethod {
  NO_PAYMENT = "NO_PAYMENT",
  CREDIT_CARD_STRIPE = "CREDIT_CARD_STRIPE",
  STRIPE_GPAY = "STRIPE_GPAY",
  STRIPE_APAY = "STRIPE_APAY",
  PAYPAL = "PAYPAL",
}
