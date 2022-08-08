import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChefDetailPageRoutingModule } from './chef-detail-routing.module';

import { ChefDetailPage } from './chef-detail.page';
import {TranslateModule} from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PublicChefEffects } from './+state/public-chef.effects';
import { publicChefReducer } from './+state/public-chef.reducer';
import { PublicChefService } from './public-chef.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { PUBLICCHEF_CONFIG_TOKEN, PUBLICCHEF_LOCAL_STORAGE_KEY, PUBLICCHEF_STORAGE_KEYS } from './public-chef.tokens';
import { storageMetaReducer } from 'src/app/storage.metareducer';
import { SharedModule } from 'src/app/shared/shared.module';

export function getPublicChefConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ detail, suggestions }) => ({ detail, suggestions }), localStorageKey, storageService)]
  };
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChefDetailPageRoutingModule,
    TranslateModule,
    SharedModule,
    StoreModule.forFeature('public-chef', publicChefReducer, PUBLICCHEF_CONFIG_TOKEN),
    EffectsModule.forFeature([ PublicChefEffects ]),
  ],
  declarations: [ChefDetailPage],
  providers: [
    PublicChefService,
    PublicChefEffects,
    {
      provide: PUBLICCHEF_LOCAL_STORAGE_KEY,
      useValue: '__public_chef_storage__'
    },
    { 
      provide: PUBLICCHEF_STORAGE_KEYS,
      useValue: 'public_chef'
    },
    {
      provide: PUBLICCHEF_CONFIG_TOKEN,
      deps: [ PUBLICCHEF_STORAGE_KEYS, PUBLICCHEF_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getPublicChefConfig
    }
  ],

})
export class ChefDetailPageModule {}
