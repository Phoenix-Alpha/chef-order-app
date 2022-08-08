import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { FetchWalletInfo } from './+state/wallet.action';
import { ChefService } from '../chef.service';

@Injectable({
  providedIn: 'root'
})
export class ChefWalletReturnGuard implements CanActivate {

  constructor(private router: Router,
    private store: Store,
    private chefService: ChefService) { }
  
  canActivate(route: ActivatedRouteSnapshot) {
    this.store.dispatch(new FetchWalletInfo());
    this.router.navigate(['/public/chef/wallet']);
    return true;
  }
}