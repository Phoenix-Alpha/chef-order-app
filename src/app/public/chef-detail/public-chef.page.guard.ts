import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { PublicFetchChefDetail } from './+state/public-chef.actions';

@Injectable({
  providedIn: 'root'
})
export class PublicChefPageGuard implements CanActivate {

  constructor(private store: Store<any>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.params.chefId) {
      const chefId = parseInt(route.params.chefId);
      const userAddress = route.queryParams.userAddress;
      console.error(chefId, userAddress)
      if (chefId > 0 && userAddress) {
        this.store.dispatch(new PublicFetchChefDetail(chefId, userAddress));
        this.router.navigate(['public/chef-detail/tabs/about'])
        return true;
      }
    }
    this.router.navigate(['public/home']);
    return true;
  }
}