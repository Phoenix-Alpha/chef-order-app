import { storageMetaReducer } from 'src/app/storage.metareducer';
import { CHECKOUT_LOCAL_STORAGE_KEY, CHECKOUT_STORAGE_KEYS, CHECKOUT_CONFIG_TOKEN } from './checkout.tokens';
import { LocalStorageService } from './../../local-storage.service';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutPageRoutingModule } from './checkout-routing.module';
import { CheckoutPage } from './checkout.page';
import { StoreModule } from '@ngrx/store';
import { checkoutInitialState, checkoutReducer } from './+state/checkout.reducer';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { CheckoutEffects } from './+state/checkout.effects';
import { EffectsModule } from '@ngrx/effects';
import { CheckoutSuccessPageModule } from './checkout-success/checkout-success.module';
import { CheckoutFailurePageModule } from './checkout-failure/checkout-failure.module';

export function getCheckoutConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ }) => ({ }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    CheckoutPageRoutingModule,
    CreditCardDirectivesModule,
    CheckoutSuccessPageModule,
    CheckoutFailurePageModule,
    StoreModule.forFeature('checkout', checkoutReducer, { initialState: checkoutInitialState }),
    EffectsModule.forFeature([ CheckoutEffects ]),
  ],
  declarations: [CheckoutPage],
  providers: [
    {
      provide: CHECKOUT_LOCAL_STORAGE_KEY,
      useValue: '__checkout_storage__'
    },
    {
      provide: CHECKOUT_STORAGE_KEYS,
      useValue: 'checkout'
    },
    {
      provide: CHECKOUT_CONFIG_TOKEN,
      deps: [ CHECKOUT_STORAGE_KEYS, CHECKOUT_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getCheckoutConfig
    }
  ],
})

export class CheckoutPageModule {}
