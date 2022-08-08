import { OfferState } from './+state/offer.reducer';
import { OfferAction } from './+state/offer.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const OFFER_STORAGE_KEYS = new InjectionToken<keyof OfferState>('offerStorageKey');
export const OFFER_LOCAL_STORAGE_KEY = new InjectionToken<string>('OfferStorage');
export const OFFER_CONFIG_TOKEN = new InjectionToken<StoreConfig<OfferState, OfferAction>>('OfferConfigToken');
