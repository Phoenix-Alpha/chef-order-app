import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-inbox-notification-setting-popover-component',
  templateUrl: './chef-inbox-notification-setting-popover.component.html',
  styleUrls: ['./chef-inbox-notification-setting-popover.component.scss'],
})
export class ChefInboxNotificationSettingPopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSelection(mode: string) {
    this.popoverController.dismiss({ mode: mode });
  }
}
