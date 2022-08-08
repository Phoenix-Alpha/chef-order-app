import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Chef, ChefState } from './chef.reducer';

export const getChefState = createFeatureSelector<Chef>('chef');
export const getRegistrationState = createSelector(getChefState, (state: Chef) => state.register);
export const getRegistrationStatus = createSelector(getChefState, (state: Chef) => state.register.status);
export const getChefDetail = createSelector(getChefState, (state: Chef) => state.chefDetail);
export const getChefDetailStatus = createSelector(getChefState, (state: Chef) => state.chefDetail.status);
export const getChefOrderInstructionVisited = createSelector(getChefState, (state: Chef) => state.visitState.orderInstructionVisited);