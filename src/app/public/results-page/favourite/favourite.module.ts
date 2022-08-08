import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FavouritePageRoutingModule } from './favourite-routing.module';
import { FavouritePage } from './favourite.page';
import { ResultsListPageModule } from "../results-list/results-list.module";
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { publicFavouriteReducer } from './+state/favourite.reducer';
import { FavouriteEffects } from './+state/favourite.effects';
import { FAVOURITE_CONFIG_TOKEN, FAVOURITE_LOCAL_STORAGE_KEY, FAVOURITE_STORAGE_KEYS } from './favourite.tokens';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';

export function getFavouriteConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ offers, chefs }) => ({ offers, chefs }), localStorageKey, storageService)]
  };
}


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    FavouritePageRoutingModule,
    ResultsListPageModule,
    StoreModule.forFeature('favourite', publicFavouriteReducer, FAVOURITE_CONFIG_TOKEN),
    EffectsModule.forFeature([ FavouriteEffects ]),
  ],
  declarations: [FavouritePage],
  providers: [
    FavouriteEffects,
    {
      provide: FAVOURITE_LOCAL_STORAGE_KEY,
      useValue: '__favourite_storage__'
    },
    { 
      provide: FAVOURITE_STORAGE_KEYS,
      useValue: 'favourite'
    },
    {
      provide: FAVOURITE_CONFIG_TOKEN,
      deps: [ FAVOURITE_STORAGE_KEYS, FAVOURITE_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getFavouriteConfig
    }
  ],
})
export class FavouritePageModule {}
