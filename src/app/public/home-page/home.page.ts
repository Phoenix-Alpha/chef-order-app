import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ToastController, Platform, PopoverController, IonButton } from '@ionic/angular';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { CognitoUtil } from 'src/app/auth/cognito.service';
import { Observable, Subject } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { filter, take, takeUntil } from 'rxjs/operators';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AccessTokenData, IdTokenData, LoggedInUser, UserRole } from '../../auth/auth';
import { Store } from '@ngrx/store';
import { LanguagePopoverComponent } from 'src/app/shared/language-popover-component/language-popover.component';
import { TranslateService } from '@ngx-translate/core';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { Logout, ResetCognitoTokens } from 'src/app/auth/+state/auth.actions';
import { ChefDetail } from 'src/app/chef/chef';
import { getChefDetail } from 'src/app/chef/+state/chef.selectors';
import { PublicOfferSearchFilterState } from '../results-page/+state/result.reducer';
import { getFilterState } from '../results-page/+state/result.selectors';
import { UpdatePublicOfferSearchFilterState } from '../results-page/+state/result.actions';

declare var google;

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  @ViewChild('slides', {static: true}) slides: IonSlides;
  @ViewChild('searchBar', {static: true}) searchBar: ElementRef;
  @ViewChild('languageBtn', {static: true}) languageBtn: any;
  
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  slidesLen: number = 0;

  session$: Observable<CognitoUserSession>;
  session: CognitoUserSession;

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  isAuthenticated$: Observable<boolean>;

  private destroy$ = new Subject();

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];

  searchBarForm: FormGroup;

  hideShowButton: boolean = false;

  currentAddress: string = "";
  locationPermissionAllowed: boolean = true;

  languages = {
    'en': 'global.language.english',
    'fr': 'global.language.french',
    'nl': 'global.language.dutch',
    'de': 'global.language.german',
  };

  currentLanguage: string = this.languages['fr'];

  filterState$: Observable<PublicOfferSearchFilterState>;
  filterState: PublicOfferSearchFilterState;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected platform: Platform,
    private cognitoUtil: CognitoUtil,
    private cognitoAuthService: CognitoAuthService,
    private zone: NgZone,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private popoverController: PopoverController,
    public translateService: TranslateService,
    private store: Store<any>) { 
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }

  ngOnInit() {
    this.searchBarForm = this.fb.group({
      address: ['', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(256) ])],
    });

    this.slides.length().then(len => this.slidesLen = len);
    this.session$ = this.cognitoAuthService.getSession();
    this.session$.subscribe(s => {
      this.session = s;
    })

    this.isAuthenticated$ = this.cognitoAuthService.isAuthenticatedObservable();
    
    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.subscribe(user => {
      if (user.id > 0) {
        this.loggedInUser = { ...user };
        console.log('user: ', this.loggedInUser);
        this.currentLanguage = this.languages[this.loggedInUser.preferredLanguage.locale];
      } else {
        this.loggedInUser = null;
        this.currentLanguage = this.languages['fr'];
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

    this.translateService.onLangChange.subscribe(event => {
      this.currentLanguage = this.languages[event.lang ? event.lang : 'fr'];
    });

    this.filterState$ = this.store.select(getFilterState);
    this.filterState$.subscribe(state => {
      this.filterState = { ...state };
      if (this.filterState.userAddress) {
        this.currentAddress = this.filterState.userAddress;
        this.address.setValue(this.filterState.userAddress, { emitEvent: false });
      }
    });

  }

  ionViewWillEnter() {
    // this.onClickMyLocation();
    if (!this.filterState.userAddress) {
      this.onClickMyLocation();
    }
  }

  onClickLeftArrow() {
    this.slides.isBeginning().then(val => {
      if (val) {
        this.slides.slideTo(this.slidesLen - 1)
      } else {
        this.slides.slidePrev();
      }
    })
  }

  onClickRightArrow() {
    this.slides.isEnd().then(val => {
      if (val) {
        this.slides.slideTo(0)
      } else {
        this.slides.slideNext();
      }
    })
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

  get address() {
    return this.searchBarForm.get('address');
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
      this.address.setValue("");
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

  async onClickLanguageButton(event) {
    console.log(event)
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      cssClass: 'language-popover-class',
      event,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data?.lang) {
      this.translateService.use(data.lang);
    }
  }

  onClickMenuLanguageButton($event) {
    if (this.languageBtn.el) {
      this.languageBtn.el.click();
    }
  }
}
