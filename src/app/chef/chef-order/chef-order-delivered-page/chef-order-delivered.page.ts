import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getHistoryOrderList } from '../+state/order.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefOrderDetail } from '../order';

@Component({
  selector: 'app-chef-order-delivered-page',
  templateUrl: './chef-order-delivered.page.html',
  styleUrls: ['./chef-order-delivered.page.scss'],
})
export class ChefOrderDeliveredPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  historyOrderList$: Observable<ChefOrderDetail[]>;
  historyOrderList: ChefOrderDetail[];

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

    this.historyOrderList$ = this.store.select(getHistoryOrderList)
    this.historyOrderList$.subscribe(list => {
      this.historyOrderList = [ ...list ];
    })
  }

  onClickOrderItem(order: ChefOrderDetail) {
      
  }
}