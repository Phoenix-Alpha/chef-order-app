import { OfferState } from './+state/offer.reducer';
import { PublicOfferAction } from './+state/offer.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const PUBLICOFFER_STORAGE_KEYS = new InjectionToken<keyof OfferState>('publicOfferStorageKey');
export const PUBLICOFFER_LOCAL_STORAGE_KEY = new InjectionToken<string>('PublicOfferStorage');
export const PUBLICOFFER_CONFIG_TOKEN = new InjectionToken<StoreConfig<OfferState, PublicOfferAction>>('PublicOfferConfigToken');
