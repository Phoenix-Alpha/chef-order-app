import { CheckoutState } from './+state/checkout.reducer';
import { CheckoutAction } from './+state/checkout.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const CHECKOUT_STORAGE_KEYS = new InjectionToken<keyof CheckoutState>('checkoutStorageKey');
export const CHECKOUT_LOCAL_STORAGE_KEY = new InjectionToken<string>('CheckoutStorage');
export const CHECKOUT_CONFIG_TOKEN = new InjectionToken<StoreConfig<CheckoutState, CheckoutAction>>('CheckoutConfigToken');
