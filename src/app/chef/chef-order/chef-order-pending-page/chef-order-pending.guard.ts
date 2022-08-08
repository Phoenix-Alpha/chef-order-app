import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { OrderStatus } from 'src/app/public/checkout/checkout';
import { FetchPendingOrders } from '../+state/order.actions';

@Injectable({
  providedIn: 'root'
})
export class ChefOrderPendingPageGuard implements CanActivate {

  constructor(private router: Router,
    private popoverController: PopoverController,
    private store: Store) { }

  canActivate() {
    this.store.dispatch(new FetchPendingOrders())
    return true;
  }

}