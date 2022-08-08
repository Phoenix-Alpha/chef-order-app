import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-promote-guard-popover-component',
  templateUrl: './chef-promote-guard-popover.component.html',
  styleUrls: ['./chef-promote-guard-popover.component.scss'],
})
export class ChefPromoteGuardPopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }
}
