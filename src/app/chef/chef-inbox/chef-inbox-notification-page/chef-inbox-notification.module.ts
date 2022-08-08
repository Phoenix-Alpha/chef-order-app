import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefInboxNotificationPage } from './chef-inbox-notification.page';
import { ChefInboxNotificationPageRoutingModule } from './chef-inbox-notification-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefInboxNotificationPageRoutingModule,
  ],
  declarations: [ChefInboxNotificationPage]
})
export class ChefInboxNotificationModule {}