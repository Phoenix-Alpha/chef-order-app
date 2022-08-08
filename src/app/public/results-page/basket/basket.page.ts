import { ReduceOrderAmount, IncrementOrderAmount, UpdateTotal, UpdateSpecialNote } from './../../checkout/+state/checkout.actions';
import { Observable } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import { getOrders } from '../../checkout/+state/checkout.selectors';
import { PublicOrder, BasketInfo } from '../../checkout/+state/checkout.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { distinct, take } from 'rxjs/operators';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {
  subTotal = 0;
  delivery = 0;
  total = 0;
  orders$: Observable<PublicOrder[]>;
  orders: PublicOrder[];
  info: BasketInfo;

  constructor(
    private store: Store<any>,
    private router: Router,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    // this.orders$ = this.store.select(getOrders);
    // this.orders$.subscribe(o => {
    //   this.orders = [ ...o ];
    //   let subTotal = 0;
    //   let delivery = 0;
    //   o.forEach((order) => {
    //     subTotal += order.offer.price * order.amount;
    //     delivery += order.offer.deliveryCost;
    //   });
    //   this.subTotal = subTotal;
    //   this.delivery = delivery;
    //   this.total = subTotal + delivery;
    // });
  }

  ionViewWillEnter() {
    this.orders$ = this.store.select(getOrders);
    this.orders$.pipe(take(1)).subscribe(o => {
      this.orders = [ ...o ];
      let subTotal = 0;
      let delivery = 0;
      o.forEach((order) => {
        subTotal += order.offer.price * order.amount;
        delivery += order.offer.deliveryCost;
      });
      this.subTotal = subTotal;
      this.delivery = delivery;
      this.total = subTotal + delivery;
    });
  }

  reduceOrderAmount(order) {
    const offerId = order.offer.offerId;
    this.store.dispatch(new ReduceOrderAmount(offerId));
  }

  incrementOrderAmount(order) {
    const offerId = order.offer.offerId;
    this.store.dispatch(new IncrementOrderAmount(offerId));
  }

  onSepcialNoteChange(order, event) {
    const offerId = order.offer.offerId;
    this.store.dispatch(new UpdateSpecialNote(offerId, event.target.value))
  }

  async checkout() {
    if (this.orders && this.orders.length > 0) {
      const total = this.total;
      this.store.dispatch(new UpdateTotal(total));
      this.router.navigate(['/public/checkout']);
    } else {
      const toast = await this.toastController.create({
        animated: true,
        message: "Please add an item to the basket",
        duration: 1000,
        position: "middle",
      });
      toast.present();
    }
  }
}
