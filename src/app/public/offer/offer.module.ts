import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OfferPageRoutingModule } from './offer-routing.module';
import { OfferPage } from './offer.page';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PublicOfferEffects } from './+state/offer.effects';
import { publicOfferReducer } from './+state/offer.reducer';
import { PUBLICOFFER_CONFIG_TOKEN, PUBLICOFFER_LOCAL_STORAGE_KEY, PUBLICOFFER_STORAGE_KEYS } from './public-offer.tokens';
import { PublicOfferService } from './public-offer.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewerModalComponent } from 'src/app/shared/image-viewer-modal/viewer-modal.component';

export function getPublicOfferConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ offerDetail, suggestions }) => ({ offerDetail, suggestions }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OfferPageRoutingModule,
    StoreModule.forFeature('public-offer', publicOfferReducer, PUBLICOFFER_CONFIG_TOKEN),
    EffectsModule.forFeature([ PublicOfferEffects ]),
  ],
  declarations: [OfferPage],
  providers: [
    PublicOfferService,
    PublicOfferEffects,
    {
      provide: PUBLICOFFER_LOCAL_STORAGE_KEY,
      useValue: '__public_offer_storage__'
    },
    { 
      provide: PUBLICOFFER_STORAGE_KEYS,
      useValue: 'public_offer'
    },
    {
      provide: PUBLICOFFER_CONFIG_TOKEN,
      deps: [ PUBLICOFFER_STORAGE_KEYS, PUBLICOFFER_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getPublicOfferConfig
    }
  ],
  entryComponents: [
    ViewerModalComponent,
  ]
})
export class OfferPageModule {}
