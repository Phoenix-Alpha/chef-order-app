import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FetchOrderDetail } from '../+state/order.actions';

@Injectable({
  providedIn: 'root'
})
export class PublicOrderDeliveredDetailPageGuard implements CanActivate {

  constructor(private store: Store<any>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.orderUuid) {
      this.store.dispatch(new FetchOrderDetail(route.queryParams.orderUuid));
    }
    return true;
  }
}