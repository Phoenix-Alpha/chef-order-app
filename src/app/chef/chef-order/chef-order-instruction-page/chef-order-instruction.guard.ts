import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { getChefOrderInstructionVisited } from '../../+state/chef.selectors';

@Injectable({
  providedIn: 'root'
})
export class ChefOrderInstructionGuard implements CanActivate {

  constructor(private store: Store<any>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams['mode'] && route.queryParams['mode'] == "view-info") {
      return true;
    }
    return this.store.pipe(
      select(getChefOrderInstructionVisited),
      map(visited => {
        if (visited) {
          this.router.navigate(['/public/chef/order/list']);
        }
        return true;
      })
    );
  }
}