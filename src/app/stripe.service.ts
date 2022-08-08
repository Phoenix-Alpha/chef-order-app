
import { Injectable } from '@angular/core';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

@Injectable( { providedIn: 'root' } )
export class StripeService {
  constructor() {}

  initializeStripe(publicKey: string) {
    Stripe.initialize({ publishableKey: publicKey });
  }
}
  
  