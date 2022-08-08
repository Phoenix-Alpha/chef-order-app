import { CheckoutPageModule } from './checkout/checkout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PublicRoutingModule } from './public-routing.module';
import { publicReducer } from './+state/public.reducer';
import { PublicEffects } from './+state/public.effects';
import { PUBLIC_CONFIG_TOKEN, PUBLIC_LOCAL_STORAGE_KEY, PUBLIC_STORAGE_KEYS } from './public.tokens';
import { LocalStorageService } from '../local-storage.service';
import { storageMetaReducer } from '../storage.metareducer';
import { PublicInstructionGuard } from './public-instruction.guard';
import { HomePage } from './home-page/home.page';
import { InstructionPage } from './instruction-page/instruction.page';
import { WelcomePage } from './welcome-page/welcome-page';
import { LocationPermissionPage } from './location-permission-page/location-permission-page';
import { LocationPermissionGuard } from './location-permission.guard';
import { LanguagePopoverComponent } from '../shared/language-popover-component/language-popover.component';
import { AuthModule } from '../auth/auth.module';
import { ChefModule } from '../chef/chef.module';
import { OfferMapPage } from './offer-map-page/offer-map.page';
import { DetailPageModule } from './offer/detail/detail.module';
import { ChefDetailPageModule } from './chef-detail/chef-detail.module';
import { ResultsPageModule } from './results-page/results.module';
import { OfferPageModule } from './offer/offer.module';

export function getPublicConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({visitState}) => ({visitState}), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    PublicRoutingModule,
    AuthModule,
    ChefModule,
    DetailPageModule,
    ChefDetailPageModule,
    ResultsPageModule,
    CheckoutPageModule,
    OfferPageModule,
    StoreModule.forFeature('public', publicReducer, PUBLIC_CONFIG_TOKEN),
    EffectsModule.forFeature([PublicEffects]),
  ],
  declarations: [
    HomePage,
    InstructionPage,
    WelcomePage,
    LocationPermissionPage,
    OfferMapPage,
  ],
  providers: [
    PublicInstructionGuard,
    LocationPermissionGuard,
    PublicEffects,
    {
      provide: PUBLIC_LOCAL_STORAGE_KEY,
      useValue: '__public_storage__'
    },
    {
      provide: PUBLIC_STORAGE_KEYS,
      useValue: 'public'
    },
    {
      provide: PUBLIC_CONFIG_TOKEN,
      deps: [ PUBLIC_STORAGE_KEYS, PUBLIC_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getPublicConfig
    }
  ],
  entryComponents: [ LanguagePopoverComponent ]
})
export class PublicModule {}
