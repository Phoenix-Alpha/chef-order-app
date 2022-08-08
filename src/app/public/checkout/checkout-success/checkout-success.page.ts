import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { InitializeBasket, UpdateCheckoutBasketStatus } from '../+state/checkout.actions';
import { BasketStatus } from '../+state/checkout.reducer';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.page.html',
  styleUrls: ['./checkout-success.page.scss'],
})
export class CheckoutSuccessPage implements OnInit {

  orderNumber: string = "";

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router) { 
    this.orderNumber = this.activatedRoute.snapshot.queryParams.orderNumber;
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.store.dispatch(new UpdateCheckoutBasketStatus(BasketStatus.PAYMENTCOMPLETE));
    this.store.dispatch(new InitializeBasket());
  }

  onTap() {
    this.router.navigate(['/public/results']);
  }

}
