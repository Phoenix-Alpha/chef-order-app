import { PublicChefState } from './+state/public-chef.reducer';
import { PublicChefAction } from './+state/public-chef.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const PUBLICCHEF_STORAGE_KEYS = new InjectionToken<keyof PublicChefState>('publicChefStorageKey');
export const PUBLICCHEF_LOCAL_STORAGE_KEY = new InjectionToken<string>('PublicChefStorage');
export const PUBLICCHEF_CONFIG_TOKEN = new InjectionToken<StoreConfig<PublicChefState, PublicChefAction>>('PublicChefConfigToken');
