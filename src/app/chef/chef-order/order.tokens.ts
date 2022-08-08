import { OrderState } from './+state/order.reducer';
import { OrderAction } from './+state/order.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const ORDER_STORAGE_KEYS = new InjectionToken<keyof OrderState>('orderStorageKey');
export const ORDER_LOCAL_STORAGE_KEY = new InjectionToken<string>('OrderStorage');
export const ORDER_CONFIG_TOKEN = new InjectionToken<StoreConfig<OrderState, OrderAction>>('OrderConfigToken');
