import { TranslateService } from '@ngx-translate/core';
import { Inject, Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { CheckoutActionType, PublicOrderCreateSuccess, RedirectToStripeCheckout, PublicOrderCreateFailed, PresentStripePaymentSheet } from './checkout.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { CHECKOUT_LOCAL_STORAGE_KEY } from '../checkout.tokens';
import { PublicOrderCreate } from './checkout.actions';
import { CheckoutService } from '../checkout.service';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { Router } from '@angular/router';

@Injectable()
export class CheckoutEffects {

  constructor(
    private actions$: Actions,
    @Inject(CHECKOUT_LOCAL_STORAGE_KEY) private localStorageKey,
    private router: Router,
    private checkoutService: CheckoutService) { }

  @Effect()
  onPublicOrderCreate = this.actions$.pipe(
    ofType<PublicOrderCreate>(CheckoutActionType.PublicOrderCreate),
    switchMap(action =>
      this.checkoutService.PublicOrderCreate(action.request).pipe(
        switchMap(t => {
          // return [new PublicOrderCreateSuccess(t), new RedirectToStripeCheckout(t.stripeCheckoutSessionUrl)];
          return [new PublicOrderCreateSuccess(t), new PresentStripePaymentSheet(t)];
        }),
        catchError(a => of(new PublicOrderCreateFailed()))
      ))
  );

  @Effect({ dispatch: false })
  onRedirectToStripeCheckout = this.actions$.pipe(
    ofType<RedirectToStripeCheckout>(CheckoutActionType.RedirectToStripeCheckout),
    tap(a => {
      window.location.href = a.stripeCheckoutSessionUrl;
    })
  );

  @Effect({ dispatch: false })
  onPresentStripePaymentSheet = this.actions$.pipe(
    ofType<PresentStripePaymentSheet>(CheckoutActionType.PresentStripePaymentSheet),
    tap(a => {
      this.checkoutService.createStripePaymentSheet(a.response.stripeCustomerId, a.response.paymentIntentClientSecret, a.response.ephemeralKey);
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        this.router.navigate(['/public/checkout/success'], { queryParams: { orderNumber: a.response.orderNumber } })
      });
      Stripe.addListener(PaymentSheetEventsEnum.Failed, () => {
        this.router.navigate(['/public/checkout/failure'], { queryParams: { orderNumber: a.response.orderNumber } })
      })
      Stripe.addListener(PaymentSheetEventsEnum.Canceled, () => {
        this.router.navigate(['/public/checkout/failure'], { queryParams: { orderNumber: a.response.orderNumber } })
      })
    })
  );
  
}
