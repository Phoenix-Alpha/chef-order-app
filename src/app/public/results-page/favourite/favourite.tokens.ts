import { FavouriteState } from './+state/favourite.reducer';
import { FavouriteAction } from './+state/favourite.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const FAVOURITE_STORAGE_KEYS = new InjectionToken<keyof FavouriteState>('favouriteStorageKey');
export const FAVOURITE_LOCAL_STORAGE_KEY = new InjectionToken<string>('FavouriteStorage');
export const FAVOURITE_CONFIG_TOKEN = new InjectionToken<StoreConfig<FavouriteState, FavouriteAction>>('FavouriteConfigToken');
