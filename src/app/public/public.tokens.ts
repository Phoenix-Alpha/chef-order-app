import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';
import { PublicAction } from './+state/public.actions';
import { PublicState } from './+state/public.reducer';

export const PUBLIC_STORAGE_KEYS = new InjectionToken<keyof PublicState>('publicStorageKey');
export const PUBLIC_LOCAL_STORAGE_KEY = new InjectionToken<string>('PublicStorage');
export const PUBLIC_CONFIG_TOKEN = new InjectionToken<StoreConfig<PublicState, PublicAction>>('PublicConfigToken');
