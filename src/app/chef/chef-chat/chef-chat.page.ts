import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChatSettingPopoverComponent } from 'src/app/shared/chat-setting-popover-component/chat-setting-popover.component';

@Component({
  selector: 'app-chef-chat-page',
  templateUrl: './chef-chat.page.html',
  styleUrls: ['./chef-chat.page.scss'],
})
export class ChefChatPage implements OnInit {

  chatTitle: string = "Tajine chicken";
  chatSubtitle: string = "Inna";
  
  message_other: string = "Hello,<br/><br/>I would like to inform you that, I will come 15 minutes later to pick up my order.<br/><br/>Would that be ok?"
  message_me: string = "Hello, no problem :)";

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private popoverController: PopoverController,
    private router: Router) { }

  ngOnInit() {
    
  }

  onClickSettingButton(event) {
    this.popoverController.create({
      component: ChatSettingPopoverComponent,
      cssClass: 'chef-chat-setting-popover-class',
      event,
    }).then(popover => {
      popover.present();
    })
  }


}