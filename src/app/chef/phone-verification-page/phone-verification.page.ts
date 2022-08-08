import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { IonIntlTelInputValidators } from 'src/app/ion-intl-tel-input/ion-intl-tel-input.directive';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Store } from '@ngrx/store';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { filter, take } from 'rxjs/operators';
import { LoggedInUser, UpdateUserPhoneNumberRequest } from 'src/app/auth/auth';
import { UpdateUserPhoneNumber } from 'src/app/auth/+state/auth.actions';
import { Observable } from 'rxjs';
import { countries } from 'src/app/ion-intl-tel-input/data/countries';
import { CountryI } from 'src/app/ion-intl-tel-input/models/country.model';

@Component({
  selector: 'app-phone-verification-page',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
  animations: [
    trigger(
      'fadeAnimation', 
      [
        // the "in" style determines the "resting" state of the element when it is visible.
        state('in', style({opacity: 1})),

        // fade in when created. this could also be written as transition('void => *')
        transition(':enter', [
          style({opacity: 0}),
          animate(400)
        ]),

        // fade out when destroyed. this could also be written as transition('void => *')
        transition(':leave', animate(400, style({opacity: 0})))
      ]
    )
  ]
})
export class PhoneVerificationPage implements OnInit {
  
  loading: HTMLIonLoadingElement;

  preferredCountries = [
    "fr",
    "de",
    "nl",
  ]
  
  phoneVerficationForm: FormGroup;

  validation_messages = {
    'phoneNumber': [
      { type: 'required', message: 'validation.phoneNumber.required' },
      { type: 'phone', message: 'validation.phoneNumber.invalid' },
    ],
  }

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  phoneCountryCodes: CountryI[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<any>,
    private cognitoAuthService: CognitoAuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router) { 
      this.phoneCountryCodes = [ ...countries ];
  }

  ngOnInit() {
    this.phoneCountryCodes = [ ...countries ];

    this.phoneVerficationForm = this.fb.group({
      phoneNumber: [null, Validators.compose([ Validators.required, IonIntlTelInputValidators.phone ])],
    });

    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.pipe(
      filter(user => user.id > 0)
    ).subscribe(user => {
      this.loggedInUser = { ...user };
      console.log(this.loggedInUser);
      if (this.loggedInUser.phoneCode && this.loggedInUser.phoneNumber) {
        const dialCode = this.getDialCode(this.loggedInUser.phoneCode);
        let country = this.getCountryByDialCode(dialCode);
        this.phoneNumber.setValue(this.loggedInUser.phoneCode + this.loggedInUser.phoneNumber);
        // this.phoneNumber.setValue({
        //   dialCode: dialCode,
        //   internationalNumber: this.loggedInUser.phoneCode + this.loggedInUser.phoneNumber,
        //   isoCode: country.isoCode,
        //   nationalNumber: this.loggedInUser.phoneNumber,
        //   number: this.loggedInUser.phoneNumber,
        // });
        console.log(this.phoneNumber.value)
      }
    });
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    
  }

  async onClickEnterPhoneNumberContinue() {
    console.log(this.phoneNumber.value)
    this.phoneNumber.markAllAsTouched();
    if (this.phoneNumber.valid) {
      const rawPhoneNumber = this.phoneNumber.value.internationalNumber.replace(/\s/g, "");
      const nationalNumber = this.phoneNumber.value.nationalNumber.replace(/\s/g, "");
      console.log(this.phoneNumber.value);

      this.loading = await this.loadingController.create({
        message: `Sending SMS to ${rawPhoneNumber}`,
      });
      this.loading.present();

      this.store.select(getLoggedInUser).pipe(take(1)).subscribe(user => {
        const request: UpdateUserPhoneNumberRequest = {
          email: user.email,
          phoneCode: this.phoneNumber.value.dialCode,
          phoneNumber: nationalNumber,
        }
        this.store.dispatch(new UpdateUserPhoneNumber(request));
      })

      // const _this = this;
      // const cognitoUser: CognitoUser = this.cognitoAuthService.cognitoUtil.getCurrentUser();
      // cognitoUser.getSession(function(err, session) {
      //   console.log(session)
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     if (session.isValid()) {
      //       let attributeList = [];
      //       let phoneNumberAttribute = new CognitoUserAttribute({
      //         Name: 'phone_number',
      //         Value: rawPhoneNumber
      //       })
      //       attributeList.push(phoneNumberAttribute);
      //       cognitoUser.updateAttributes(attributeList, function(update_err, result) {
      //         if (update_err) {
      //           console.log(update_err);
      //         } else {
      //           console.log(result);
      //           cognitoUser.getAttributeVerificationCode('phone_number', {
      //             onSuccess: function () {
      //               console.log("code sent");
      //               _this.router.navigate(['public/chef/phone-verification/confirm']);
      //             },
      //             onFailure: async function (err) {
      //               console.log(err);
      //               _this.loadingController.dismiss();
      //               const toast = await _this.toastController.create({
      //                 animated: true,
      //                 message: err.message,
      //                 duration: 3000,
      //               });
      //               toast.present();
      //             },
      //             inputVerificationCode(data) {
      //               console.log(data);
      //               _this.loadingController.dismiss();
      //               _this.router.navigate(['public/chef/phone-verification/confirm']);
      //             }
      //           });
      //         }
      //       });
      //     } else {
      //       console.log("session invalid")
      //     }
      //   }
      // });
    }
  }

  get phoneNumber() {
    return this.phoneVerficationForm.get('phoneNumber');
  }

  private getDialCode(phoneCode: string) {
    if (phoneCode[0] === '+') {
      phoneCode = phoneCode.slice(1);
    }
    return phoneCode;
  }

  private getCountryByDialCode(dialCode: string): CountryI {
    for (const country of this.phoneCountryCodes) {
      if (country.dialCode === dialCode) {
        return country;
      }
    }
    return;
  }

}
