import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UpdateCheckoutBasketStatus } from '../+state/checkout.actions';
import { BasketStatus } from '../+state/checkout.reducer';

@Component({
  selector: 'app-checkout-failure',
  templateUrl: './checkout-failure.page.html',
  styleUrls: ['./checkout-failure.page.scss'],
})
export class CheckoutFailurePage implements OnInit {

  constructor(private router: Router,
    private store: Store) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.store.dispatch(new UpdateCheckoutBasketStatus(BasketStatus.PAYMENTFAILED));
  }

  onTap() {
    this.router.navigate(['/public/results']);
  }

}
