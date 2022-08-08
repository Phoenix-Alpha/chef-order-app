import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides, ModalController, PopoverController, ToastController, ViewDidEnter} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getOfferDetail } from '../+state/offer.selectors';
import { PublicOfferInfo } from '../../results-page/+state/result.reducer';
import * as dayjs from 'dayjs';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AddFavouriteOffer } from '../../results-page/favourite/+state/favourite.actions';
import { ViewerModalComponent } from 'src/app/shared/image-viewer-modal/viewer-modal.component';
import { DateTimePickerComponent } from 'src/app/shared/date-time-picker/date-time-picker.component';
import { PublicOrder } from '../../checkout/+state/checkout.reducer';
import { AddOrderToBasket } from '../../checkout/+state/checkout.actions';
import { getOrders } from '../../checkout/+state/checkout.selectors';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements ViewDidEnter, OnInit {
  @ViewChild('imageSlider', { static: true }) imageSlider: IonSlides;

  slideOpts = {
    pagination: false
  };
  currentPos = 1;

  offerDetail$: Observable<PublicOfferInfo>;
  offerDetail: PublicOfferInfo;

  orders$: Observable<PublicOrder[]>;
  orders: PublicOrder[];

  cuisineList = [];
  tagList = [];
  allergenList = [];

  servingDateTimeRangeStr = '';

  viewEntered = false;

  currentAddress = '';

  totalPrice = 0;
  amount = 1;

  constructor(private store: Store<any>,
    private toastController: ToastController,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    private router: Router) {
    this.currentAddress = this.route.snapshot.queryParams.userAddress;
  }

  ngOnInit() {
    this.offerDetail$ = this.store.select(getOfferDetail);
    this.offerDetail$.subscribe(o => {
      this.offerDetail = { ...o };

      this.amount = 1;
      this.totalPrice = this.offerDetail.price * this.amount;

      console.log("offerDetail: ", this.offerDetail);
      this.servingDateTimeRangeStr = dayjs(this.offerDetail.servingStart).format("HH:mm") + " - " + dayjs(this.offerDetail.servingEnd).format("HH:mm");

      this.offerDetail.cuisines.forEach(cuisine => {
        this.cuisineList.push({
          id: cuisine,
          label: cuisine,
        });
      });

      this.offerDetail.tags.forEach(tag => {
        this.tagList.push({
          id: tag,
          label: tag,
        });
      });

      this.offerDetail.allergens.forEach(allergen => {
        this.allergenList.push({
          id: allergen,
          label: allergen,
        });
      });
    })

    this.orders$ = this.store.select(getOrders);
    this.orders$.subscribe(o => {
      this.orders = [ ...o ];
    });
  }

  ngAfterViewInit() {
    this.imageSlider.ionSlideDidChange.subscribe(async () => {
      this.currentPos = await this.imageSlider.getActiveIndex() + 1;
    });
  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewDidLeave() {
    this.viewEntered = false;
  }

  previous() {
    this.imageSlider.slidePrev();
  }

  next() {
    this.imageSlider.slideNext();
  }

  onClickBack() {
    this.router.navigate(['public/results']);
  }

  onClickShare() {

  }

  onClickPlus() {
    if (this.offerDetail.quantityAvailable) {
      if (this.amount < this.offerDetail.quantityAvailable) {
        this.amount += 1;
      }
    } else {
      this.amount += 1;
    }
    this.totalPrice = this.offerDetail.price * this.amount;
  }

  onClickMinus() {
    if (this.amount > 1) {
      this.amount -= 1;
    }
    this.totalPrice = this.offerDetail.price * this.amount;
  }

  onClickAddToFavourites() {
    this.store.dispatch(new AddFavouriteOffer(this.offerDetail));
    this.toastController.create({
      animated: true,
      message: `Offer ${this.offerDetail.title} added to the favourites successfully!`,
      duration: 3000,
      position: "middle",
    }).then(toast => {
      toast.present();
    });
  }

  async onClickSlides() {
    if (this.offerDetail.offerPictures.length > 0) {
      const modal = await this.modalController.create({
        component: ViewerModalComponent,
        componentProps: {
          src: this.offerDetail.offerPictures,
          srcFallback: '',
          srcHighRes: '',
          title: this.offerDetail.title,
          titleSize: 16,
          text: '',
          scheme: 'dark',
          slideOptions: {},
          swipeToClose: true,
        },
        cssClass: ['ion-img-viewer'],
        keyboardClose: true,
        showBackdrop: true
      });
      modal.present();
    } else {
      console.log("No offer picture available and viewer modal not opening...");
    }
  }

  viewChefDetail() {
    if (this.currentAddress) {
      this.router.navigate([`/public/chef-detail/${this.offerDetail.chefId}`], { queryParams: { userAddress: this.currentAddress } });
    } else {
      console.error("Address not set, aborting to chef detail page");
    }
  }

  async onClickPurchaseOffer() {
    if (this.orders.length > 0) {
      this.toastController.create({
        animated: true,
        message: `Sorry, there is an order in your basket and multiple orders are not possible at a time for now.`,
        duration: 3000,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
      return;
    }

    const popover = await this.popoverController.create({
      component: DateTimePickerComponent,
      cssClass: 'date-time-picker-popover-class',
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data && data.pickupDate) {
      const pickupDate = dayjs(data.pickupDate.toISOString()).format('YYYY-MM-DD HH:mm');
      const offer = this.offerDetail;
      const amount = this.amount;
      const specialNote = null;
      const discountedTotal = amount * this.offerDetail.price;
      const nonDiscountedTotal = amount * this.offerDetail.price;
      const order: PublicOrder = {
        offer,
        amount,
        discountedTotal,
        nonDiscountedTotal,
        pickupDate,
        specialNote,
      }
      this.store.dispatch(new AddOrderToBasket(order));
    }
  }
}
