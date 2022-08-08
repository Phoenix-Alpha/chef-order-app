import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { catchError, map, tap } from 'rxjs/operators';
import { FetchWalletInfo, FetchWalletInfoFailed, UpdateWalletInfo } from './+state/wallet.action';
import { ChefService } from '../chef.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChefWalletPageGuard implements CanActivate {

  constructor(private router: Router,
    private store: Store,
    private chefService: ChefService) { }
  
  canActivate(route: ActivatedRouteSnapshot) {
    return this.chefService.getWalletInfo().pipe(
        tap(t => {
            this.store.dispatch(new UpdateWalletInfo(t));
        }),
        map(t => true),
        catchError(err => {
            this.store.dispatch(new FetchWalletInfoFailed());
            return of(true);
        })
    );
  }
}