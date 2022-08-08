import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { ActivateWallet } from '../+state/wallet.action';
import { APISTATUS } from '../+state/wallet.reducer';
import { getChefWalletAPIStatus } from '../+state/wallet.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefActivateWalletRequest, ChefDetail } from '../../chef';

@Component({
  selector: 'app-chef-wallet-info-page',
  templateUrl: './chef-wallet-info.page.html',
  styleUrls: ['./chef-wallet-info.page.scss'],
})
export class ChefWalletInfoPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  currentTab: string;

  walletInfoForm: FormGroup;

  apiStatus$: Observable<APISTATUS>;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private fb: FormBuilder,
    private popoverController: PopoverController) { }

  ngOnInit() {

    this.walletInfoForm = this.fb.group({
      firstName: [null, Validators.compose([ Validators.required ])],
      lastName: [null, Validators.compose([ Validators.required ])],
      birthdate: ['', Validators.compose([ Validators.required ])],
      billingAddressCity: ['', Validators.compose([ Validators.required ])],
      billingAddressLine: ['', Validators.compose([ Validators.required ])],
      billingAddressPostcode: ['', Validators.compose([ Validators.required ])],
      IBAN: ['', Validators.compose([ Validators.required ])],
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

    this.apiStatus$ = this.store.select(getChefWalletAPIStatus);
  }

  onConfirm() {
    this.walletInfoForm.markAllAsTouched();
    if (this.walletInfoForm.valid) {
      // let request: ChefActivateWalletRequest = {
      //   email: this.loggedInUser.email,
      //   legalFirstName: this.firstName.value,
      //   legalLastName: this.lastName.value,
      //   billingAddressCity: this.billingAddressCity.value,
      //   billingAddressPostcode: this.billingAddressPostcode.value,
      //   billingAddressLine: this.billingAddressLine.value,
      //   birthday: new Date(this.birthdate.value).toISOString(),
      //   accountNumber: this.IBAN.value,
      // }
      // console.log(request);
      // this.store.dispatch(new ActivateWallet(request));
    }
  }

  get firstName() {
    return this.walletInfoForm.get('firstName');
  }

  get lastName() {
    return this.walletInfoForm.get('lastName');
  }

  get birthdate() {
    return this.walletInfoForm.get('birthdate');
  }

  get billingAddressCity() {
    return this.walletInfoForm.get('billingAddressCity');
  }

  get billingAddressPostcode() {
    return this.walletInfoForm.get('billingAddressPostcode');
  }

  get billingAddressLine() {
    return this.walletInfoForm.get('billingAddressLine');
  }

  get IBAN() {
    return this.walletInfoForm.get('IBAN');
  }

}