import { stringList } from "aws-sdk/clients/datapipeline";
import { PaymentMethod, PaymentStatus } from "src/app/public/checkout/checkout";
import { OfferDetail } from "../chef-offer/offer";

export enum OrderStatus {
  DRAFT = "DRAFT",				                    // Order in draft at customer side.
  SUBMITTED = "SUBMITTED",			              // Order submitted to the system, not paid.
  RECEIVED = "RECEIVED",				              // Chef received the order.
  APPROVED = "APPROVED",				              // Chef approved the order. On-demand type requires manual approval but pre-order type automatically set as approved.
  REJECTED = "REJECTED",				              // Chef rejected the order.
  CUSTOMERCANCELLED = "CUSTOMERCANCELLED",	  // Customer cancelled the order before chef approve/reject it.
  CHEFCANCELLED = "CHEFCANCELLED",		        // Chef cancelled the order after approval.
  CONFIRMED = "CONFIRMED",			              // Order confirmed by the customer which means it's fulfilled.
  DISPUTED = "DISPUTED",				              // Order disputed by the customer.
}

export enum DeliveryMethod {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export class ChefOrderDetail {
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
	deliveryCost: number;
	deliveryMethod: DeliveryMethod;
  pickupDate: string;
	offer: OfferDetail;
	quantity: number;
	totalNonDiscountedCost: number;
	totalDiscountedCost: number;
	coupon: string;
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
}

export class ChefHandlePendingRequest {
  email: string;
  orderUuid: string;
  status: OrderStatus;
}

export class ChefOrderConfirmDeliveryRequest {
  email: string;
  orderUuid: string;
  confirmCode: string;
}
