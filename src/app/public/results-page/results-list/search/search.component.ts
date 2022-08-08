import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PublicFetchChefSuggestionByName } from 'src/app/public/chef-detail/+state/public-chef.actions';
import { getPublicChefSuggestions } from 'src/app/public/chef-detail/+state/public-chef.selectors';
import { PublicChefSuggestionInfo } from 'src/app/public/chef-detail/chef';
import { PublicFetchOfferSuggestions } from 'src/app/public/offer/+state/offer.actions';
import { getOfferSuggestions, getTopOffers } from 'src/app/public/offer/+state/offer.selectors';
import { PublicOfferSuggestionInfo } from 'src/app/public/offer/offer';
import { UpdatePublicOfferSearchFilterState } from '../../+state/result.actions';
import { PublicOfferSearchFilterState } from '../../+state/result.reducer';
import { getFilterState } from '../../+state/result.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  
  public activeOption = 0;
  dishesOptions = ['Vegetarian','Tagine','Pastilla','Chiken Masala','Vegetarian','Tagine','Pastilla','Chiken Masala'];

  offerNameForm: FormGroup;
  chefNameForm: FormGroup;

  offers$: Observable<PublicOfferSuggestionInfo[]>;
  offers: PublicOfferSuggestionInfo[];

  topOffers$: Observable<PublicOfferSuggestionInfo[]>;
  topOffers: PublicOfferSuggestionInfo[];

  chefs$: Observable<PublicChefSuggestionInfo[]>;
  chefs: PublicChefSuggestionInfo[];

  offerKeyword = "title";
  chefKeyword = "chefProfileName";

  filterState$: Observable<PublicOfferSearchFilterState>;
  filterState: PublicOfferSearchFilterState;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    private store: Store<any>) { }

  ngOnInit() {
    this.offerNameForm = this.fb.group({
      offerName: [''],
    });

    this.chefNameForm = this.fb.group({
      chefName: [''],
    });

    this.offers$ = this.store.select(getOfferSuggestions);
    this.offers$.subscribe(s => {
      this.offers = [ ...s ];
    })

    this.topOffers$ = this.store.select(getTopOffers);
    this.topOffers$.subscribe(s => {
      this.topOffers = [ ...s ];
    })

    this.chefs$ = this.store.select(getPublicChefSuggestions);
    this.chefs$.subscribe(s => {
      this.chefs = [ ...s ];
    })

    this.filterState$ = this.store.select(getFilterState);
    this.filterState$.subscribe(state => {
      this.filterState = { ...state };
      console.log('filterState: ', this.filterState);
      this.offerName.setValue(this.filterState.offerName);
      this.chefName.setValue(this.filterState.chefName);
    });
  }

  get offerName() {
    return this.offerNameForm.get('offerName');
  }

  get chefName() {
    return this.chefNameForm.get('chefName');
  }

  changeActive(n: number) {
    this.activeOption = n;
  }

  
  offerSelectedEvent(item) {
    this.filterState.offerName = item.title;
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    this.router.navigate(['public/results']);
  }

  chefSelectedEvent(item) {
    this.filterState.chefName = item.chefProfileName;
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    this.router.navigate(['public/results']);
  }

  onChangeSearch(newSearchStr: string) {
    if (this.activeOption === 0) {
      this.filterState.offerName = newSearchStr;
      this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
      this.store.dispatch(new PublicFetchOfferSuggestions(newSearchStr))
    }

    if (this.activeOption === 1) {
      this.filterState.chefName = newSearchStr;
      this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
      this.store.dispatch(new PublicFetchChefSuggestionByName(newSearchStr))
    }
  }

  filterFunc(items, query) {
    console.log(items, query)
    return items;
  }

  onClickTopOffer(offer) {
    console.log(offer);
    this.filterState.offerName = offer.title;
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    this.router.navigate(['public/results']);
  }

  onInputCleared() {
    if (this.activeOption === 0) {
      this.filterState.offerName = '';
      this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    }

    if (this.activeOption === 1) {
      this.filterState.chefName = '';
      this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    }
  }
}
