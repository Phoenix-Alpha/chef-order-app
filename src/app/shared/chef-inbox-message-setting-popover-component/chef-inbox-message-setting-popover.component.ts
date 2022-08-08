import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-inbox-message-setting-popover-component',
  templateUrl: './chef-inbox-message-setting-popover.component.html',
  styleUrls: ['./chef-inbox-message-setting-popover.component.scss'],
})
export class ChefInboxMessageSettingPopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSelection(mode: string) {
    this.popoverController.dismiss({ mode: mode });
  }
}
