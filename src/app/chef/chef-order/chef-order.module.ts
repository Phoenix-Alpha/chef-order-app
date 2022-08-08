import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOrderPageRoutingModule } from './chef-order-routing.module';
import { ChefOrderPage } from './chef-order.page';
import { ChefOrderPendingDetailPage } from './chef-order-pending-detail-page/chef-order-pending-detail.page';
import { ChefOrderInPrepDetailPage } from './chef-order-inprep-detail-page/chef-order-inprep-detail.page';
import { ChefOrderDeliveryConfirmPage } from './chef-order-delivery-confirm-page/chef-order-delivery-confirm.page';
import { CodeInputModule } from 'angular-code-input';
import { ChefOrderInstructionPage } from './chef-order-instruction-page/chef-order-instruction.page';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffects } from './+state/order.effects';
import { orderReducer } from './+state/order.reducer';
import { ChefOrderService } from './order.service';
import { ORDER_CONFIG_TOKEN, ORDER_LOCAL_STORAGE_KEY, ORDER_STORAGE_KEYS } from './order.tokens';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';

export function getOrderConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ orderDetail }) => ({ orderDetail }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    CodeInputModule,
    ChefOrderPageRoutingModule,
    StoreModule.forFeature('order', orderReducer, ORDER_CONFIG_TOKEN),
    EffectsModule.forFeature([ OrderEffects ]),
  ],
  declarations: [ 
    ChefOrderPage,
    ChefOrderInstructionPage,
    ChefOrderPendingDetailPage,
    ChefOrderInPrepDetailPage,
    ChefOrderDeliveryConfirmPage,
  ],
  providers: [
    ChefOrderService,
    OrderEffects,
    {
      provide: ORDER_LOCAL_STORAGE_KEY,
      useValue: '__order_storage__'
    },
    { 
      provide: ORDER_STORAGE_KEYS,
      useValue: 'order'
    },
    {
      provide: ORDER_CONFIG_TOKEN,
      deps: [ ORDER_STORAGE_KEYS, ORDER_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getOrderConfig
    }
  ],
  entryComponents: [  ]
})
export class ChefOrderModule {}