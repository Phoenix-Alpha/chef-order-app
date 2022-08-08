import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { InitializeChefOfferInfoDetailFromExisting } from '../+state/offer.actions';
import { getArchiveOfferList } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { OfferDetail } from '../offer';

@Component({
  selector: 'app-chef-offer-archive-page',
  templateUrl: './chef-offer-archive.page.html',
  styleUrls: ['./chef-offer-archive.page.scss'],
})
export class ChefOfferArchivePage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  archiveOfferList$: Observable<OfferDetail[]>;
  archiveOfferList: OfferDetail[];

  browserTimeZone: string;
  mode: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.queryParams.mode;
    console.log(this.activatedRoute.snapshot.queryParams)

    this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

    this.archiveOfferList$ = this.store.select(getArchiveOfferList)
    this.archiveOfferList$.subscribe(list => {
      this.archiveOfferList = [ ...list ];
      console.log(this.archiveOfferList);
    })
  }

  onClickOfferItem(offer: OfferDetail) {
    console.log("onClickOfferItem", offer, this.mode);
    if (this.mode == 'existing') {
      this.store.dispatch(new InitializeChefOfferInfoDetailFromExisting(offer.offerId));
      this.router.navigate(['/public/chef/offer/0']);
    }
  }
}