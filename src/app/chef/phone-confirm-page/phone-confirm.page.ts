import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { IonIntlTelInputValidators } from 'src/app/ion-intl-tel-input/ion-intl-tel-input.directive';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { CognitoCallback } from 'src/app/auth/cognito.service';
import { Store } from '@ngrx/store';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { take } from 'rxjs/operators';
import { UserPhoneVerificationRequest } from 'src/app/auth/auth';
import { ConfirmUserPhoneNumber } from 'src/app/auth/+state/auth.actions';

@Component({
  selector: 'app-phone-confirm-page',
  templateUrl: './phone-confirm.page.html',
  styleUrls: ['./phone-confirm.page.scss'],
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
// export class PhoneConfirmPage implements OnInit, CognitoCallback {
export class PhoneConfirmPage implements OnInit {
  
  loading: HTMLIonLoadingElement;
  confirmCode: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cognitoAuthService: CognitoAuthService,
    private loadingController: LoadingController,
    private store: Store<any>,
    private toastController: ToastController,
    private router: Router) { 
      
  }

  ngOnInit() {

  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.confirmCode = code;
  }

  async onClickPhoneCodeContinue() {
    if (this.confirmCode) {
      this.loading = await this.loadingController.create({
        message: 'Just a moment...',
      });
      this.loading.present();
      this.store.select(getLoggedInUser).pipe(take(1)).subscribe(user => {
        const request: UserPhoneVerificationRequest = {
          email: user.email,
          phoneVerificationCode: this.confirmCode,
        }
        this.store.dispatch(new ConfirmUserPhoneNumber(request));
      })
    }
  }

  // async onClickPhoneCodeContinue() {
  //   if (this.confirmCode) {
  //     this.loading = await this.loadingController.create({
  //       message: 'Just a moment...',
  //     });
  //     this.loading.present();
  //     this.cognitoAuthService.confirmPhoneNumber(this.confirmCode, this);
  //   }
  // }

  // async cognitoCallback(message: string, result: any) {
  //   // dismiss the loading...
  //   this.loadingController.dismiss();
  //   if (message != null) { //error
  //     console.log("message: " + message);
  //     const toast = await this.toastController.create({
  //       animated: true,
  //       message: message,
  //       duration: 3000,
  //     });
  //     toast.present();
  //   } else { //success
  //     const toast = await this.toastController.create({
  //       animated: true,
  //       message: "You are successfully registered. Please check the engagements information.",
  //       duration: 2000,
  //     });
  //     toast.present();
  //     console.log("Moving to engagement page", result);
  //     toast.onDidDismiss().then(eventDetail => {
  //       console.log(eventDetail);
  //       this.router.navigate(['/public/chef/engagements']);
  //     })
      
      
  //   }
  // }
}
