import { PublicOrderCreateRequest, PublicOrderResponse } from './checkout';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Stripe } from '@capacitor-community/stripe';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    private router: Router
  ) { }

  PublicOrderCreate(request: PublicOrderCreateRequest): Observable<PublicOrderResponse>{
    return this.http.post<PublicOrderResponse>('/api/v1/order/create', request);
  }

  createStripePaymentSheet(customerId: string, paymentIntentClientSecret: string, ephemeralKey: string) {
    Stripe.createPaymentSheet({
      paymentIntentClientSecret: paymentIntentClientSecret,
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralKey,
      style: 'alwaysDark',
      countryCode: 'FR',
    }).then(result => {
      Stripe.presentPaymentSheet();
    });
  }

}
