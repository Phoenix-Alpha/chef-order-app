import { DeliveryMode } from './../../chef/chef-offer/offer';
import { PublicOrderCreate, UpdateCheckoutUserInfo } from './+state/checkout.actions';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { getOrders, getCheckoutState, getDiscountedTotal, getCheckoutUserInfo } from './+state/checkout.selectors';
import { Store } from '@ngrx/store';
import { CheckoutState, UserInfo } from './+state/checkout.reducer';
import { PublicOrderCreateRequest, PaymentMethod } from './checkout';
import { Device } from '@ionic-native/device/ngx'
import { LoggedInUser } from 'src/app/auth/auth';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss', './checkout01.page.scss', './checkout02.page.scss'],
})
export class CheckoutPage implements OnInit {

  checkoutForm: FormGroup;

  isCouponValid = false;
  discountedTotal$: Observable<number>;
  
  checkoutState$: Observable<CheckoutState>;
  checkoutState: CheckoutState;
  
  checkoutStateUserInfo$: Observable<UserInfo>;
  checkoutStateUserInfo: UserInfo;
  
  validation_messages = {
    'firstName' : [
      { type: 'required', message: 'validation.firstName.required' },
      { type: 'minlength', message: 'validation.firstName.minLength' },
      { type: 'maxlength', message: 'validation.firstName.maxLength' },
    ],
    'lastName' : [
      { type: 'required', message: 'validation.lastName.required' },
      { type: 'minlength', message: 'validation.lastName.minLength' },
      { type: 'maxlength', message: 'validation.lastName.maxLength' },
    ],
    'email': [
      { type: 'required', message: 'validation.email.required' },
      { type: 'email', message: 'validation.email.notValid' },
    ],
    'phoneNumber': [
      { type: 'required', message: 'validation.phoneNumber.required' },
      // { type: 'phone', message: 'validation.phoneNumber.invalid' },
    ],
    'streetHouseNumber' : [
      { type: 'required', message: 'validation.streetHouseNumber.required' },
      { type: 'minlength', message: 'validation.streetHouseNumber.minLength' },
      { type: 'maxlength', message: 'validation.streetHouseNumber.maxLength' },
    ],
    'postcode' : [
      { type: 'required', message: 'validation.postCode.required' },
      { type: 'minlength', message: 'validation.postCode.minLength' },
      { type: 'maxlength', message: 'validation.postCode.maxLength' },
    ],
    'city' : [
      { type: 'required', message: 'validation.city.required' },
      { type: 'minlength', message: 'validation.city.minLength' },
      { type: 'maxlength', message: 'validation.city.maxLength' },
    ],
  }

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  constructor(private fb: FormBuilder,
    private route: Router,
    private store: Store,
    private device: Device,
    ) { }

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      firstName:['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)])],
      lastName:['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)])],
      email:['',Validators.compose([Validators.required, Validators.email])],
      phoneNumber : [ '' , Validators.compose([Validators.required])],
      streetHouseNumber:['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)])],
      postcode:['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)])],
      city:['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)])],
      coupon:[''],
    });

    this.checkoutState$ = this.store.select(getCheckoutState);
    this.checkoutState$.subscribe(c => {
      this.checkoutState = { ...c };
    })

    this.checkoutStateUserInfo$ = this.store.select(getCheckoutUserInfo);
    this.checkoutStateUserInfo$.subscribe(c => {
      this.checkoutStateUserInfo = { ...c };
      this.firstName.setValue(this.checkoutStateUserInfo.firstName, { emitEvent: false });
      this.lastName.setValue(this.checkoutStateUserInfo.lastName, { emitEvent: false });
      this.email.setValue(this.checkoutStateUserInfo.email, { emitEvent: false });
      this.phoneNumber.setValue(this.checkoutStateUserInfo.phoneNumber, { emitEvent: false });
      this.streetHouseNumber.setValue(this.checkoutStateUserInfo.streetHouseNumber, { emitEvent: false });
      this.city.setValue(this.checkoutStateUserInfo.city, { emitEvent: false });
      this.postcode.setValue(this.checkoutStateUserInfo.postcode, { emitEvent: false });
    });

    this.discountedTotal$ = this.store.select(getDiscountedTotal);

    this.firstName.valueChanges.subscribe(newFirstName => {
      this.checkoutStateUserInfo.firstName = newFirstName;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.lastName.valueChanges.subscribe(newLastName => {
      this.checkoutStateUserInfo.lastName = newLastName;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.email.valueChanges.subscribe(newEmail => {
      this.checkoutStateUserInfo.email = newEmail;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.phoneNumber.valueChanges.subscribe(newPhoneNumber => {
      this.checkoutStateUserInfo.phoneNumber = newPhoneNumber;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.streetHouseNumber.valueChanges.subscribe(newStreetHouseNumber => {
      this.checkoutStateUserInfo.streetHouseNumber = newStreetHouseNumber;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.city.valueChanges.subscribe(newCity => {
      this.checkoutStateUserInfo.city = newCity;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.postcode.valueChanges.subscribe(newPostcode => {
      this.checkoutStateUserInfo.postcode = newPostcode;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.coupon.valueChanges.subscribe(newCoupon => {
      this.checkoutStateUserInfo.coupon = newCoupon;
      this.store.dispatch(new UpdateCheckoutUserInfo({ ...this.checkoutStateUserInfo }));
    });

    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.subscribe(user => {
      if (user.id > 0) {
        this.loggedInUser = { ...user };
        console.log('user: ', this.loggedInUser);

        this.firstName.setValue(this.loggedInUser.firstName);
        this.lastName.setValue(this.loggedInUser.lastName);
        this.email.setValue(this.loggedInUser.email);
        this.phoneNumber.setValue(this.loggedInUser.phoneCode && this.loggedInUser.phoneNumber ? this.loggedInUser.phoneCode + this.loggedInUser.phoneNumber : null);
        this.streetHouseNumber.setValue(this.loggedInUser.address);
        this.postcode.setValue(this.loggedInUser.postCode);
        this.city.setValue(this.loggedInUser.city);
      } else {
        this.loggedInUser = null;
      }
    });
  }

  ionViewWillEnter(){
    this.isCouponValid = false;
  }


  get firstName() {
    return this.checkoutForm.get('firstName');
  }

  get lastName() {
    return this.checkoutForm.get('lastName');
  }

  get email() {
    return this.checkoutForm.get('email');
  }

  get phoneNumber() {
    return this.checkoutForm.get('phoneNumber');
  }

  get streetHouseNumber() {
    return this.checkoutForm.get('streetHouseNumber');
  }

  get postcode() {
    return this.checkoutForm.get('postcode');
  }

  get city() {
    return this.checkoutForm.get('city');
  }

  get coupon() {
    return this.checkoutForm.get('coupon');
  }

  checkout(){
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      let delivery: DeliveryMode = DeliveryMode.DELIVERY;
      if(this.checkoutState.basketInfo.orders[0].offer.isPickup){
        delivery = DeliveryMode.PICKUP;
      }
      const request: PublicOrderCreateRequest = {
        coupon: this.coupon.value,
        customerEmail: this.email.value,
        customerFirstName: this.firstName.value,
        customerLastName: this.lastName.value,
        customerPhoneNumber: this.phoneNumber.value,
        deliveryCity: this.city.value,
        deliveryMethod: delivery,
        deliveryPostcode: this.postcode.value,
        deliveryStreetAddress: this.streetHouseNumber.value,
        // userAddress: this.streetHouseNumber.value + ", " + this.city.value + ", " + this.postcode.value,
        offerId: this.checkoutState.basketInfo.orders[0].offer.offerId,
        quantity: this.checkoutState.basketInfo.orders[0].amount,
        pickupDate: this.checkoutState.basketInfo.orders[0].pickupDate,
        specialNote: this.checkoutState.basketInfo.orders[0].specialNote,
        paymentMethod: PaymentMethod.CREDIT_CARD_STRIPE,
        deviceIdentifier: this.device.uuid,
      };
      this.store.dispatch(new PublicOrderCreate(request));
    }
  }

  onCouponInputChanged(event) {
    console.log("newValue: ", event.target.value);
    if (event.target.value) {
      this.isCouponValid = true;
    }
  }

  signIn(){
    this.route.navigate(['/public/auth/login', { queryParams: { returnToCheckout: true } }]);
  }
}
