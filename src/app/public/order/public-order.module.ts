import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';
import { PublicOrderService } from './public-order.service';
import { PublicOrderPageRoutingModule } from './public-order-routing.module';
import { publicOrderReducer } from './+state/order.reducer';
import { PUBLIC_ORDER_CONFIG_TOKEN, PUBLIC_ORDER_LOCAL_STORAGE_KEY, PUBLIC_ORDER_STORAGE_KEYS } from './public-order.tokens';
import { PublicOrderPage } from './public-order.page';
import { PublicOrderPendingDetailPage } from './public-order-pending-detail-page/public-order-pending-detail.page';
import { PublicOrderInPrepDetailPage } from './public-order-inprep-detail-page/public-order-inprep-detail.page';
import { PublicOrderDeliveryConfirmPage } from './public-order-delivery-confirm-page/public-order-delivery-confirm.page';
import { PublicOrderEffects } from './+state/order.effects';
import { PublicOrderDeliveredDetailPage } from './public-order-delivered-detail-page/public-order-delivered-detail.page';
import { PublicOrderDeliveredDetailReviewPage } from './public-order-delivered-detail-review-page/public-order-delivery-detail-review.page';

export function getPublicOrderConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ }) => ({ }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    PublicOrderPageRoutingModule,
    StoreModule.forFeature('public-order', publicOrderReducer, PUBLIC_ORDER_CONFIG_TOKEN),
    EffectsModule.forFeature([ PublicOrderEffects ]),
  ],
  declarations: [ 
    PublicOrderPage,
    PublicOrderPendingDetailPage,
    PublicOrderInPrepDetailPage,
    PublicOrderDeliveryConfirmPage,
    PublicOrderDeliveredDetailPage,
    PublicOrderDeliveredDetailReviewPage,
  ],
  providers: [
    PublicOrderService,
    PublicOrderEffects,
    {
      provide: PUBLIC_ORDER_LOCAL_STORAGE_KEY,
      useValue: '__public_order_storage__'
    },
    { 
      provide: PUBLIC_ORDER_STORAGE_KEYS,
      useValue: 'public-order'
    },
    {
      provide: PUBLIC_ORDER_CONFIG_TOKEN,
      deps: [ PUBLIC_ORDER_STORAGE_KEYS, PUBLIC_ORDER_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getPublicOrderConfig
    }
  ],
  entryComponents: [  ]
})
export class PublicOrderModule {}