import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OfferType } from 'src/app/chef/chef-offer/offer';
import { UpdatePublicOfferSearchFilterState } from '../+state/result.actions';
import { PublicOfferSearchFilterState } from '../+state/result.reducer';
import { getFilterState } from '../+state/result.selectors';
import { OfferSortMode, ResultSortModes } from '../results';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  orderOptions = [
    {
      id: 'ALL',
      label: 'All',
      value: null,
    },
    {
      id: OfferType.PREORDER,
      label: 'Pre-order',
      value: OfferType.PREORDER,
    },
    {
      id: OfferType.ONDEMAND,
      label: 'On-demand',
      value: OfferType.ONDEMAND,
    }
  ];

  deliveryOptions = [
    {
      id: 'ALL',
      label: 'All',
      value: {
        isDelivery: null,
        isPickup: null,
      }
    },
    { 
      id: 'PICKUP',
      label: 'Pick-up',
      value: {
        isDelivery: false,
        isPickup: true,
      }
    },
    {
      id: 'DELIVERY',
      label: 'Delivery',
      value: {
        isDelivery: true,
        isPickup: false,
      }
    }
  ];

  applyResetBtnTitle = 'Reset';
  
  public today = new Date().toISOString();

  resultSortModes = [ ...ResultSortModes ];

  filterForm: FormGroup;

  filterState$: Observable<PublicOfferSearchFilterState>;
  filterState: PublicOfferSearchFilterState;

  activeOfferTypeItem = this.orderOptions[0];
  activeDeliveryMethodItem = this.deliveryOptions[0];

  constructor(private fb: FormBuilder,
    private store: Store<any>,
    private router: Router) {
    
  }

  ngOnInit() {

    this.filterForm = this.fb.group({
      sortMode: [OfferSortMode.BESTMATCH],
      distance: [30],
      servingDate: ['', Validators.compose([ Validators.required ])],
    });

    this.filterState$ = this.store.select(getFilterState);
    this.filterState$.subscribe(state => {
      this.filterState = { ...state };
      console.log('filterState: ', this.filterState);
      this.sortMode.setValue(this.filterState.sortMode, { emitEvent: false });
      this.distance.setValue(this.filterState.distance, { emitEvent: false });
      this.servingDate.setValue(this.filterState.servingDate, { emitEvent: false });
      if (this.filterState.offerType) {
        this.activeOfferTypeItem = this.orderOptions.find(item => item.id == this.filterState.offerType);
      } else {
        this.activeOfferTypeItem = this.orderOptions[0];
      }
      this.activeDeliveryMethodItem = this.deliveryOptions.find(item => {
        return (item.value.isDelivery == this.filterState.isDelivery && item.value.isPickup == this.filterState.isPickup);
      });
    });

    this.sortMode.valueChanges.subscribe(s => {
      this.filterState.sortMode = s;
      this.updateApplyResetBtn();
    })

    this.distance.valueChanges.subscribe(newDistance => {
      this.filterState.distance = newDistance;
      this.updateApplyResetBtn();
    });

    this.servingDate.valueChanges.subscribe(newValue => {
      const newServingDate = new Date(newValue);
      this.filterState.servingDate = newServingDate.toISOString();
      this.updateApplyResetBtn();
      console.log("servingDate: ", this.filterState.servingDate);
    })

  }

  getNow() {
    return this.today;
  }

  chefRatingChanged(newRating) {
    this.filterState.chefRating = newRating;
    this.updateApplyResetBtn();
  }

  offerTypeFilterChanged(item) {
    this.filterState.offerType = item.value;
    this.activeOfferTypeItem = { ...item };
    this.updateApplyResetBtn();
  }

  deliveryMethodFilterChanged(item) {
    this.filterState.isDelivery = item.value.isDelivery;
    this.filterState.isPickup = item.value.isPickup;
    this.activeDeliveryMethodItem = { ...item };
    this.updateApplyResetBtn();
  }

  onRemoveServingDateFilter() {
    this.servingDate.setValue(null);
    this.filterState.servingDate = null;
    this.updateApplyResetBtn();
  }

  get sortMode() {
    return this.filterForm.get('sortMode');
  }

  get distance() {
    return this.filterForm.get('distance');
  }

  get servingDate() {
    return this.filterForm.get('servingDate');
  }

  ionViewDidEnter() {
    if (!this.isDefault()) {
      this.applyResetBtnTitle = 'Reset';
    }
  }

  onApplyFilter() {
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    this.router.navigate(['public/results']);
  }

  updateApplyResetBtn() {
    if (!this.isDefault()) {
      this.applyResetBtnTitle = 'Apply';
    }
  }

  onResetFilter() {
    this.filterState.sortMode = OfferSortMode.BESTMATCH;
    this.filterState.chefRating = 0.0;
    this.filterState.offerType = null;
    this.filterState.servingDate = null;
    this.filterState.isDelivery = null;
    this.filterState.isPickup = null;
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    this.router.navigate(['public/results']);
  }

  isDefault() {
    return (this.filterState.chefRating === 0.0 
      && this.filterState.distance === 30 
      && this.filterState.isDelivery == null 
      && this.filterState.isPickup == null
      && this.filterState.offerType == null
      && this.filterState.servingDate == null
      && this.filterState.sortMode === OfferSortMode.BESTMATCH);
  }

  shouldDisplayApplyResetBtn() {
    return !this.isDefault();
  }

  onClickApplyResetBtn() {
    if (this.applyResetBtnTitle === 'Apply') {
      this.onApplyFilter();
    } else if (this.applyResetBtnTitle === 'Reset') {
      this.onResetFilter();
    }
  }
}
