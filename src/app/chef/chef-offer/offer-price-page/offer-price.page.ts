import { formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { SaveOfferPriceInfo } from '../+state/offer.actions';
import { ChefOfferPriceInfoDetail } from '../+state/offer.reducer';
import { getOfferCreatePriceInfo } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';

@Component({
  selector: 'app-offer-price-page',
  templateUrl: './offer-price.page.html',
  styleUrls: ['./offer-price.page.scss'],
})
export class OfferPricePage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  offerPriceForm: FormGroup;

  priceInfo$: Observable<ChefOfferPriceInfoDetail>;
  priceInfo: ChefOfferPriceInfoDetail;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    private toastController: ToastController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.offerPriceForm = this.fb.group({
      price: [0, Validators.compose([ Validators.required ])],
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

    this.priceInfo$ = this.store.select(getOfferCreatePriceInfo);
    this.priceInfo$.subscribe(s => {
      this.priceInfo = { ...s };
      this.price.setValue(this.priceInfo.price);
    })

  }

  onSave() {
    if (this.offerPriceForm.valid) {
      let newPriceInfo = { ...this.priceInfo };
      newPriceInfo.price = this.price.value;
      newPriceInfo.isValid = true;
      this.store.dispatch(new SaveOfferPriceInfo(newPriceInfo));
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
  }

  get price() {
    return this.offerPriceForm.get('price');
  }

}