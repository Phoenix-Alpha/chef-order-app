import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getPendingOrderList } from '../+state/order.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefOrderDetail } from '../order';

@Component({
  selector: 'app-chef-order-pending-page',
  templateUrl: './chef-order-pending.page.html',
  styleUrls: ['./chef-order-pending.page.scss'],
})
export class ChefOrderPendingPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  pendingOrderList$: Observable<ChefOrderDetail[]>;
  pendingOrderList: ChefOrderDetail[];

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

    this.pendingOrderList$ = this.store.select(getPendingOrderList)
    this.pendingOrderList$.subscribe(list => {
      this.pendingOrderList = [ ...list ];
    })
  }

  onClickOrderItem(order: ChefOrderDetail) {
    this.router.navigate(['public/chef/order/list/pending/detail'], { queryParams: { orderUuid: order.uuid } });
  }
}