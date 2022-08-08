import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { HandlePendingOrder } from '../+state/order.actions';
import { getChefOrderDetail } from '../+state/order.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefOrderDetail, OrderStatus } from '../order';

@Component({
  selector: 'app-chef-order-pending-detail-page',
  templateUrl: './chef-order-pending-detail.page.html',
  styleUrls: ['./chef-order-pending-detail.page.scss'],
})
export class ChefOrderPendingDetailPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  chefOrderDetail$: Observable<ChefOrderDetail>;
  chefOrderDetail: ChefOrderDetail;

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

    this.chefOrderDetail$ = this.store.select(getChefOrderDetail);
    this.chefOrderDetail$.subscribe(chefOrderDetail => {
      if (chefOrderDetail.uuid) {
        this.chefOrderDetail = { ...chefOrderDetail }
      } else {
        this.chefOrderDetail = null;
      }
    })
  }

  onTakeOrder() {
    if (this.chefOrderDetail.uuid) {
      this.store.dispatch(new HandlePendingOrder({
        email: '',
        orderUuid: this.chefOrderDetail.uuid,
        status: OrderStatus.APPROVED,
      }))
    }
  }

  onRejectOrder() {
    if (this.chefOrderDetail.uuid) {
      this.store.dispatch(new HandlePendingOrder({
        email: '',
        orderUuid: this.chefOrderDetail.uuid,
        status: OrderStatus.REJECTED,
      }))
    }
  }
  
}