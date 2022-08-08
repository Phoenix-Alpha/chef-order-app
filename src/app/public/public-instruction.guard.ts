import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { PublicState } from './+state/public.reducer';
import { getVisited } from './+state/public.selectors';

@Injectable({
  providedIn: 'root'
})
export class PublicInstructionGuard implements CanActivate {

  constructor(private store: Store<PublicState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.store.pipe(
      select(getVisited),
      map(visited => {
        if (visited) {
          this.router.navigate(['/public/home']);
        }
        return true;
      })
    );
  }
}