import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-offer-draft-popover-component',
  templateUrl: './chef-offer-draft-popover.component.html',
  styleUrls: ['./chef-offer-draft-popover.component.scss'],
})
export class ChefOfferDraftPopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSelection(mode: string) {
    this.popoverController.dismiss({ mode: mode });
  }
}
