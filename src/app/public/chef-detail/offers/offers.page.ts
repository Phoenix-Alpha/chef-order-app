import { DateTimePickerComponent } from './../../../shared/date-time-picker/date-time-picker.component';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OfferType } from 'src/app/chef/chef-offer/offer';
import { getPublicChefDetail } from '../+state/public-chef.selectors';
import { PublicChefDetail } from '../chef';
import { AddOrderToBasket } from '../../checkout/+state/checkout.actions';
import * as dayjs from 'dayjs';
import { PublicOfferInfo } from '../../results-page/+state/result.reducer';
import { PublicOrder } from '../../checkout/+state/checkout.reducer';
import { PopoverController, ToastController } from '@ionic/angular';
import { getOrders } from '../../checkout/+state/checkout.selectors';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  chefDetail$: Observable<PublicChefDetail>;
  chefDetail: PublicChefDetail;

  orders$: Observable<PublicOrder[]>;
  orders: PublicOrder[];

  constructor(private store: Store<any>,
    private popoverController: PopoverController,
    private toastController: ToastController,
    ) { }

  ngOnInit() {
    this.chefDetail$ = this.store.select(getPublicChefDetail);
    this.chefDetail$.subscribe(detail => {
      this.chefDetail = { ...detail };
    })

    this.orders$ = this.store.select(getOrders);
    this.orders$.subscribe(o => {
      this.orders = [ ...o ];
    });
  }

  loadData($event: CustomEvent) {

  }

  get OfferType(): typeof OfferType {
    return OfferType;
  }

  async onClickPurchaseOffer(offer: PublicOfferInfo) {
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

    console.log('onClickPurchaseOffer', offer);
    const popover = await this.popoverController.create({
      component: DateTimePickerComponent,
      cssClass: 'date-time-picker-popover-class',
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data && data.pickupDate) {
      const pickupDate = dayjs(data.pickupDate.toISOString()).format('YYYY-MM-DD HH:mm');
      const amount = 1;
      const specialNote = null;
      const discountedTotal = amount * offer.price;
      const nonDiscountedTotal = amount * offer.price;
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
