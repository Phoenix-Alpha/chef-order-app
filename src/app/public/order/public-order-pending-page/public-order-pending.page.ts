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
import { PublicOrderResponse } from '../../checkout/checkout';

@Component({
  selector: 'app-public-order-pending-page',
  templateUrl: './public-order-pending.page.html',
  styleUrls: ['./public-order-pending.page.scss'],
})
export class PublicOrderPendingPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  pendingOrderList$: Observable<PublicOrderResponse[]>;
  pendingOrderList: PublicOrderResponse[];

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

    this.pendingOrderList$ = this.store.select(getPendingOrderList)
    this.pendingOrderList$.subscribe(list => {
      this.pendingOrderList = [ ...list ];
    })
  }

  onClickOrderItem(order: PublicOrderResponse) {
    this.router.navigate(['public/order/list/pending/detail'], { queryParams: { orderUuid: order.uuid } });
  }
}