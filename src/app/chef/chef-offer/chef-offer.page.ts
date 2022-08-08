import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getChefDetail } from '../+state/chef.selectors';
import { ChefDetail } from '../chef';

@Component({
  selector: 'app-chef-offer-page',
  templateUrl: './chef-offer.page.html',
  styleUrls: ['./chef-offer.page.scss'],
})
export class ChefOfferPage implements OnInit, AfterViewInit {
  
  @ViewChild('tabs') tabs: IonTabs;

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  currentTab: string;

  mode: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.queryParams.mode;
    
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
    this.currentTab = "active"
    this.tabs.select(this.currentTab);
  }

  tabWillChange(event) {
    if (event && event.tab) {
      this.currentTab = event.tab
    }
  }


}