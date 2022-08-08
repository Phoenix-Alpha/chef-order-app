import { Component, OnInit, ViewChild, NgZone, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UpdateUserDetailBoth } from 'src/app/auth/+state/auth.actions';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { CognitoTokens, LoggedInUser, UpdateUserDetailRequest } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { CognitoUtil } from 'src/app/auth/cognito.service';
import { IonIntlTelInputValidators } from 'src/app/ion-intl-tel-input/ion-intl-tel-input.directive';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { environment } from 'src/environments/environment';
import { countries } from 'src/app/ion-intl-tel-input/data/countries';
import { CountryI } from 'src/app/ion-intl-tel-input/models/country.model';
import { IonicSelectableComponent } from 'ionic-selectable';

declare var google;

@Component({
  selector: 'app-personal-details-page',
  templateUrl: './personal-details.page.html',
  styleUrls: ['./personal-details.page.scss'],
})
export class PersonalDetailsPage implements OnInit, AfterViewInit {

  // @ViewChild('address') addressInput: ElementRef;
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  personalInformationEditEnabled: boolean = false;
  addressEditEnabled: boolean = false;
  
  personalDetailsForm: FormGroup;

  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];

  currentAddress: string = "";

  preferredCountries = [
    "fr",
    "de",
    "nl",
  ]

  validation_messages = {
    'firstName': [
      { type: 'required', message: 'validation.firstName.required' },
      { type: 'minlength', message: 'validation.firstName.minLength' },
      { type: 'maxlength', message: 'validation.firstName.maxLength' },
    ],
    'lastName': [
      { type: 'required', message: 'validation.lastName.required' },
      { type: 'minlength', message: 'validation.lastName.minLength' },
      { type: 'maxlength', message: 'validation.lastName.maxLength' },
    ],
    'birthdate': [
      { type: 'required', message: 'validation.lastName.required' },
    ],
    'phoneCountryCode': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'phoneNumber': [
      { type: 'required', message: 'validation.global.required' },
      // { type: 'phone', message: 'validation.phoneNumber.invalid' },
    ],
    'email': [
      { type: 'required', message: 'validation.email.required' },
      { type: 'email', message: 'validation.email.notValid' },
    ],
    'password': [
      { type: 'required', message: 'validation.password.required' },
      { type: 'minlength', message: 'validation.password.minLength' },
      { type: 'maxlength', message: 'validation.password.maxLength' },
      { type: 'passwordNumber', message: 'validation.password.containNumber' },
      { type: 'passwordSpecial', message: 'validation.password.containSpecial' },
      { type: 'passwordUppercase', message: 'validation.password.containUppercase' },
      { type: 'passwordLowercase', message: 'validation.password.containLowercase' },
    ],
    'address': [
    ],
    'postCode': [
    ],
    'city': [
    ],
    'country': [
    ],
  }

  phoneCountryCodes: CountryI[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private zone: NgZone,
    private cognitoUtil: CognitoUtil,
    private store: Store<any>) {

      this.phoneCountryCodes = [ ...countries ];
      this.setPreferredCountries();

      this.autocomplete = { input: '' };
      this.autocompleteItems = [];

  }

  ngAfterViewInit() {
    let addressHTMLInputElement = document.getElementById('address');
    
    console.log(addressHTMLInputElement)

    this.GoogleAutocomplete = new google.maps.places.Autocomplete(addressHTMLInputElement, {
      componentRestrictions: { country: ["fr"] },
      types: ['address'],
    });

    this.GoogleAutocomplete.addListener("place_changed", this.fillInAddress.bind(this));

    console.log("===>", this.GoogleAutocomplete);
  }

  fillInAddress() {
    console.log(this.GoogleAutocomplete)
    const place = this.GoogleAutocomplete.getPlace();
    let streetAddress = "";
    console.log("place ===> ", place)
    for (const component of place.address_components) {
      if (component.types) {
        if (component.types.includes("street_number")) {
          streetAddress = component.long_name;
        } else if (component.types.includes("route")) {
          streetAddress += " " + component.short_name
        } else if (component.types.includes("postal_code")) {
          this.postCode.setValue(component.long_name);
        } else if (component.types.includes("locality")) {
          this.city.setValue(component.long_name);
        } else if (component.types.includes("country")) {
          this.country.setValue(component.long_name);
        }
      }
    }
    this.address.setValue(streetAddress);
  }

  ngOnInit() {
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(32) ])],
      lastName: ['', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(32) ])],
      birthdate: [''],
      phoneCountryCode: [ '', Validators.compose([ Validators.required ]) ],
      phoneNumber: [ '', Validators.compose([ Validators.required ]) ],
      email: [{ value: '', disabled: true }, Validators.compose([ Validators.required, CustomValidators.email ])],
      // password: ['', Validators.compose([ Validators.required, Validators.minLength(8), Validators.maxLength(32), CustomValidators.password ])],
      address: [''],
      postCode: [''],
      city: [''],
      country: [{ value: 'France', disabled: true }],
    });

    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.pipe(
      filter(user => user.id > 0)
    ).subscribe(user => {
      this.loggedInUser = { ...user };
      this.firstName.setValue(this.loggedInUser.firstName, { emitEvent: false });
      this.lastName.setValue(this.loggedInUser.lastName, { emitEvent: false });
      this.email.setValue(this.loggedInUser.email, { emitEvent: false });
      this.phoneCountryCode.setValue(this.getCountryByDialCode(this.loggedInUser.phoneCode), { emitEvent: false });
      this.phoneNumber.setValue(this.loggedInUser.phoneNumber, { emitEvent: false });
      this.address.setValue(this.loggedInUser.address, { emitEvent: false });
      this.city.setValue(this.loggedInUser.city, { emitEvent: false });
      this.postCode.setValue(this.loggedInUser.postCode, { emitEvent: false });
      this.firstName.setValue(this.loggedInUser.firstName, { emitEvent: false });
      // this.country.setValue(this.loggedInUser.country, { emitEvent: false });
      this.birthdate.setValue(this.loggedInUser.birthdate, { emitEvent: false });
    });
  }

  onClickApplyButton() {
    this.personalDetailsForm.markAllAsTouched();
    
    if (this.personalDetailsForm.valid) {
      const newFirstName = this.firstName.value;
      const newLastName = this.lastName.value;
      const newAddress = this.address.value;
      const newCity = this.city.value;
      const newPostCode = this.postCode.value;
      const newPhoneCode = this.phoneCountryCode.value ? this.phoneCountryCode.value.dialCode : null;
      const newPhoneNumber = this.phoneNumber.value;
      const newCountry = this.country.value;
      
      this.loadingController.create({
        message: 'Just a moment...',
        backdropDismiss: true,
      }).then(loading => {
        loading.present();
      })
      let request: UpdateUserDetailRequest = {
        email: this.loggedInUser.email,
        firstName: newFirstName,
        lastName: newLastName,
        address: newAddress,
        city: newCity,
        postCode: newPostCode,
        country: newCountry,
        phoneCode: (newPhoneCode[0] != '+') ? '+' + newPhoneCode : newPhoneCode,
        phoneNumber: newPhoneNumber,
        birthdate: this.birthdate.value ? new Date(this.birthdate.value).toISOString() : null,
      };
      this.store.dispatch(new UpdateUserDetailBoth(request));
    }
    console.log(this.personalDetailsForm);
  }

  get firstName() {
    return this.personalDetailsForm.get('firstName');
  }

  get lastName() {
    return this.personalDetailsForm.get('lastName');
  }

  get birthdate() {
    return this.personalDetailsForm.get('birthdate');
  }

  get phoneCountryCode() {
    return this.personalDetailsForm.get('phoneCountryCode');
  }

  get phoneNumber() {
    return this.personalDetailsForm.get('phoneNumber');
  }

  get email() {
    return this.personalDetailsForm.get('email');
  }

  get password() {
    return this.personalDetailsForm.get('password');
  }

  get address() {
    return this.personalDetailsForm.get('address');
  }

  get postCode() {
    return this.personalDetailsForm.get('postCode');
  }

  get city() {
    return this.personalDetailsForm.get('city');
  }

  get country() {
    return this.personalDetailsForm.get('country');
  }

  onCodeChange(event: {
    component: IonicSelectableComponent,
    value: any
  }): void {
    console.log(event);
  }

  private setPreferredCountries(): void {
    for (const preferedCountryIsoCode of this.preferredCountries) {
      const country = this.getCountryByIsoCode(preferedCountryIsoCode);
      country.priority = country ? 1 : country.priority;
    }
    this.phoneCountryCodes.sort((a, b) => (a.priority > b.priority) ? -1 : ((a.priority < b.priority) ? 1 : 0));
  }

  private getCountryByIsoCode(isoCode: string): CountryI {
    for (const country of this.phoneCountryCodes) {
      if (country.isoCode === isoCode) {
        return country;
      }
    }
    return;
  }

  private getCountryByDialCode(dialCode: string): CountryI {
    if (dialCode && dialCode[0] === '+') {
      dialCode = dialCode.slice(1);
    }
    for (const country of this.phoneCountryCodes) {
      if (country.dialCode === dialCode) {
        return country;
      }
    }
    return;
  }

  updateSearchResults(){
    this.autocomplete.input = this.address.value;
    
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
}