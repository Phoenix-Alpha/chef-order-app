import { ResultState } from './+state/result.reducer';
import { ResultAction } from './+state/result.actions';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const RESULT_STORAGE_KEYS = new InjectionToken<keyof ResultState>('resultStorageKey');
export const RESULT_LOCAL_STORAGE_KEY = new InjectionToken<string>('ResultStorage');
export const RESULT_CONFIG_TOKEN = new InjectionToken<StoreConfig<ResultState, ResultAction>>('ResultConfigToken');
