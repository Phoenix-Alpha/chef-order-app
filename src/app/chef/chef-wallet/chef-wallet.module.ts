import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefWalletPage } from './chef-wallet.page';
import { ChefWalletPageRoutingModule } from './chef-wallet-routing.module';
import { ChefWalletInfoPage } from './chef-wallet-info/chef-wallet-info.page';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ChefWalletEffects } from './+state/wallet.effects';
import { chefWalletReducer } from './+state/wallet.reducer';
import { CHEF_WALLET_CONFIG_TOKEN, CHEF_WALLET_LOCAL_STORAGE_KEY, CHEF_WALLET_STORAGE_KEYS } from './chef-wallet.tokens';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';
import { ReactiveFormsModule } from '@angular/forms';

export function getChefWalletConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ }) => ({ }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ChefWalletPageRoutingModule,
    StoreModule.forFeature('wallet', chefWalletReducer),
    EffectsModule.forFeature([ ChefWalletEffects ]),
  ],
  declarations: [ 
    ChefWalletPage,
    ChefWalletInfoPage,
  ],
  entryComponents: [  ],
  providers: [
    {
      provide: CHEF_WALLET_LOCAL_STORAGE_KEY,
      useValue: '__chef_wallet_storage__'
    },
    {
      provide: CHEF_WALLET_STORAGE_KEYS,
      useValue: 'chef_wallet'
    },
    {
      provide: CHEF_WALLET_CONFIG_TOKEN,
      deps: [ CHEF_WALLET_STORAGE_KEYS, CHEF_WALLET_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getChefWalletConfig
    }
  ],
})
export class ChefWalletModule {}
