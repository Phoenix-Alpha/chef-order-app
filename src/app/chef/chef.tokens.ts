import { ChefState } from './+state/chef.reducer';
import { ChefAction } from './+state/chef.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const CHEF_STORAGE_KEYS = new InjectionToken<keyof ChefState>('chefStorageKey');
export const CHEF_LOCAL_STORAGE_KEY = new InjectionToken<string>('ChefStorage');
export const CHEF_CONFIG_TOKEN = new InjectionToken<StoreConfig<ChefState, ChefAction>>('ChefConfigToken');
