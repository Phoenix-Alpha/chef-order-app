import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOfferArchivePage } from './chef-offer-archive.page';
import { ChefOfferArchivePageRoutingModule } from './chef-offer-archive-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefOfferArchivePageRoutingModule,
  ],
  declarations: [ 
    ChefOfferArchivePage
  ]
})
export class ChefOfferArchiveModule {}