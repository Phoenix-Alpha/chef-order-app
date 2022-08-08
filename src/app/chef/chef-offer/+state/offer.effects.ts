import { TranslateService } from '@ngx-translate/core';
import { Inject, Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { OFFER_LOCAL_STORAGE_KEY } from '../offer.tokens';
import { FetchLoggedInUser } from 'src/app/auth/+state/auth.actions';
import { OfferService } from '../offer.service';
import { ChefOfferInfoDetail, OfferState } from './offer.reducer';
import { FetchOfferDetail, FetchOfferDetailFailed, FetchOfferDetailSuccess, FetchOffersByStatus, FetchOffersByStatusFailed, FetchOffersByStatusSuccess, InitializeChefOfferInfoDetail, InitializeChefOfferInfoDetailFromExisting, InitializeChefOfferInfoDetailFromExistingFailed, InitializeChefOfferInfoDetailFromExistingSuccess, OfferActionType, OfferCreate, OfferCreateFailed, OfferCreateSuccess, UpdateOffer, UpdateOfferFailed, UpdateOfferSuccess, UploadOfferPicture, UploadOfferPictureFailed, UploadOfferPictureSuccess } from './offer.actions';
import { OfferDetail, OfferStatus } from '../offer';

@Injectable()
export class OfferEffects {

  constructor(
    private actions$: Actions,
    private offerService: OfferService,
    private cognitoAuthService: CognitoAuthService,
    private router: Router,
    private store: Store<OfferState>,
    private storageService: LocalStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    @Inject(OFFER_LOCAL_STORAGE_KEY) private localStorageKey,
    private translateService: TranslateService) { }

  

  @Effect()
  onFetchOffersByStatus = this.actions$.pipe(
    ofType<FetchOffersByStatus>(OfferActionType.FetchOffersByStatus),
    switchMap(action =>
      this.offerService.fetchOffersByStatus(action.status).pipe(
        map(t => new FetchOffersByStatusSuccess(action.status, t)),
        catchError(a => of(new FetchOffersByStatusFailed()))
      ))
  );

  @Effect()
  onFetchOfferDetail = this.actions$.pipe(
    ofType<FetchOfferDetail>(OfferActionType.FetchOfferDetail),
    switchMap(action =>
      this.offerService.fetchOfferDetail(action.offerId).pipe(
        map(t => {
          const detail = this.offerDetailMapper(t);
          return new FetchOfferDetailSuccess(detail);
        }),
        catchError(a => of(new FetchOfferDetailFailed()))
      ))
  );

  @Effect()
  onInitializeChefOfferInfoDetailFromExisting = this.actions$.pipe(
    ofType<InitializeChefOfferInfoDetailFromExisting>(OfferActionType.InitializeChefOfferInfoDetailFromExisting),
    switchMap(action =>
      this.offerService.fetchOfferDetail(action.offerId).pipe(
        map(t => {
          const detail = this.offerDetailMapper(t);
          detail.offerId = -1;
          return new InitializeChefOfferInfoDetailFromExistingSuccess(detail);
        }),
        catchError(a => of(new InitializeChefOfferInfoDetailFromExistingFailed()))
      ))
  );



  @Effect()
  onOfferCreate = this.actions$.pipe(
    ofType<OfferCreate>(OfferActionType.OfferCreate),
    switchMap(action =>
      this.offerService.create(action.offerCreateRequest)
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
            message: "New offer created successfully!",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          this.router.navigate(['/public/chef/dashboard'])
          return [new OfferCreateSuccess(t), new InitializeChefOfferInfoDetail()];
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
            message: "Offer creation failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new OfferCreateFailed(a))
        })
      ))
  );

  @Effect()
  onUpdateOffer = this.actions$.pipe(
    ofType<UpdateOffer>(OfferActionType.UpdateOffer),
    switchMap(action =>
      this.offerService.update(action.request)
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
            message: "Offer updated successfully!",
            duration: 1500,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          this.router.navigate(['/public/chef/dashboard'])
          return [new UpdateOfferSuccess(t), new InitializeChefOfferInfoDetail()];
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
            message: "Offer update failed.",
            duration: 3000,
            position: "middle",
          }).then(toast => {
            toast.present();
          });
          return of(new UpdateOfferFailed(a))
        })
      ))
  );

  

  @Effect()
  onUploadOfferPicture = this.actions$.pipe(
    ofType<UploadOfferPicture>(OfferActionType.UploadOfferPicture),
    switchMap(action =>
      this.offerService.uploadOfferPicture(action.imageData)
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
          return new UploadOfferPictureSuccess(t);
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
          return of(new UploadOfferPictureFailed(a))
        })
      ))
  );

  offerDetailMapper(r: OfferDetail): ChefOfferInfoDetail {
    let detail: ChefOfferInfoDetail = {
      offerId: r.offerId,
      generalInfo: {
        email: '',
        status: r.status,
        title: r.title,
        description: r.description,
        offerPicture1: r.offerPictures[0],
        offerPicture2: r.offerPictures[1],
        offerPicture3: r.offerPictures[2],
        isValid: r.status == OfferStatus.ACTIVE ? true : false,
      },
      dishDetailInfo: {
        cuisines: r.cuisines,
        tags: r.tags,
        allergens: r.allergens,
        weight: r.weight,
        offerType: r.offerType,
        servingStart: r.servingStart,
        servingEnd: r.servingEnd,
        orderUntil: r.orderUntil,
        minPreorderHours: r.minPreorderHours,
        maxQuantity: r.maxQuantity,
        isValid: r.status == OfferStatus.ACTIVE ? true : false,
      },
      deliveryOptionsInfo: {
        isPickup: r.isPickup,
        isDelivery: r.isDelivery,
        servingAddress: r.servingAddress,
        servingPostcode: r.servingPostcode,
        servingCity: r.servingCity,
        zone1MaxDistance: r.zones[0]?.maxDistance,
        zone1DeliveryPrice: r.zones[0]?.deliveryPrice,
        zone2MaxDistance: r.zones[1]?.maxDistance,
        zone2DeliveryPrice: r.zones[1]?.deliveryPrice,
        zone3MaxDistance: r.zones[2]?.maxDistance,
        zone3DeliveryPrice: r.zones[2]?.deliveryPrice,
        minFreeDeliveryAmount: r.minFreeDeliveryAmount,
        isValid: r.status == OfferStatus.ACTIVE ? true : false,
      },
      priceInfo: {
        price: r.price,
        isValid: r.status == OfferStatus.ACTIVE ? true : false,
      }
    }
    console.log("mapper: ", r, detail);
    return detail;
  }
}
