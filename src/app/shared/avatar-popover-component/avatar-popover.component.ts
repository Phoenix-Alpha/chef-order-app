import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-avatar-popover-component',
  templateUrl: './avatar-popover.component.html',
  styleUrls: ['./avatar-popover.component.scss'],
})
export class AvatarPopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSelection(mode: string) {
    this.popoverController.dismiss({ mode: mode });
  }
}
