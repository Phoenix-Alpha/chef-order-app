import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefChatRoutingModule } from './chef-chat-routing.module';
import { ChefChatPage } from './chef-chat.page';
import { ChatSettingPopoverComponent } from 'src/app/shared/chat-setting-popover-component/chat-setting-popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ChefChatRoutingModule,
  ],
  declarations: [ ChefChatPage ],
  entryComponents: [ ChatSettingPopoverComponent ]
})
export class ChefChatModule {}