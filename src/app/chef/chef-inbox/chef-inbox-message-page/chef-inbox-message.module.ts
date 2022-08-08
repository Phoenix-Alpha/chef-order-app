import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefInboxMessagePage } from './chef-inbox-message.page';
import { ChefInboxMessagePageRoutingModule } from './chef-inbox-message-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefInboxMessagePageRoutingModule,
  ],
  declarations: [ChefInboxMessagePage]
})
export class ChefInboxMessageModule {}