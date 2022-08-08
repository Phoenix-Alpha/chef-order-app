import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOrderPendingPage } from './chef-order-pending.page';
import { ChefOrderPendingPageRoutingModule } from './chef-order-pending-routing.module';
import { ChefOrderPendingDetailPage } from '../chef-order-pending-detail-page/chef-order-pending-detail.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefOrderPendingPageRoutingModule,
  ],
  declarations: [ 
    ChefOrderPendingPage,
  ]
})
export class ChefOrderPendingModule {}