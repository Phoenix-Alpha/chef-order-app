import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefOfferDraftPage } from './chef-offer-draft.page';
import { ChefOfferDraftPageRoutingModule } from './chef-offer-draft-routing.module';
import { ChefOfferDraftPopoverComponent } from 'src/app/shared/chef-offer-draft-popover-component/chef-offer-draft-popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefOfferDraftPageRoutingModule,
  ],
  declarations: [ 
    ChefOfferDraftPage
  ],
  entryComponents: [ ChefOfferDraftPopoverComponent ]
})
export class ChefOfferDraftModule {}