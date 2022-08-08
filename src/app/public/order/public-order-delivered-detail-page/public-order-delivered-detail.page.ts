import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getPublicOrderDetail } from '../+state/order.selectors';
import { PublicOrderResponse } from '../../checkout/checkout';

@Component({
  selector: 'app-public-order-delivered-detail-page',
  templateUrl: './public-order-delivered-detail.page.html',
  styleUrls: ['./public-order-delivered-detail.page.scss'],
})
export class PublicOrderDeliveredDetailPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  publicOrderDetail$: Observable<PublicOrderResponse>;
  publicOrderDetail: PublicOrderResponse;

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

    this.publicOrderDetail$ = this.store.select(getPublicOrderDetail);
    this.publicOrderDetail$.subscribe(order => {
      console.error(order)
      if (order.uuid) {
        this.publicOrderDetail = { ...order }
      } else {
        this.publicOrderDetail = null;
      }
    })
  }

  onViewOrderDetails() {
    
  }

  onLeaveReview() {
    this.router.navigate(['/public/order/list/history/detail/review'], { queryParams: { orderUuid: this.publicOrderDetail.uuid }});
  }
}