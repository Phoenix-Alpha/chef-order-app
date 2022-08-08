import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ChefWalletInfo } from "./wallet.reducer";

export const getChefWalletInfo = createFeatureSelector<ChefWalletInfo>('wallet');
export const getChefWalletAPIStatus = createSelector(getChefWalletInfo, (state: ChefWalletInfo) => state.apiStatus);