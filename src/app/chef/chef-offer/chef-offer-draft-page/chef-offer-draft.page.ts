import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { ChefOfferDraftPopoverComponent } from 'src/app/shared/chef-offer-draft-popover-component/chef-offer-draft-popover.component';
import { environment } from 'src/environments/environment';
import { UpdateOffer } from '../+state/offer.actions';
import { getDraftOfferList } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefUpdateOfferRequest, OfferDetail, OfferStatus } from '../offer';

@Component({
  selector: 'app-chef-offer-draft-page',
  templateUrl: './chef-offer-draft.page.html',
  styleUrls: ['./chef-offer-draft.page.scss'],
})
export class ChefOfferDraftPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  draftOfferList$: Observable<OfferDetail[]>;
  draftOfferList: OfferDetail[];

  browserTimeZone: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() {
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

    this.draftOfferList$ = this.store.select(getDraftOfferList)
    this.draftOfferList$.subscribe(list => {
      this.draftOfferList = [ ...list ];
      console.log(this.draftOfferList);
    })
  }

  onClickOfferItem(offer: OfferDetail) {
    // console.log("onClickOfferItem", offer);
  }

  async onClickOfferItemDropDownMenu(event, offer: OfferDetail) {
    console.log("onClickOfferItemDropDownMenu", offer)
    const popover = await this.popoverController.create({
      component: ChefOfferDraftPopoverComponent,
      cssClass: 'chef-offer-draft-popover-class',
      event,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data?.mode == "EditOffer") {
      console.log("edit offer")
      this.router.navigate([`/public/chef/offer/${offer.offerId}`]);
    } else if (data?.mode == "DeleteOffer") {
      let request: ChefUpdateOfferRequest = {
        email: this.loggedInUser?.email,
        offerId: offer.offerId,
        status: OfferStatus.ARCHIVE,
      }
      this.store.dispatch(new UpdateOffer(request));
      console.log("delete offer");
    }
  }
}