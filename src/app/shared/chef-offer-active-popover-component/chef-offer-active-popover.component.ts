import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-offer-active-popover-component',
  templateUrl: './chef-offer-active-popover.component.html',
  styleUrls: ['./chef-offer-active-popover.component.scss'],
})
export class ChefOfferActivePopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSelection(mode: string) {
    this.popoverController.dismiss({ mode: mode });
  }
}
