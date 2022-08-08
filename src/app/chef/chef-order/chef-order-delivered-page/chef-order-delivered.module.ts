import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOrderDeliveredPage } from './chef-order-delivered.page';
import { ChefOrderDeliveredPageRoutingModule } from './chef-order-delivered-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefOrderDeliveredPageRoutingModule
  ],
  declarations: [ 
    ChefOrderDeliveredPage
  ]
})
export class ChefOrderDeliveredModule {}