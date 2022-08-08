import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { EventListeners } from 'aws-sdk';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { SaveOfferDeliveryOptionsInfo } from '../+state/offer.actions';
import { ChefOfferDeliveryOptionsInfoDetail } from '../+state/offer.reducer';
import { getOfferCreateDeliveryOptionsInfo } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { DeliveryTypeList } from '../offer';

@Component({
  selector: 'app-offer-delivery-options-page',
  templateUrl: './offer-delivery-options.page.html',
  styleUrls: ['./offer-delivery-options.page.scss'],
})
export class OfferDeliveryOptionsPage implements OnInit {

  validation_messages = {
    'servingAddress': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'servingPostcode': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'servingCity': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'zone1MaxDistance': [
      { type: 'required', message: 'validation.global.maxDistance' },
    ],
    'zone1DeliveryPrice': [
      { type: 'required', message: 'validation.global.deliveryPrice' },
    ],
  }
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  deliveryOptionsInfo$: Observable<ChefOfferDeliveryOptionsInfoDetail>;
  deliveryOptionsInfo: ChefOfferDeliveryOptionsInfoDetail;

  deliveryTypeList = [ ...DeliveryTypeList ];
  deliveryType: string;

  offerDeliveryOptionsDeliveryForm: FormGroup;
  offerDeliveryOptionsPickupForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    private toastController: ToastController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.offerDeliveryOptionsPickupForm = this.fb.group({
      servingAddress: ['', Validators.compose([ Validators.required, Validators.maxLength(128) ])],
      servingPostcode: ['', Validators.compose([ Validators.required, Validators.maxLength(16) ])],
      servingCity: ['', Validators.compose([ Validators.required, Validators.maxLength(64) ])],
    });

    this.offerDeliveryOptionsDeliveryForm = this.fb.group({
      zone1MaxDistance: [null, Validators.compose([ Validators.required ])],
      zone1DeliveryPrice: [null, Validators.compose([ Validators.required ])],
      zone2MaxDistance: [null],
      zone2DeliveryPrice: [null],
      zone3MaxDistance: [null],
      zone3DeliveryPrice: [null],
      isMinFreeDeliveryAmountEnabled: [false],
      minFreeDeliveryAmount: [null],
    });

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

    this.deliveryOptionsInfo$ = this.store.select(getOfferCreateDeliveryOptionsInfo);
    this.deliveryOptionsInfo$.subscribe(s => {
      this.deliveryOptionsInfo = { ...s };

      if (this.deliveryOptionsInfo.isDelivery && this.deliveryOptionsInfo.isPickup) {
        this.deliveryType = "BOTH";
      } else if (this.deliveryOptionsInfo.isDelivery) {
        this.deliveryType = "DELIVERY";
      } else if (this.deliveryOptionsInfo.isPickup) {
        this.deliveryType = "PICKUP"
      } else {
        this.deliveryType = "";
      }

      this.servingAddress.setValue(this.deliveryOptionsInfo.servingAddress);
      this.servingPostcode.setValue(this.deliveryOptionsInfo.servingPostcode);
      this.servingCity.setValue(this.deliveryOptionsInfo.servingCity);

      this.zone1MaxDistance.setValue(this.deliveryOptionsInfo.zone1MaxDistance);
      this.zone1DeliveryPrice.setValue(this.deliveryOptionsInfo.zone1DeliveryPrice);
      this.zone2MaxDistance.setValue(this.deliveryOptionsInfo.zone2MaxDistance);
      this.zone2DeliveryPrice.setValue(this.deliveryOptionsInfo.zone2DeliveryPrice);
      this.zone3MaxDistance.setValue(this.deliveryOptionsInfo.zone3MaxDistance);
      this.zone3DeliveryPrice.setValue(this.deliveryOptionsInfo.zone3DeliveryPrice);
      this.minFreeDeliveryAmount.setValue(this.deliveryOptionsInfo.minFreeDeliveryAmount);

      if (this.deliveryOptionsInfo.minFreeDeliveryAmount) {
        this.isMinFreeDeliveryAmountEnabled.setValue(true);
      } else {
        this.isMinFreeDeliveryAmountEnabled.setValue(false);
      }
    })
  }

  onDeliveryTypeChanged(event) {
    this.deliveryType = event;
    console.log(this.deliveryType);
    if (this.deliveryType == "PICKUP") {
      this.deliveryOptionsInfo.isPickup = true;
      this.deliveryOptionsInfo.isDelivery = false;
    } else if (this.deliveryType == "DELIVERY") {
      this.deliveryOptionsInfo.isPickup = false;
      this.deliveryOptionsInfo.isDelivery = true;
    } else if (this.deliveryType == "BOTH") {
      this.deliveryOptionsInfo.isPickup = true;
      this.deliveryOptionsInfo.isDelivery = true;
    } else {
      this.deliveryOptionsInfo.isPickup = false;
      this.deliveryOptionsInfo.isDelivery = false;
    }
  }

  onSave() {
    this.offerDeliveryOptionsDeliveryForm.markAllAsTouched();
    this.offerDeliveryOptionsPickupForm.markAllAsTouched();
    console.log(this.offerDeliveryOptionsDeliveryForm, this.offerDeliveryOptionsPickupForm)
    console.log(this.deliveryOptionsInfo)
    if (this.deliveryOptionsInfo.isDelivery && this.deliveryOptionsInfo.isPickup) {
      if (this.offerDeliveryOptionsDeliveryForm.valid && this.offerDeliveryOptionsPickupForm.valid) {
      
        let newDeliveryOptionsInfo: ChefOfferDeliveryOptionsInfoDetail = { ...this.deliveryOptionsInfo };
  
        newDeliveryOptionsInfo.servingAddress = this.servingAddress.value;
        newDeliveryOptionsInfo.servingCity = this.servingCity.value;
        newDeliveryOptionsInfo.servingPostcode = this.servingPostcode.value;
        
        newDeliveryOptionsInfo.zone1MaxDistance = this.zone1MaxDistance.value;
        newDeliveryOptionsInfo.zone1DeliveryPrice = this.zone1DeliveryPrice.value;
  
        if (this.zone2MaxDistance.value && this.zone2DeliveryPrice.value) {
          newDeliveryOptionsInfo.zone2MaxDistance = this.zone2MaxDistance.value;
          newDeliveryOptionsInfo.zone2DeliveryPrice = this.zone2DeliveryPrice.value;
        }
  
        if (this.zone3MaxDistance.value && this.zone3DeliveryPrice.value) {
          newDeliveryOptionsInfo.zone3MaxDistance = this.zone3MaxDistance.value;
          newDeliveryOptionsInfo.zone3DeliveryPrice = this.zone3DeliveryPrice.value;
        }
  
        if (this.minFreeDeliveryAmount.value) {
          newDeliveryOptionsInfo.minFreeDeliveryAmount = this.minFreeDeliveryAmount.value;
        }
        newDeliveryOptionsInfo.isValid = true;
        this.store.dispatch(new SaveOfferDeliveryOptionsInfo(newDeliveryOptionsInfo));
        this.router.navigate(['/public/chef/offer/0'])
      } else {
        this.toastController.create({
          animated: true,
          message: "Please fill in required fields and try again.",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    } else if (this.deliveryOptionsInfo.isDelivery) {
      if (this.offerDeliveryOptionsDeliveryForm.valid) {
        let newDeliveryOptionsInfo: ChefOfferDeliveryOptionsInfoDetail = { ...this.deliveryOptionsInfo };

        newDeliveryOptionsInfo.servingAddress = this.servingAddress.value;
        newDeliveryOptionsInfo.servingCity = this.servingCity.value;
        newDeliveryOptionsInfo.servingPostcode = this.servingPostcode.value;

        newDeliveryOptionsInfo.zone1MaxDistance = this.zone1MaxDistance.value;
        newDeliveryOptionsInfo.zone1DeliveryPrice = this.zone1DeliveryPrice.value;
        
        if (this.zone2MaxDistance.value && this.zone2DeliveryPrice.value) {
          newDeliveryOptionsInfo.zone2MaxDistance = this.zone2MaxDistance.value;
          newDeliveryOptionsInfo.zone2DeliveryPrice = this.zone2DeliveryPrice.value;
        }
        if (this.zone3MaxDistance.value && this.zone3DeliveryPrice.value) {
          newDeliveryOptionsInfo.zone3MaxDistance = this.zone3MaxDistance.value;
          newDeliveryOptionsInfo.zone3DeliveryPrice = this.zone3DeliveryPrice.value;
        }
        if (this.minFreeDeliveryAmount.value) {
          newDeliveryOptionsInfo.minFreeDeliveryAmount = this.minFreeDeliveryAmount.value;
        }
        newDeliveryOptionsInfo.isValid = true;
        this.store.dispatch(new SaveOfferDeliveryOptionsInfo(newDeliveryOptionsInfo));
        this.router.navigate(['/public/chef/offer/0'])
      } else {
        this.toastController.create({
          animated: true,
          message: "Please fill in required fields and try again.",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    } else if (this.deliveryOptionsInfo.isPickup) {
      if (this.offerDeliveryOptionsPickupForm.valid) {
        let newDeliveryOptionsInfo: ChefOfferDeliveryOptionsInfoDetail = { ...this.deliveryOptionsInfo };
        newDeliveryOptionsInfo.servingAddress = this.servingAddress.value;
        newDeliveryOptionsInfo.servingCity = this.servingCity.value;
        newDeliveryOptionsInfo.servingPostcode = this.servingPostcode.value;
        // newDeliveryOptionsInfo.zone1MaxDistance = this.zone1MaxDistance.value;
        // newDeliveryOptionsInfo.zone1DeliveryPrice = this.zone1DeliveryPrice.value;
        // if (this.zone2MaxDistance.value && this.zone2DeliveryPrice.value) {
        //   newDeliveryOptionsInfo.zone2MaxDistance = this.zone2MaxDistance.value;
        //   newDeliveryOptionsInfo.zone2DeliveryPrice = this.zone2DeliveryPrice.value;
        // }
        // if (this.zone3MaxDistance.value && this.zone3DeliveryPrice.value) {
        //   newDeliveryOptionsInfo.zone3MaxDistance = this.zone3MaxDistance.value;
        //   newDeliveryOptionsInfo.zone3DeliveryPrice = this.zone3DeliveryPrice.value;
        // }
        // if (this.minFreeDeliveryAmount.value) {
        //   newDeliveryOptionsInfo.minFreeDeliveryAmount = this.minFreeDeliveryAmount.value;
        // }
        newDeliveryOptionsInfo.isValid = true;
        this.store.dispatch(new SaveOfferDeliveryOptionsInfo(newDeliveryOptionsInfo));
        this.router.navigate(['/public/chef/offer/0'])
      } else {
        this.toastController.create({
          animated: true,
          message: "Please fill in required fields and try again.",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    } else {
      this.toastController.create({
        animated: true,
        message: "Please select the delivery type",
        duration: 2000,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
    }
  }

  get servingAddress() {
    return this.offerDeliveryOptionsPickupForm.get('servingAddress');
  }

  get servingPostcode() {
    return this.offerDeliveryOptionsPickupForm.get('servingPostcode');
  }

  get servingCity() {
    return this.offerDeliveryOptionsPickupForm.get('servingCity');
  }
  
  get zone1MaxDistance() {
    return this.offerDeliveryOptionsDeliveryForm.get('zone1MaxDistance');
  }

  get zone1DeliveryPrice() {
    return this.offerDeliveryOptionsDeliveryForm.get('zone1DeliveryPrice');
  }
  
  get zone2MaxDistance() {
    return this.offerDeliveryOptionsDeliveryForm.get('zone2MaxDistance');
  }

  get zone2DeliveryPrice() {
    return this.offerDeliveryOptionsDeliveryForm.get('zone2DeliveryPrice');
  }
  
  get zone3MaxDistance() {
    return this.offerDeliveryOptionsDeliveryForm.get('zone3MaxDistance');
  }

  get zone3DeliveryPrice() {
    return this.offerDeliveryOptionsDeliveryForm.get('zone3DeliveryPrice');
  }

  get isMinFreeDeliveryAmountEnabled() {
    return this.offerDeliveryOptionsDeliveryForm.get('isMinFreeDeliveryAmountEnabled');
  }

  get minFreeDeliveryAmount() {
    return this.offerDeliveryOptionsDeliveryForm.get('minFreeDeliveryAmount');
  }

  

}