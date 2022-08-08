import { PublicOrderState } from './+state/order.reducer';
import { PublicOrderAction } from './+state/order.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const PUBLIC_ORDER_STORAGE_KEYS = new InjectionToken<keyof PublicOrderState>('publicOrderStorageKey');
export const PUBLIC_ORDER_LOCAL_STORAGE_KEY = new InjectionToken<string>('PublicOrderStorage');
export const PUBLIC_ORDER_CONFIG_TOKEN = new InjectionToken<StoreConfig<PublicOrderState, PublicOrderAction>>('PublicOrderConfigToken');
