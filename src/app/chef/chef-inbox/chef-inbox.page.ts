import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { AvatarEditPopoverComponent } from 'src/app/shared/avatar-edit-popover-component/avatar-edit-popover.component';
import { ChefInboxNotificationSettingPopoverComponent } from 'src/app/shared/chef-inbox-notification-setting-popover-component/chef-inbox-notification-setting-popover.component';
import { ChefInboxMessageSettingPopoverComponent } from 'src/app/shared/chef-inbox-message-setting-popover-component/chef-inbox-message-setting-popover.component';
import { environment } from 'src/environments/environment';
import { getChefDetail } from '../+state/chef.selectors';
import { ChefDetail } from '../chef';

@Component({
  selector: 'app-chef-inbox-page',
  templateUrl: './chef-inbox.page.html',
  styleUrls: ['./chef-inbox.page.scss'],
})
export class ChefInboxPage implements OnInit, AfterViewInit {
  
  @ViewChild('tabs') tabs: IonTabs;

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  currentTab: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() {

    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.subscribe(user => {
      if (user.id > 0) {
        this.loggedInUser = { ...user };
      } else {
        this.loggedInUser = null;
      }
    });

    this.chefDetail$ = this.store.select(getChefDetail);
    this.chefDetail$.subscribe(chef => {
      if (chef.id > 0) {
        this.chefDetail = { ...chef };
        console.log('user: ', this.loggedInUser);
      } else {
        this.chefDetail = null;
      }
    })
  }

  ngAfterViewInit() {
    this.currentTab = "notification"
    this.tabs.select(this.currentTab);
  }

  tabWillChange(event) {
    if (event && event.tab) {
      this.currentTab = event.tab
    }
  }

  onClickSettingButton(event) {
    if (this.currentTab == "notification") {
      this.popoverController.create({
        component: ChefInboxNotificationSettingPopoverComponent,
        cssClass: 'chef-inbox-notification-setting-popover-class',
        componentProps: {
          profilePictureUrl: this.chefDetail.profilePicture
        },
        event,
      }).then(popover => {
        popover.present();
      })
    } else if (this.currentTab == "message") {
      this.popoverController.create({
        component: ChefInboxMessageSettingPopoverComponent,
        cssClass: 'chef-inbox-message-setting-popover-class',
        componentProps: {
          profilePictureUrl: this.chefDetail.profilePicture
        },
        event,
      }).then(popover => {
        popover.present();
      })
    }
    
  }

}