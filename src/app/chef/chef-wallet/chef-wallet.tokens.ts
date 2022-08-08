import { ChefWalletState } from './+state/wallet.reducer';
import { ChefWalletAction } from './+state/wallet.action';
import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store';

export const CHEF_WALLET_STORAGE_KEYS = new InjectionToken<keyof ChefWalletState>('chefWalletStorageKey');
export const CHEF_WALLET_LOCAL_STORAGE_KEY = new InjectionToken<string>('ChefWalletStorage');
export const CHEF_WALLET_CONFIG_TOKEN = new InjectionToken<StoreConfig<ChefWalletState, ChefWalletAction>>('ChefWalletConfigToken');
