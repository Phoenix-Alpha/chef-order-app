import { ActivateWallet, FetchWalletInfo, RedirectToStripeDashboard } from './+state/wallet.action';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { getChefDetail } from '../+state/chef.selectors';
import { ChefActivateWalletRequest, ChefDetail } from '../chef';
import { ChefService } from '../chef.service';
import { getChefWalletInfo } from './+state/wallet.selectors';
import { ChefWalletInfo } from './+state/wallet.reducer';

@Component({
  selector: 'app-chef-wallet-page',
  templateUrl: './chef-wallet.page.html',
  styleUrls: ['./chef-wallet.page.scss'],
})
export class ChefWalletPage implements OnInit {

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  walletInfo$: Observable<ChefWalletInfo>;
  walletInfo: ChefWalletInfo;

  currentTab: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController,
    private chefService: ChefService,
    ) { }

  ionViewWillEnter() {
    // this.store.dispatch(new FetchWalletInfo());
  }

  ngOnInit() {

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

    this.walletInfo$ = this.store.select(getChefWalletInfo);
    this.walletInfo$.subscribe(w => {
      this.walletInfo = { ...w };
    })

  }

  onClickWalletSettingButton(event) {
    // this.router.navigate(['/public/chef/wallet/info']);
  }

  activateWallet() {
    this.store.dispatch(new ActivateWallet());
  }

  goToDashboard() {
    this.store.dispatch(new RedirectToStripeDashboard())
  }

  updateWallet() {
    
  }

}
