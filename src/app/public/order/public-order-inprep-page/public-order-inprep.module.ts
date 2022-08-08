import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicOrderInPrepPageRoutingModule } from './public-order-inprep-routing.module';
import { PublicOrderInPrepPage } from './public-order-inprep.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    PublicOrderInPrepPageRoutingModule,
  ],
  declarations: [ 
    PublicOrderInPrepPage,
  ]
})
export class PublicOrderInPrepModule {}