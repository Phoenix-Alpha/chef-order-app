import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { getLoggedInUser } from '../auth/+state/auth.selectors';
import { LoggedInUser } from '../auth/auth';
import { ChefPromoteGuardPopoverComponent } from '../shared/chef-promote-guard-popover-component/chef-promote-guard-popover.component';

@Injectable({
  providedIn: 'root'
})
export class ChefInstructionPageGuard implements CanActivate {

  constructor(private router: Router,
    private popoverController: PopoverController,
    private store: Store) { }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.store.select(getLoggedInUser).pipe(
      map(user => {
        if (this.checkRequiredInformationToBecomeChef(user)) {
          return true;
        } else {
          // this.router.navigate(['/public/account/personal-details']);
          const popover = this.popoverController.create({
            component: ChefPromoteGuardPopoverComponent,
            cssClass: 'chef-promote-guard-popover-class',
          }).then(el => {
            el.present();
          })
          return false;
        }
      })
    );
  }

  checkRequiredInformationToBecomeChef(user: LoggedInUser) {
    return (user.address && user.city && user.postCode && user.birthdate && user.email && user.phoneCode && user.phoneNumber);
  }
}