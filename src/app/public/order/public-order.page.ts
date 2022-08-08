import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-order-page',
  templateUrl: './public-order.page.html',
  styleUrls: ['./public-order.page.scss'],
})
export class PublicOrderPage implements OnInit, AfterViewInit {
  
  @ViewChild('tabs') tabs: IonTabs;

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

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

  }

  ngAfterViewInit() {
    this.currentTab = "pending"
    this.tabs.select(this.currentTab);
  }

  tabWillChange(event) {
    if (event && event.tab) {
      this.currentTab = event.tab
    }
  }

}