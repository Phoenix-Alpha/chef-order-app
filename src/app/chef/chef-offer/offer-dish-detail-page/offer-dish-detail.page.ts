import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { SaveOfferDishDetailInfo } from '../+state/offer.actions';
import { ChefOfferDishInfoDetail } from '../+state/offer.reducer';
import { getOfferCreateDishDetailInfo } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';

import { OfferTypeList, TagList, AllergenList, OfferType } from '../offer';

const zeroPad = (num, places) => String(num).padStart(places, '0')

@Component({
  selector: 'app-offer-dish-detail-page',
  templateUrl: './offer-dish-detail.page.html',
  styleUrls: ['./offer-dish-detail.page.scss'],
})
export class OfferDishDetailPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  dishDetailInfo$: Observable<ChefOfferDishInfoDetail>;
  dishDetailInfo: ChefOfferDishInfoDetail;

  allergenList = [ ...AllergenList ];
  tagList = [ ...TagList ];
  offerTypeList = [ ...OfferTypeList ];

  servingStart: string;
  servingEnd: string;
  
  validation_messages = {
    'cuisines': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'offerType': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'weight': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'servingDate': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'orderUntil': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'minPreorderHours': [
      { type: 'required', message: 'validation.global.required' },
    ],
    'maxQuantity': [
      { type: 'required', message: 'validation.global.required' },
    ],
  }

  offerDishDetailCommonForm: FormGroup;
  offerDishDetailPreorderForm: FormGroup;
  offerDishDetailOnDemandForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    private toastController: ToastController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.offerDishDetailCommonForm = this.fb.group({
      cuisines: ['', Validators.compose([ Validators.required, Validators.minLength(1) ])],
      weight: [0, Validators.compose([ Validators.required ])],
    });

    this.offerDishDetailPreorderForm = this.fb.group({
      servingDate: ['', Validators.compose([ Validators.required ])],
      orderUntil: ['', Validators.compose([ Validators.required ])],
      maxQuantity: [0, Validators.compose([ Validators.required ])],
    });

    this.offerDishDetailOnDemandForm = this.fb.group({
      minPreorderHours: [0, Validators.compose([ Validators.required ])],
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
      } else {
        this.chefDetail = null;
      }
    })
    this.dishDetailInfo$ = this.store.select(getOfferCreateDishDetailInfo);
    this.dishDetailInfo$.subscribe(s => {
      this.dishDetailInfo = { ...s };
      console.log('dishDetailInfo: ', this.dishDetailInfo);
      this.cuisines.setValue(this.dishDetailInfo.cuisines, { emitEvent: false });
      this.weight.setValue(this.dishDetailInfo.weight, { emitEvent: false });
      this.minPreorderHours.setValue(this.dishDetailInfo.minPreorderHours, { emitEvent: false });
      this.maxQuantity.setValue(this.dishDetailInfo.maxQuantity, { emitEvent: false });
      this.servingDate.setValue(this.toServingDate(this.dishDetailInfo.servingStart, this.dishDetailInfo.servingEnd), { emitEvent: false });
      this.orderUntil.setValue(this.toOrderUntil(this.dishDetailInfo.orderUntil), { emitEvent: false });
    })
  }

  onTagsChanged(event: any) {
    console.log("tag changed: ", event)
    // this.tags = event;
    this.dishDetailInfo.tags = [ ...event ];
  }

  onAllergensChanged(event: any) {
    console.log("allergen changed: ", event)
    // this.allergens = event;
    this.dishDetailInfo.allergens = [ ...event ];
  }

  onOfferTypeChanged(event: any) {
    console.log("offer type: ", event)
    this.dishDetailInfo.offerType = event;
    let newDishDetailInfo = { ...this.dishDetailInfo };
    const { start, end } = this.parseServingDate(this.servingDate.value);
    const until = this.parseOrderUntil(this.orderUntil.value);
    newDishDetailInfo.cuisines = this.cuisines.value;
    newDishDetailInfo.minPreorderHours = this.minPreorderHours.value;
    newDishDetailInfo.maxQuantity = this.maxQuantity.value;
    newDishDetailInfo.weight = this.weight.value;
    newDishDetailInfo.servingStart = start;
    newDishDetailInfo.servingEnd = end;
    newDishDetailInfo.orderUntil = until;
    newDishDetailInfo.isValid = true;
    this.store.dispatch(new SaveOfferDishDetailInfo(newDishDetailInfo));
  }

  onSave() {
    this.offerDishDetailCommonForm.markAllAsTouched();
    this.offerDishDetailPreorderForm.markAllAsTouched();
    this.offerDishDetailOnDemandForm.markAllAsTouched();
    const { start, end } = this.parseServingDate(this.servingDate.value);
    const until = this.parseOrderUntil(this.orderUntil.value);
    console.log(until, this.orderUntil.value)
    if (this.dishDetailInfo.offerType === OfferType.PREORDER) {
      if (this.offerDishDetailCommonForm.valid
        && this.offerDishDetailPreorderForm.valid
        && start
        && end
        && until) {
        let newDishDetailInfo = { ...this.dishDetailInfo };
        newDishDetailInfo.cuisines = this.cuisines.value;
        // newDishDetailInfo.minPreorderHours = this.minPreorderHours.value;
        newDishDetailInfo.maxQuantity = this.maxQuantity.value;
        newDishDetailInfo.weight = this.weight.value;
        newDishDetailInfo.servingStart = start;
        newDishDetailInfo.servingEnd = end;
        newDishDetailInfo.orderUntil = until;
        newDishDetailInfo.isValid = true;
        this.store.dispatch(new SaveOfferDishDetailInfo(newDishDetailInfo));
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
    } else if (this.dishDetailInfo.offerType === OfferType.ONDEMAND) {
      if (this.offerDishDetailCommonForm.valid
        && this.offerDishDetailOnDemandForm.valid) {
        let newDishDetailInfo = { ...this.dishDetailInfo };
        newDishDetailInfo.cuisines = this.cuisines.value;
        newDishDetailInfo.minPreorderHours = this.minPreorderHours.value;
        // newDishDetailInfo.maxQuantity = this.maxQuantity.value;
        newDishDetailInfo.weight = this.weight.value;
        // newDishDetailInfo.servingStart = start;
        // newDishDetailInfo.servingEnd = end;
        // newDishDetailInfo.orderUntil = until;
        newDishDetailInfo.isValid = true;
        this.store.dispatch(new SaveOfferDishDetailInfo(newDishDetailInfo));
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
        message: "Please select offer type.",
        duration: 1500,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
    }
  }

  parseServingDate(servingDate: string) {
    const day = parseInt(servingDate.slice(0, 2));
    const month = parseInt(servingDate.slice(3, 5)) - 1;
    const year = parseInt(servingDate.slice(6, 10));
    const hour_start = parseInt(servingDate.slice(11, 13));
    const min_start = parseInt(servingDate.slice(14, 16));
    const hour_end = parseInt(servingDate.slice(19, 21));
    const min_end = parseInt(servingDate.slice(22, 24));
    const start = new Date(year, month, day, hour_start, min_start);
    const end = new Date(year, month, day, hour_end, min_end);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        start: "",
        end: "",
      }
    } else {
      return {
        start: start.toISOString(),
        end: start.toISOString(),
      }
    }
  }
  
  toServingDate(servingStart: string, servingEnd: string) {
    if (!servingStart || !servingEnd) {
      return "";
    }
    const start = new Date(servingStart);
    const end = new Date(servingEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "";
    } else {
      // Here we assume that the date is same.
      let result: string = "";
      result = zeroPad(start.getDate(), 2) + "." + zeroPad(start.getMonth() + 1, 2) + "." + start.getFullYear().toString() + " " + zeroPad(start.getHours(), 2) + ":" + zeroPad(start.getMinutes(), 2) + " - "  + zeroPad(end.getHours(), 2) + ":" + zeroPad(end.getMinutes(), 2);
      return result;
    }
  }

  parseOrderUntil(until: string) {
    const day = parseInt(until.slice(0, 2));
    const month = parseInt(until.slice(3, 5)) - 1;
    const year = parseInt(until.slice(6, 10));
    const hours = parseInt(until.slice(11, 13));
    const mins = parseInt(until.slice(14, 16));
    const result = new Date(year, month, day, hours, mins);
    if (isNaN(result.getTime())) {
      return ""
    } else {
      return result.toISOString();
    }
  }

  toOrderUntil(until: string) {
    if (!until) {
      return "";
    }
    const untilDate = new Date(until);
    
    if (isNaN(untilDate.getTime())) {
      return "";
    } else {
      // Here we assume that the date is same.
      let result: string = "";
      result = zeroPad(untilDate.getDate(), 2) + "." + zeroPad(untilDate.getMonth() + 1, 2) + "." + untilDate.getFullYear().toString() + " " + zeroPad(untilDate.getHours(), 2) + ":" + zeroPad(untilDate.getMinutes(), 2);
      return result;
    }
  }

  get cuisines() {
    return this.offerDishDetailCommonForm.get('cuisines');
  }

  get weight() {
    return this.offerDishDetailCommonForm.get('weight');
  }

  get servingDate() {
    return this.offerDishDetailPreorderForm.get('servingDate');
  }

  get orderUntil() {
    return this.offerDishDetailPreorderForm.get('orderUntil');
  }

  get maxQuantity() {
    return this.offerDishDetailPreorderForm.get('maxQuantity');
  }

  get minPreorderHours() {
    return this.offerDishDetailOnDemandForm.get('minPreorderHours');
  }

}