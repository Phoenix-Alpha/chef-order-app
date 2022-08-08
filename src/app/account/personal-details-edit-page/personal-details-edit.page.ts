import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
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

@Component({
  selector: 'app-personal-details-edit-page',
  templateUrl: './personal-details-edit.page.html',
  styleUrls: ['./personal-details-edit.page.scss'],
})
export class PersonalDetailsEditPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  browserTimeZone: string;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<any>) {
  }

  ngOnInit() {
    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.pipe(
      filter(user => user.id > 0)
    ).subscribe(user => {
      this.loggedInUser = { ...user };
    });

    this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  onEdit() {
    this.router.navigate(['/public/account/personal-details']);
  }

}