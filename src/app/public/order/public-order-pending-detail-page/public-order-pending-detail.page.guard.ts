import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FetchOrderDetail } from '../+state/order.actions';
import { PublicOrderState } from '../+state/order.reducer';

@Injectable({
  providedIn: 'root'
})
export class PublicOrderPendingDetailPageGuard implements CanActivate {

  constructor(private store: Store<PublicOrderState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    console.log(route.queryParams.orderUuid)
    if (route.queryParams.orderUuid) {
      this.store.dispatch(new FetchOrderDetail(route.queryParams.orderUuid));
    }
    return true;
  }
}