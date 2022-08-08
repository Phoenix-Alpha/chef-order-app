import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonSlides, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getPublicOrderDetail } from '../+state/order.selectors';
import { PublicOrderResponse } from '../../checkout/checkout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx'
import { PublicOrderSubmitReviewRequest } from '../public-order';
import { SubmitPublicOrderReview } from '../+state/order.actions';

@Component({
  selector: 'app-public-order-delivery-detail-review-page',
  templateUrl: './public-order-delivery-detail-review.page.html',
  styleUrls: ['./public-order-delivery-detail-review.page.scss'],
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
export class PublicOrderDeliveredDetailReviewPage implements OnInit {

  @ViewChild("canvas", { static: true }) canvas: ElementRef;

  @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  
  titles = [
    'Bad',
    'Mediocre',
    'Okay',
    'Awesome',
    'Top'
  ];

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  publicOrderDetail$: Observable<PublicOrderResponse>;
  publicOrderDetail: PublicOrderResponse;

  reviewForm: FormGroup;

  selectedRating: number = 5;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private fb: FormBuilder,
    private router: Router,
    private device: Device,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.reviewForm = this.fb.group({
      review: ['', Validators.compose([ Validators.required, Validators.maxLength(512) ])],
    });

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
  }

  ionViewDidEnter() {
  }

  onClickNext() {
    this.slides.slideNext();
  }

  onRateChange(event) {
    this.selectedRating = event;
  }

  onSubmit() {
    console.log(this.selectedRating, this.review.value)
    const request: PublicOrderSubmitReviewRequest = {
      orderUuid: this.publicOrderDetail.uuid,
      deviceIdentifier: this.device.uuid,
      rating: this.selectedRating,
      comment: this.review.value
    }
    this.store.dispatch(new SubmitPublicOrderReview(request))
  }

  get review() {
    return this.reviewForm.get('review');
  }

}