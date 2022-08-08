import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PublicOfferInfo, PublicOfferSearchFilterState } from '../+state/result.reducer';
import { getFilterState } from '../+state/result.selectors';
import { PublicChefDetail } from '../../chef-detail/chef';
import { getFavouriteChefs, getFavouriteOffers } from './+state/favourite.selectors';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.page.html',
  styleUrls: ['./favourite.page.scss'],
})
export class FavouritePage implements OnInit {
  public activeOption = 0;

  offers$: Observable<PublicOfferInfo[]>;
  offers: PublicOfferInfo[];

  chefs$: Observable<PublicChefDetail[]>;
  chefs: PublicChefDetail[];

  filterState$: Observable<PublicOfferSearchFilterState>;
  filterState: PublicOfferSearchFilterState;


  constructor(private store: Store<any>,
    private router: Router) { }

  ngOnInit() {
    this.offers$ = this.store.select(getFavouriteOffers);
    this.offers$.subscribe(o => {
      this.offers = [ ...o ];
    });

    this.chefs$ = this.store.select(getFavouriteChefs);
    this.chefs$.subscribe(c => {
      this.chefs = [ ...c ];
    })

    this.filterState$ = this.store.select(getFilterState);
    this.filterState$.subscribe(f => {
      this.filterState = { ...f };
    })
  }

  changeActive(n: number) {
    this.activeOption = n;
  }

  onClickOfferItem(offer: PublicOfferInfo) {
    if (this.filterState.userAddress) {
      this.router.navigate([`/public/offer/${offer.offerId}`], { queryParams: { userAddress: this.filterState.userAddress } });
    } else {
      console.error("Address not set, aborting to offer detail page");
    }
  }

  onClickChefItem(chef: PublicChefDetail) {
    if (this.filterState.userAddress) {
      this.router.navigate([`/public/chef-detail/${chef.id}`], { queryParams: { userAddress: this.filterState.userAddress } });
    } else {
      console.error("Address not set, aborting to chef detail page");
    }
  }
}
