import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicOrderPendingPageRoutingModule } from './public-order-pending-routing.module';
import { PublicOrderPendingPage } from './public-order-pending.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    PublicOrderPendingPageRoutingModule,
  ],
  declarations: [ 
    PublicOrderPendingPage,
  ]
})
export class PublicOrderPendingModule {}