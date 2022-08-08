import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { OrderStatus } from 'src/app/public/checkout/checkout';
import { FetchInprepOrders } from '../+state/order.actions';

@Injectable({
  providedIn: 'root'
})
export class ChefOrderInPrepPageGuard implements CanActivate {

  constructor(private router: Router,
    private popoverController: PopoverController,
    private store: Store) { }

  canActivate() {
    this.store.dispatch(new FetchInprepOrders())
    return true;
  }

}