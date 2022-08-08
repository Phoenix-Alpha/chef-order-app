import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefRoutingModule } from './chef-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ChefInstructionPage } from './chef-instruction-page/chef-instruction.page';
import { ChefPromotePage } from './chef-promote-page/chef-promote.page';
import { ChefEngagementsPage } from './chef-engagements-page/chef-engagements.page';
import { PhoneVerificationPage } from './phone-verification-page/phone-verification.page';
import { CodeInputModule } from 'angular-code-input';
import { IonIntlTelInputModule } from '../ion-intl-tel-input/ion-intl-tel-input.module';
import { LocalStorageService } from '../local-storage.service';
import { storageMetaReducer } from '../storage.metareducer';
import { chefReducer } from './+state/chef.reducer';
import { CHEF_CONFIG_TOKEN, CHEF_LOCAL_STORAGE_KEY, CHEF_STORAGE_KEYS } from './chef.tokens';
import { ChefEffects } from './+state/chef.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChefService } from './chef.service';
import { PhoneConfirmPage } from './phone-confirm-page/phone-confirm.page';
import { ChefDashboardPage } from './chef-dashboard-page/chef-dashboard.page';
import { ChefPackagingPage } from './chef-packaging-page/chef-packaging.page';
import { ChefVacationPage } from './chef-vacation-page/chef-vacation.page';
import { NgxMaskModule } from 'ngx-mask';
import { AvatarPopoverComponent } from '../shared/avatar-popover-component/avatar-popover.component';
import { AvatarEditPopoverComponent } from '../shared/avatar-edit-popover-component/avatar-edit-popover.component';
import { IonChipCheckable } from '../shared/ion-chip-checkable/ion-chip-checkable';
import { ChefOfferModule } from './chef-offer/chef-offer.module';
import { ChefPromoteGuardPopoverComponent } from '../shared/chef-promote-guard-popover-component/chef-promote-guard-popover.component';
import { ChefOrderModule } from './chef-order/chef-order.module';

export function getChefConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ visitState, chefDetail, register }) => ({ visitState, chefDetail, register }), localStorageKey, storageService)]
  };
}

@NgModule({
  declarations: [
    ChefInstructionPage,
    ChefPromotePage,
    ChefEngagementsPage,
    ChefDashboardPage,
    ChefPackagingPage,
    ChefVacationPage,
    PhoneVerificationPage,
    PhoneConfirmPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ChefRoutingModule,
    CodeInputModule,
    IonIntlTelInputModule,
    NgxMaskModule,
    ChefOfferModule,
    ChefOrderModule,
    StoreModule.forFeature('chef', chefReducer, CHEF_CONFIG_TOKEN),
    EffectsModule.forFeature([ ChefEffects ]),
  ],
  providers: [
    ChefService,
    ChefEffects,
    {
      provide: CHEF_LOCAL_STORAGE_KEY,
      useValue: '__chef_storage__'
    },
    { 
      provide: CHEF_STORAGE_KEYS,
      useValue: 'chef'
    },
    {
      provide: CHEF_CONFIG_TOKEN,
      deps: [ CHEF_STORAGE_KEYS, CHEF_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getChefConfig
    }
  ],
  entryComponents: [ AvatarPopoverComponent, AvatarEditPopoverComponent, IonChipCheckable, ChefPromoteGuardPopoverComponent ]
})
export class ChefModule { }
