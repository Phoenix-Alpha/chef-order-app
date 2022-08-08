import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { ChefOfferActivePopoverComponent } from 'src/app/shared/chef-offer-active-popover-component/chef-offer-active-popover.component';
import { environment } from 'src/environments/environment';
import { InitializeChefOfferInfoDetailFromExisting, UpdateOffer } from '../+state/offer.actions';
import { getActiveOfferList } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { ChefUpdateOfferRequest, OfferDetail, OfferStatus } from '../offer';

@Component({
  selector: 'app-chef-offer-active-page',
  templateUrl: './chef-offer-active.page.html',
  styleUrls: ['./chef-offer-active.page.scss'],
})
export class ChefOfferActivePage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  activeOfferList$: Observable<OfferDetail[]>;
  activeOfferList: OfferDetail[];

  browserTimeZone: string;
  
  mode: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private toastController: ToastController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.queryParams.mode;

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

    this.activeOfferList$ = this.store.select(getActiveOfferList)
    this.activeOfferList$.subscribe(list => {
      this.activeOfferList = [ ...list ];
      console.log(this.activeOfferList);
    })
  }

  onClickOfferItem(offer: OfferDetail) {
    console.log("onClickOfferItem", offer, this.mode);
    if (this.mode == 'existing') {
      this.store.dispatch(new InitializeChefOfferInfoDetailFromExisting(offer.offerId));
      this.router.navigate(['/public/chef/offer/0']);
    }
  }

  async onClickOfferItemDropDownMenu(event, offer: OfferDetail) {
    console.log('onClickOfferItemDropDownMenu:', offer)
    const popover = await this.popoverController.create({
      component: ChefOfferActivePopoverComponent,
      cssClass: 'chef-offer-active-popover-class',
      event,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data?.mode == "ShowOffer") {
      console.log("show offer")
      this.router.navigate([`/public/chef/offer/${offer.offerId}`]);
    } else if (data?.mode == "ViewOrders") {
      console.log("view orders")
    } else if (data?.mode == "EditOffer") {
      console.log("edit offer")
      if (offer.quantityAvailable === offer.maxQuantity) {
        this.router.navigate([`/public/chef/offer/${offer.offerId}`]);
      } else {
        this.toastController.create({
          animated: true,
          message: "Cannot edit this offer as it already has orders.",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    } else if (data?.mode == "CancelOffer") {
      console.log("cancel offer")
      let request: ChefUpdateOfferRequest = {
        email: this.loggedInUser?.email,
        offerId: offer.offerId,
        status: OfferStatus.ARCHIVE,
      }
      this.store.dispatch(new UpdateOffer(request));
    }
    
  }
}