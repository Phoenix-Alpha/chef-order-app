import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { ConfirmOrderDelivery } from '../+state/order.actions';
import { getChefOrderDetail } from '../+state/order.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefOrderConfirmDeliveryRequest, ChefOrderDetail } from '../order';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-chef-order-delivery-confirm-page',
  templateUrl: './chef-order-delivery-confirm.page.html',
  styleUrls: ['./chef-order-delivery-confirm.page.scss'],
  animations: [
    trigger(
      'fadeAnimation', 
      [
        // the "in" style determines the "resting" state of the element when it is visible.
        state('in', style({opacity: 1})),

        // fade in when created. this could also be written as transition('void => *')
        transition(':enter', [
          style({opacity: 0}),
          animate(400)
        ]),

        // fade out when destroyed. this could also be written as transition('void => *')
        transition(':leave', animate(400, style({opacity: 0})))
      ]
    )
  ]
})
export class ChefOrderDeliveryConfirmPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  confirmed: boolean = false;

  chefOrderDetail$: Observable<ChefOrderDetail>;
  chefOrderDetail: ChefOrderDetail;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
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

  ionViewWillEnter() {
    this.confirmed = false;
  }

  onCodeChanged(code: string) {

  }

  onCodeCompleted(code: string) {
    if (this.chefOrderDetail) {
      const request: ChefOrderConfirmDeliveryRequest = {
        email: '',
        orderUuid: this.chefOrderDetail.uuid,
        confirmCode: code
      }
      this.store.dispatch(new ConfirmOrderDelivery(request))
    }
    
  }

  onClickQRScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled && barcodeData.text) {
        const request: ChefOrderConfirmDeliveryRequest = {
          email: '',
          orderUuid: this.chefOrderDetail.uuid,
          confirmCode: barcodeData.text
        }
        this.store.dispatch(new ConfirmOrderDelivery(request))
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  onBack() {
    this.router.navigate(['/public/chef/order/list/delivered'])
  }

}