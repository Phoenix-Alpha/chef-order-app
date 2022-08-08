import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FetchOrderDetail } from '../+state/order.actions';
import { OrderState } from '../+state/order.reducer';

@Injectable({
  providedIn: 'root'
})
export class ChefOrderInprepDetailPageGuard implements CanActivate {

  constructor(private store: Store<OrderState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.orderUuid) {
      this.store.dispatch(new FetchOrderDetail(route.queryParams.orderUuid));
    }
    return true;
  }
}