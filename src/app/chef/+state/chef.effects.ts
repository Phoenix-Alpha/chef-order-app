import { TranslateService } from '@ngx-translate/core';
import { Inject, Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  ChefRegister,
  ChefRegisterSuccess,
  ChefRegisterFailed,
  FetchChefDetail,
  ChefActionType,
  FetchChefDetailSuccess,
  FetchChefDetailFailed,
  UploadChefAvatar,
  UploadChefAvatarSuccess,
  UploadChefAvatarFailed,
  UpdateChefAvatar,
  UpdateChefAvatarFailed,
  UpdateChefAvatarSuccess,
  UpdateChefProfile,
  UpdateChefProfileSuccess,
  UpdateChefProfileFailed,
} from './chef.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { CHEF_LOCAL_STORAGE_KEY } from '../chef.tokens';
import { ChefService } from '../chef.service';
import { ChefState } from './chef.reducer';
import { FetchLoggedInUser } from 'src/app/auth/+state/auth.actions';

@Injectable()
export class ChefEffects {

  constructor(
    private actions$: Actions,
    private chefService: ChefService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private store: Store<ChefState>,
    private storageService: LocalStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    @Inject(CHEF_LOCAL_STORAGE_KEY) private localStorageKey,
    private translateService: TranslateService) { }

  @Effect()
  onFetchChefDetail = this.actions$.pipe(
    ofType<FetchChefDetail>(ChefActionType.FetchChefDetail),
    switchMap(action =>
      this.chefService.fetchChefDetail().pipe(
        map(t => new FetchChefDetailSuccess(t)),
        catchError(a => of(new FetchChefDetailFailed()))
      ))
  );

  @Effect()
  onChefRegister = this.actions$.pipe(
    ofType<ChefRegister>(ChefActionType.ChefRegister),
    switchMap(action =>
      this.chefService.register(action.registrationDetail)
      .pipe(
        switchMap(t => {
          console.log(t);
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          return [new ChefRegisterSuccess(t), new FetchLoggedInUser()];
        }),
        catchError(a => {
          console.log(a);
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          // let errorMessage = "Chef registration failed.";
          // if (a.status === 409 && a.error.message) {
          //   errorMessage = a.error.message;
          // }
          this.toastController.create({
            animated: true,
            message: "Chef registration failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new ChefRegisterFailed(a))
        })
      ))
  );

  @Effect()
  onUpdateChefProfile = this.actions$.pipe(
    ofType<UpdateChefProfile>(ChefActionType.UpdateChefProfile),
    switchMap(action =>
      this.chefService.updateProfile(action.request)
      .pipe(
        switchMap(t => {
          console.log(t);
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Chef profile updated successfully!",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateChefProfileSuccess(t));
        }),
        catchError(a => {
          console.log(a);
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Chef profile update failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateChefProfileFailed());
        })
      ))
  );


  @Effect()
  onUploadChefAvatar = this.actions$.pipe(
    ofType<UploadChefAvatar>(ChefActionType.UploadChefAvatar),
    switchMap(action =>
      this.chefService.uploadAvatar(action.file)
      .pipe(
        map(t => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Uploading complete",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return new UploadChefAvatarSuccess(t);
        }),
        catchError(a => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Uploading failed. Please try again.",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UploadChefAvatarFailed(a))
        })
      ))
  );

  @Effect()
  onUpdateChefAvatar = this.actions$.pipe(
    ofType<UpdateChefAvatar>(ChefActionType.UpdateChefAvatar),
    switchMap(action =>
      this.chefService.updateAvatar(action.file)
      .pipe(
        map(t => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          
          this.toastController.create({
            animated: true,
            message: "Uploading complete",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return new UpdateChefAvatarSuccess(t);
        }),
        catchError(a => {
          this.loadingController.getTop().then(loading => {
            if (loading) {
              loading.dismiss()
            }
          });
          this.toastController.create({
            animated: true,
            message: "Uploading failed. Please try again.",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateChefAvatarFailed(a))
        })
      ))
  );
}
