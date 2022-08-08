import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOfferActivePage } from './chef-offer-active.page';
import { ChefOfferActivePageRoutingModule } from './chef-offer-active-routing.module';
import { ChefOfferActivePopoverComponent } from 'src/app/shared/chef-offer-active-popover-component/chef-offer-active-popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefOfferActivePageRoutingModule,
  ],
  declarations: [ 
    ChefOfferActivePage
  ],
  entryComponents: [ ChefOfferActivePopoverComponent ]
})
export class ChefOfferActiveModule {}