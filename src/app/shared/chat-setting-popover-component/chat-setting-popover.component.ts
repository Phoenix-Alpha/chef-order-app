import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-setting-popover-component',
  templateUrl: './chat-setting-popover.component.html',
  styleUrls: ['./chat-setting-popover.component.scss'],
})
export class ChatSettingPopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSelection(mode: string) {
    this.popoverController.dismiss({ mode: mode });
  }
}
