import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefInboxPage } from './chef-inbox.page';
import { ChefInboxPageRoutingModule } from './chef-inbox-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefInboxNotificationSettingPopoverComponent } from 'src/app/shared/chef-inbox-notification-setting-popover-component/chef-inbox-notification-setting-popover.component';
import { ChefInboxMessageSettingPopoverComponent } from 'src/app/shared/chef-inbox-message-setting-popover-component/chef-inbox-message-setting-popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefInboxPageRoutingModule,
  ],
  declarations: [ ChefInboxPage ],
  entryComponents: [ ChefInboxNotificationSettingPopoverComponent, ChefInboxMessageSettingPopoverComponent ]
})
export class ChefInboxModule {}