import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOfferPage } from './chef-offer.page';
import { ChefOfferPageRoutingModule } from './chef-offer-routing.module';
import { IonChipCheckable } from 'src/app/shared/ion-chip-checkable/ion-chip-checkable';
import { AvatarEditPopoverComponent } from 'src/app/shared/avatar-edit-popover-component/avatar-edit-popover.component';
import { AvatarPopoverComponent } from 'src/app/shared/avatar-popover-component/avatar-popover.component';
import { NewOfferModePage } from './new-offer-mode-page/new-offer-mode.page';
import { OfferPage } from './offer-page/offer.page';
import { OfferDishDetailPage } from './offer-dish-detail-page/offer-dish-detail.page';
import { OfferDeliveryOptionsPage } from './offer-delivery-options-page/offer-delivery-options.page';
import { OfferPricePage } from './offer-price-page/offer-price.page';
import { NgxMaskModule } from 'ngx-mask';
import { IonChipCheckableList } from 'src/app/shared/ion-chip-checkable-list/ion-chip-checkable-list';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OfferEffects } from './+state/offer.effects';
import { offerReducer } from './+state/offer.reducer';
import { OFFER_CONFIG_TOKEN, OFFER_LOCAL_STORAGE_KEY, OFFER_STORAGE_KEYS } from './offer.tokens';
import { OfferService } from './offer.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerModalComponent } from 'src/app/shared/image-viewer-modal/viewer-modal.component';

export function getOfferConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ offerDetail, register }) => ({ offerDetail, register }), localStorageKey, storageService)]
  };
}

@NgModule({
  declarations: [ 
    ChefOfferPage,
    OfferPage,
    NewOfferModePage,
    OfferDishDetailPage,
    OfferDeliveryOptionsPage,
    OfferPricePage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    ChefOfferPageRoutingModule,
    StoreModule.forFeature('offer', offerReducer, OFFER_CONFIG_TOKEN),
    EffectsModule.forFeature([ OfferEffects ]),
  ],
  providers: [
    OfferService,
    OfferEffects,
    {
      provide: OFFER_LOCAL_STORAGE_KEY,
      useValue: '__offer_storage__'
    },
    { 
      provide: OFFER_STORAGE_KEYS,
      useValue: 'offer'
    },
    {
      provide: OFFER_CONFIG_TOKEN,
      deps: [ OFFER_STORAGE_KEYS, OFFER_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getOfferConfig
    }
  ],
  entryComponents: [ 
    AvatarPopoverComponent, 
    AvatarEditPopoverComponent, 
    IonChipCheckable, 
    IonChipCheckableList,
    ViewerModalComponent,
  ]
})
export class ChefOfferModule {}
