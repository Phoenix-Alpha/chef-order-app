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
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefOrderDetail } from '../order';

@Component({
  selector: 'app-chef-order-inprep-page',
  templateUrl: './chef-order-inprep.page.html',
  styleUrls: ['./chef-order-inprep.page.scss'],
})
export class ChefOrderInPrepPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  inprepOrderList$: Observable<ChefOrderDetail[]>;
  inprepOrderList: ChefOrderDetail[];

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

    this.inprepOrderList$ = this.store.select(getInprepOrderList)
    this.inprepOrderList$.subscribe(list => {
      this.inprepOrderList = [ ...list ];
      console.log(this.inprepOrderList);
    })
  }

  onClickOrderItem(order: ChefOrderDetail) {
    this.router.navigate(['public/chef/order/list/inprep/detail'], { queryParams: { orderUuid: order.uuid } });
  }
}