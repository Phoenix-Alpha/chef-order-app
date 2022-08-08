import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
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
import QRCodeStyling from "qr-code-styling";

@Component({
  selector: 'app-public-order-delivery-confirm-page',
  templateUrl: './public-order-delivery-confirm.page.html',
  styleUrls: ['./public-order-delivery-confirm.page.scss'],
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
export class PublicOrderDeliveryConfirmPage implements OnInit {

  @ViewChild("canvas", { static: true }) canvas: ElementRef;
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  confirmed: boolean = false;

  publicOrderDetail$: Observable<PublicOrderResponse>;
  publicOrderDetail: PublicOrderResponse;

  qrCode = null;

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
      if (order.uuid) {
        this.publicOrderDetail = { ...order }
      } else {
        this.publicOrderDetail = null;
      }
    })

    
  }

  ionViewWillEnter() {
    this.confirmed = false;
  }

  ionViewDidEnter() {
    this.qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'svg',
      image: "assets/images/logo only w.o background active.png",
      data: `${this.publicOrderDetail.pickupCode}`,
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "M"
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0
      },
      dotsOptions: {
        type: "dots",
        color: "#000000"
      },
      backgroundOptions: {
        color: "#ffffff"
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000"
      },
      cornersDotOptions: {
        type: "dot",
        color: "#000000"
      },
    });

    console.log(this.qrCode)
    this.qrCode.append(this.canvas.nativeElement);
  }

  onClickQRScan() {
    this.confirmed = true;
  }

  onBack() {
    this.router.navigate(['/public/order/list/delivered'])
  }

}