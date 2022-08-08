import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getInprepOrderList } from '../+state/order.selectors';
import { PublicOrderResponse } from '../../checkout/checkout';

@Component({
  selector: 'app-public-order-inprep-page',
  templateUrl: './public-order-inprep.page.html',
  styleUrls: ['./public-order-inprep.page.scss'],
})
export class PublicOrderInPrepPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  inprepOrderList$: Observable<PublicOrderResponse[]>;
  inprepOrderList: PublicOrderResponse[];

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

    this.inprepOrderList$ = this.store.select(getInprepOrderList)
    this.inprepOrderList$.subscribe(list => {
      this.inprepOrderList = [ ...list ];
      console.log(this.inprepOrderList);
    })
  }

  onClickOrderItem(order: PublicOrderResponse) {
    this.router.navigate(['public/order/list/inprep/detail'], { queryParams: { orderUuid: order.uuid } });
  }
}