import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-popover-component',
  templateUrl: './language-popover.component.html',
  styleUrls: ['./language-popover.component.scss'],
})
export class LanguagePopoverComponent implements OnInit {
  
  constructor(private popoverController: PopoverController,
    public translateService: TranslateService) { }

  ngOnInit() {
  }

  onSelection(langCode: string) {
    this.popoverController.dismiss({ lang: langCode });
  }
}
