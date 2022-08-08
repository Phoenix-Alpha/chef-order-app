import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOrderInPrepPageRoutingModule } from './chef-order-inprep-routing.module';
import { ChefOrderInPrepPage } from './chef-order-inprep.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefOrderInPrepPageRoutingModule,
  ],
  declarations: [ 
    ChefOrderInPrepPage,
  ]
})
export class ChefOrderInPrepModule {}