import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { InitializeChefOfferInfoDetail } from '../+state/offer.actions';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';

@Component({
  selector: 'app-new-offer-mode-page',
  templateUrl: './new-offer-mode.page.html',
  styleUrls: ['./new-offer-mode.page.scss'],
})
export class NewOfferModePage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() {

    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.subscribe(user => {
      if (user.id > 0) {
        this.loggedInUser = { ...user };
      } else {
        this.loggedInUser = null;
      }
    });

    this.chefDetail$ = this.store.select(getChefDetail);
    this.chefDetail$.subscribe(chef => {
      if (chef.id > 0) {
        this.chefDetail = { ...chef };
        console.log('user: ', this.loggedInUser);
      } else {
        this.chefDetail = null;
      }
    })
  }

  onClickStartFromScratch() {
    // this.router.navigate(["/public/chef/offer/0"], { queryParams: { mode: "scratch" } });
    this.store.dispatch(new InitializeChefOfferInfoDetail());
    this.router.navigate(["/public/chef/offer/0"]);
  }

  onClickStartBasedOnExistingOffer() {
    this.router.navigate(["/public/chef/offer/list"], { queryParams: { mode: "existing" }, queryParamsHandling: 'merge' });
  }

}