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
import { PublicOrderResponse } from '../../checkout/checkout';

@Component({
  selector: 'app-public-order-delivered-page',
  templateUrl: './public-order-delivered.page.html',
  styleUrls: ['./public-order-delivered.page.scss'],
})
export class PublicOrderDeliveredPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  historyOrderList$: Observable<PublicOrderResponse[]>;
  historyOrderList: PublicOrderResponse[];

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

    this.historyOrderList$ = this.store.select(getHistoryOrderList)
    this.historyOrderList$.subscribe(list => {
      this.historyOrderList = [ ...list ];
    })
  }

  onClickOrderItem(order: PublicOrderResponse) {
    this.router.navigate(['public/order/list/history/detail'], { queryParams: { orderUuid: order.uuid } });
  }
}