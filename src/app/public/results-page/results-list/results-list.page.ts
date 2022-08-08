import { PublicOrder } from './../../checkout/+state/checkout.reducer';
import { Offer } from './../../../chef/chef-offer/+state/offer.reducer';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Platform, PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OfferType } from 'src/app/chef/chef-offer/offer';
import { DateTimePickerComponent } from 'src/app/shared/date-time-picker/date-time-picker.component';
import { SearchOffers, UpdatePublicOfferSearchFilterState } from '../+state/result.actions';
import { PublicOfferInfo, PublicOfferSearchFilterState } from '../+state/result.reducer';
import { getFilterState, getOffers } from '../+state/result.selectors';
import { AddOrderToBasket } from '../../checkout/+state/checkout.actions';
// import { ResultsService } from '../../../shared/services/results.service';
import { ResultsService } from '../results.service';
import * as dayjs from 'dayjs';
import { getOrders } from '../../checkout/+state/checkout.selectors';

declare var google;

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.page.html',
  styleUrls: ['./results-list.page.scss'],
})
export class ResultsListPage implements OnInit {

  @ViewChild('searchBar') searchBar: ElementRef;
  hideShowButton: boolean = false;

  public activeButton = 0;

  orders$: Observable<PublicOrder[]>;
  orders: PublicOrder[];

  offers$: Observable<PublicOfferInfo[]>;
  offers: PublicOfferInfo[];

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];

  currentAddress: string = "";
  locationPermissionAllowed: boolean = true;

  filterState$: Observable<PublicOfferSearchFilterState>;
  filterState: PublicOfferSearchFilterState;

  searchBarForm: FormGroup;
  
  lang: string;

  constructor(private fb: FormBuilder,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    protected platform: Platform,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private zone: NgZone,
    public resultsService: ResultsService,
    public translateService: TranslateService,
    private router: Router,
    private store: Store<any>) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {

    this.offers$ = this.store.select(getOffers);
    this.offers$.subscribe(  s => {
      this.offers = [ ...s ];
    })

    this.searchBarForm = this.fb.group({
      address: ['', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(256) ])],
    });

    this.filterState$ = this.store.select(getFilterState);
    this.filterState$.subscribe(s => {
      this.filterState = { ...s };
      if (this.filterState.userAddress) {
        this.currentAddress = this.filterState.userAddress;
        this.address.setValue(this.filterState.userAddress, { emitEvent: false });
      }
    })

    this.address.valueChanges.subscribe(newAddress => {
      if (newAddress) {
        this.currentAddress = newAddress;
        this.filterState.userAddress = newAddress;
        this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
        this.store.dispatch(new SearchOffers());
      }
    })

    this.orders$ = this.store.select(getOrders);
    this.orders$.subscribe(o => {
      this.orders = [ ...o ];
    })

    this.lang = this.translateService.currentLang;

  }

  ionViewWillEnter() {
    this.store.dispatch(new SearchOffers());
    // this.onClickMyLocation();
    if (!this.filterState.userAddress) {
      this.onClickMyLocation();
    }

    if (this.filterState.offerType == null) {
      this.activeButton = 0;
    } else if (this.filterState.offerType == OfferType.PREORDER) {
      this.activeButton = 1;
    } else if (this.filterState.offerType == OfferType.ONDEMAND) {
      this.activeButton = 2;
    }
  }

  changeActiveButton(n: number) {
    if (n === 0) {
      this.filterState.offerType = null;
    } else if (n === 1) {
      this.filterState.offerType = OfferType.PREORDER;
    } else if (n === 2) {
      this.filterState.offerType = OfferType.ONDEMAND;
    }
    this.activeButton = n;
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    this.store.dispatch(new SearchOffers());
  }

  loadData(ev) {
    // this.resultsSrv.getMoreResults(ev);
  }

  toggleShowSearch() {
    this.router.navigate(['/public/results/tabs/results-list/search'])
  }

  prefillAddressSearchBar(value: NativeGeocoderResult) {
    if (value) {
      let addressStr = value.countryName;
      addressStr = value.administrativeArea ? (value.administrativeArea + ", " + addressStr) : addressStr;
      addressStr = value.postalCode ? (value.postalCode + " " + addressStr) : addressStr;
      addressStr = value.subAdministrativeArea ? (value.subAdministrativeArea + ", " + addressStr) : addressStr;
      addressStr = value.locality ? (value.locality + ", " + addressStr) : addressStr;
      addressStr = value.subLocality ? (value.subLocality + ", " + addressStr) : addressStr;
      addressStr = value.thoroughfare ? (value.thoroughfare + ", " + addressStr) : addressStr;
      addressStr = value.subThoroughfare ? (value.subThoroughfare + " " + addressStr) : addressStr;
      this.currentAddress = addressStr;
      this.address.setValue(addressStr);
      this.filterState.userAddress = addressStr;
      this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    }
  }

  updateSearchResults(){
    this.autocomplete.input = this.address.value;

    this.filterState.userAddress = this.address.value;
    this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input }, (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if (predictions && status == "OK") {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        }
      });
    });
  }

  showAddressSearchPopover() {
    // hides 'Show' button on focus
    if (!this.hideShowButton) {
      this.hideShowButton = true;
      console.log(this.searchBar)
      this.address.setValue('', { emitEvent: false });
      if (!this.searchBar.nativeElement.classList.contains('address-search-popover')) {
        this.searchBar.nativeElement.classList.add('address-search-popover');
      }
    }
  }

  hideAddressSearchPopover() {
    this.hideShowButton = false;
    if (this.searchBar.nativeElement.classList.contains('address-search-popover')) {
      this.searchBar.nativeElement.classList.remove('address-search-popover');
    }

    if (!this.address.value && this.currentAddress) {
      this.address.setValue(this.currentAddress, { emitEvent: false });
    }
  }

  onSearchInputFocus() {
    this.updateSearchResults();
    this.showAddressSearchPopover();
  }

  onSearchInputFocusBlur() {

  }

  onClickPrediction(prediction) {
    if (prediction) {
      this.address.setValue(prediction.description);
      this.filterState.userAddress = prediction.description;
      this.store.dispatch(new UpdatePublicOfferSearchFilterState(this.filterState));
    }
  }

  onClickMyLocation() {
    this.platform.ready().then(() => {
      const subscription = this.geolocation.watchPosition().pipe(
        take(1)
      ).subscribe(position => {
        if ("coords" in position) {
          this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude, this.options)
          .then((result: NativeGeocoderResult[]) => {
            this.prefillAddressSearchBar(result[0]);
            if (this.currentAddress) {
              this.address.setValue(this.currentAddress);
            }
          }).catch((error: any) => console.log(error));
        } else {
          console.error("position error: ", position);
        }
      });
    });
  }

  onTapBackdrop() {
    this.hideAddressSearchPopover();
  }

  get address() {
    return this.searchBarForm.get('address');
  }

  get OfferType(): typeof OfferType {
    return OfferType;
  }

  async onClickPurchaseOffer(offer: PublicOfferInfo) {
    if (this.orders.length > 0) {
      this.toastController.create({
        animated: true,
        message: `Sorry, there is an order in your basket and multiple orders are not possible at a time for now.`,
        duration: 3000,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
      return;
    }

    const popover = await this.popoverController.create({
      component: DateTimePickerComponent,
      cssClass: 'date-time-picker-popover-class',
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      const order: PublicOrder = {
        offer: offer,
        amount: 1,
        discountedTotal: 1 * offer.price,
        nonDiscountedTotal: 1 * offer.price,
        pickupDate: data.pickupDate.toISOString(),
        specialNote: '',
      }
      this.store.dispatch(new AddOrderToBasket(order));
    }
  }

  onClickOfferDetail(offer: PublicOfferInfo) {
    console.log("onClickOfferDetail", offer);
    if (this.currentAddress) {
      this.router.navigate([`/public/offer/${offer.offerId}`], { queryParams: { userAddress: this.currentAddress } });
    } else {
      console.error("Address not set, aborting to offer detail page");
    }
  }

  onClickOfferChef(offer: PublicOfferInfo) {
    console.log("onClickOfferChef", offer)
    if (this.currentAddress) {
      this.router.navigate([`/public/chef-detail/${offer.chefId}`], { queryParams: { userAddress: this.currentAddress } });
    } else {
      console.error("Address not set, aborting to chef detail page");
    }
  }
}
