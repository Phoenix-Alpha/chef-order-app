import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicOrderDeliveredPageRoutingModule } from './public-order-delivered-routing.module';
import { PublicOrderDeliveredPage } from './public-order-delivered.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    PublicOrderDeliveredPageRoutingModule
  ],
  declarations: [ 
    PublicOrderDeliveredPage
  ]
})
export class PublicOrderDeliveredModule {}