import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { CognitoAuthService } from './auth/cognito-auth.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AndroidNotch } from '@ionic-native/android-notch/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CognitoAccessToken, CognitoIdToken, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoggedInUser } from './auth/auth';
import { ChefDetail } from './chef/chef';
import { getLoggedInUser } from './auth/+state/auth.selectors';
import { getChefDetail } from './chef/+state/chef.selectors';
import { Logout } from './auth/+state/auth.actions';
import { StripeService } from './stripe.service';
import { environment } from 'src/environments/environment';
import { SplashScreen } from '@capacitor/splash-screen';

declare var window;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  @ViewChild('languageBtn', {static: true}) languageBtn: any;

  session$: Observable<CognitoUserSession>;
  session: CognitoUserSession;

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  isAuthenticated$: Observable<boolean>;

  private destroy$ = new Subject();

  languages = {
    'en': 'global.language.english',
    'fr': 'global.language.french',
    'nl': 'global.language.dutch',
    'de': 'global.language.german',
  };

  currentLanguage: string = this.languages['fr'];

  constructor(private cognitoAuthService: CognitoAuthService,
              protected platform: Platform,
              private deeplinks: Deeplinks,
              private androidNotch: AndroidNotch,
              private router: Router,
              private ngZone: NgZone,
              private toastController: ToastController,
              // private statusBar: StatusBar,
              private stripeService: StripeService,
              private store: Store<any>,) { }

  private checkSoftButton(){
    console.log(screen)
    console.log(this.platform.height())
    const softButton = (screen.height - this.platform.height());
    console.error("softButton: ", softButton);
    const body : any = document.querySelectorAll('body');
    body.forEach((e:any)=>{
      e.classList.add('soft-button');
      e.style= '--ion-soft-button:' + softButton + 'px';
    });
  }

  detectInsets() {
    const style = document.documentElement.style;
    // Apply insets as css variables
    this.androidNotch.getInsetTop()
    .then(px => {
      style.setProperty("--notch-inset-top", Math.max(px, 30) + "px");
    })
    .catch(err => {
      console.error("Failed to get insets top:", err);
    });

    this.androidNotch.getInsetRight()
    .then(px => {
      style.setProperty("--notch-inset-right", px + "px");
    })
    .catch(err => {
      console.error("Failed to get insets right:", err);
    });

    this.androidNotch.getInsetBottom()
    .then(px => {
      style.setProperty("--notch-inset-bottom", px + "px");
    })
    .catch(err => {
      console.error("Failed to get insets bottom:", err);
    });

    this.androidNotch.getInsetLeft().then(px => {
      style.setProperty("--notch-inset-left", px + "px");
    }).catch(err => {
      console.error("Failed to get insets left:", err);
    });
  }

  ngOnInit() {

    this.platform.ready().then(() => {
      console.log("splash hide")
      setTimeout(()=>{
        SplashScreen.hide({
          fadeOutDuration: 1000
        });
      }, 3000)

      StatusBar.setOverlaysWebView({ overlay: true });

      this.deeplinks.route({
        '/auth/google/login': {
          type: 'google-login'
        },
        '/auth/google/logout': {
          type: 'google-logout'
        },
        '/auth/facebook/login': {
          type: 'facebook-login'
        },
        '/auth/facebook/logout': {
          type: 'facebook-logout'
        },
        // '/public/checkout/success': {
        //   type: 'public-checkout-success'
        // },
        // '/public/checkout/failure': {
        //   type: 'public-checkout-failure'
        // },
        '/public/chef/wallet/return': {
          type: 'public-chef-wallet-return'
        },
        '/public/chef/wallet/refresh': {
          type: 'public-chef-wallet-refresh'
        },
      }).subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
        if (match.$route.type == "google-login" || match.$route.type == "facebook-login") {
          this.ngZone.run(() => this.router.navigate([ match.$link.path ], {
            queryParams: {
              authorization_code: match.$args.code
            }
          }));
        } else if (match.$route.type == "public-checkout-success") {
          if (match.$args.orderUuid && match.$args.orderNumber && match.$args.paymentStatus != 'unpaid') {
            this.ngZone.run(() => this.router.navigate(['/public/checkout/success'], {
              queryParams: {
                orderUuid: match.$args.orderUuid,
                orderNumber: match.$args.orderNumber
              }
            }));
          }
        } else if (match.$route.type == "public-checkout-failure") {
          if (match.$args.orderUuid && match.$args.orderNumber && match.$args.paymentStatus == 'unpaid') {
            this.ngZone.run(() => this.router.navigate(['/public/checkout/failure'], {
              queryParams: {
                orderUuid: match.$args.orderUuid,
                orderNumber: match.$args.orderNumber
              }
            }));
          }
        } else if (match.$route.type == "public-chef-wallet-return") {
          this.ngZone.run(() => this.router.navigate(['/public/chef/wallet/return']));
        } else if (match.$route.type == "public-chef-wallet-refresh") {
          // this.ngZone.run(() => this.router.navigate(['/public/chef/wallet/refresh']));
        }
      },
      (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });

      // Status bar, notch issues...
      // this.statusBar.overlaysWebView(true);
      // this.checkSoftButton();
      console.log(window)
      this.detectInsets();
      // if (window.navigationbar) {
      //   window.navigationbar.hideNavigationBar();
      // }

      // Stripe plugin initialization
      this.stripeService.initializeStripe(environment.stripePublishableKey);
    });

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
  }

  async onLogout() {
    this.store.dispatch(new Logout())
    const toast = await this.toastController.create({
      animated: true,
      message: "Logged out successfully!",
      duration: 3000,
      position: "middle",
    });
    toast.present();
  }

  getUserName() {
    return this.loggedInUser.firstName + " " + this.loggedInUser.lastName;
  }

  onClickMenuLanguageButton($event) {
    if (this.languageBtn.el) {
      this.languageBtn.el.click();
    }
  }
}
