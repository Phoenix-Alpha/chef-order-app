import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { AvatarPopoverComponent } from 'src/app/shared/avatar-popover-component/avatar-popover.component';
import { environment } from 'src/environments/environment';
import { OfferCreate, SaveOfferGeneralInfo, UpdateOffer, UploadOfferPicture } from '../+state/offer.actions';
import { ChefOfferInfoDetail, ChefOfferGeneralInfoDetail } from '../+state/offer.reducer';
import { getOfferCreateDetailInfo, getOfferCreateGeneralInfo, getOfferCreateStatus } from '../+state/offer.selectors';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';
import { Camera, CameraOptions, CameraPopoverOptions, PictureSourceType, DestinationType, EncodingType, MediaType } from '@ionic-native/camera/ngx';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ChefOfferCreateRequest, ChefUpdateOfferRequest, OfferStatus } from '../offer';
import { TagResourceCommand } from '@aws-sdk/client-cognito-identity';
import { ViewerModalComponent } from 'src/app/shared/image-viewer-modal/viewer-modal.component';

@Component({
  selector: 'app-offer-page',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  validation_messages = {
    'title': [
      { type: 'required', message: 'validation.chef.profileName.required' },
      { type: 'maxlength', message: 'validation.chef.profileName.maxLength' },
    ],
    'description': [
      { type: 'required', message: 'validation.chef.aboutMe.required' },
      { type: 'maxlength', message: 'validation.chef.aboutMe.maxLength' },
    ],
  }
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  offerGeneralInfoForm: FormGroup;
  offerPictures: string[] = [];

  offerInfo$: Observable<ChefOfferInfoDetail>;
  offerInfo: ChefOfferInfoDetail;

  imageData: any;

  registrationStatus$: Observable<string>;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    private camera: Camera,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.offerGeneralInfoForm = this.fb.group({
      title: ['', Validators.compose([ Validators.required, Validators.maxLength(32) ])],
      description: ['', Validators.compose([ Validators.required, Validators.maxLength(64) ])],
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

    this.offerInfo$ = this.store.select(getOfferCreateDetailInfo);
    this.offerInfo$.subscribe(s => {
      this.offerInfo = { ...s };
      console.log('offerInfo: ', this.offerInfo);
      this.title.setValue(this.offerInfo.generalInfo.title, { emitEvent: false });
      this.description.setValue(this.offerInfo.generalInfo.description, { emitEvent: false });

      this.offerPictures = [];
      if (this.offerInfo.generalInfo.offerPicture1) {
        this.offerPictures.push(this.offerInfo.generalInfo.offerPicture1);
      }
      if (this.offerInfo.generalInfo.offerPicture2) {
        this.offerPictures.push(this.offerInfo.generalInfo.offerPicture2);
      }
      if (this.offerInfo.generalInfo.offerPicture3) {
        this.offerPictures.push(this.offerInfo.generalInfo.offerPicture3);
      }

    });

    this.registrationStatus$ = this.store.select(getOfferCreateStatus);

    this.offerGeneralInfoForm.valueChanges.subscribe(() => {
      let newGeneralInfo = { ...this.offerInfo.generalInfo };
      newGeneralInfo.title = this.title.value;
      newGeneralInfo.description = this.description.value;
      newGeneralInfo.isValid = newGeneralInfo.offerPicture1 && this.offerGeneralInfoForm.valid ? true : false;
      this.store.dispatch(new SaveOfferGeneralInfo(newGeneralInfo));
    });
  }
  
  async onPublishDraftOffer() {
    if (this.offerInfo.generalInfo.status === OfferStatus.DRAFT) {
      this.offerGeneralInfoForm.markAllAsTouched();
      if (this.offerGeneralInfoForm.valid) {
        let newGeneralInfo = { ...this.offerInfo.generalInfo };
        newGeneralInfo.title = this.title.value;
        newGeneralInfo.description = this.description.value;
        newGeneralInfo.isValid = newGeneralInfo.offerPicture1 ? true : false;
        this.store.dispatch(new SaveOfferGeneralInfo(newGeneralInfo))

        if (this.offerInfo.generalInfo.isValid 
          && this.offerInfo.dishDetailInfo.isValid 
          && this.offerInfo.deliveryOptionsInfo.isValid 
          && this.offerInfo.priceInfo.isValid
          && this.offerInfo.offerId > 0
          && this.loggedInUser && this.loggedInUser.email
          && this.offerInfo.generalInfo.offerPicture1) {
          const loading = await this.loadingController.create({
            message: 'Just a moment...',
            backdropDismiss: true,
          });
          loading.present();
          
          let request: ChefUpdateOfferRequest = {
            email: this.loggedInUser.email,
            offerId: this.offerInfo.offerId,
            title: this.offerInfo.generalInfo.title,
            description: this.offerInfo.generalInfo.description,
            offerPicture1: this.offerInfo.generalInfo.offerPicture1,
            status: OfferStatus.ACTIVE,
            offerType: this.offerInfo.dishDetailInfo.offerType,
            weight: this.offerInfo.dishDetailInfo.weight,
            servingStart: this.offerInfo.dishDetailInfo.servingStart,
            servingEnd: this.offerInfo.dishDetailInfo.servingEnd,
            orderUntil: this.offerInfo.dishDetailInfo.orderUntil,
            tags: [ ...this.offerInfo.dishDetailInfo.tags ],
            cuisines: [ ...this.offerInfo.dishDetailInfo.cuisines ],
            allergens: [ ...this.offerInfo.dishDetailInfo.allergens ],
            maxQuantity: this.offerInfo.dishDetailInfo.maxQuantity,
            quantityAvailable: this.offerInfo.dishDetailInfo.maxQuantity,
            minPreorderHours: this.offerInfo.dishDetailInfo.minPreorderHours,
            zone1MaxDistance: this.offerInfo.deliveryOptionsInfo.zone1MaxDistance,
            zone1DeliveryPrice: this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice,
            isPickup: this.offerInfo.deliveryOptionsInfo.isPickup,
            isDelivery: this.offerInfo.deliveryOptionsInfo.isDelivery,
            servingAddress: this.offerInfo.deliveryOptionsInfo.servingAddress,
            servingCity: this.offerInfo.deliveryOptionsInfo.servingCity,
            servingPostcode: this.offerInfo.deliveryOptionsInfo.servingPostcode,
            minFreeDeliveryAmount: this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount,
            price: this.offerInfo.priceInfo.price,
          }

          if (this.offerInfo.deliveryOptionsInfo.zone2MaxDistance && this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice) {
            request["zone2MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone2MaxDistance;
            request["zone2DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice;
          }
          if (this.offerInfo.deliveryOptionsInfo.zone3MaxDistance && this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice) {
            request["zone3MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone3MaxDistance;
            request["zone3DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice;
          }

          if (this.offerInfo.generalInfo.offerPicture2) {
            request["offerPicture2"] = this.offerInfo.generalInfo.offerPicture2;
          }
          if (this.offerInfo.generalInfo.offerPicture1) {
            request["offerPicture3"] = this.offerInfo.generalInfo.offerPicture3;
          }
          this.store.dispatch(new UpdateOffer(request));
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
          message: "Please fill in required fields and try again.",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    }

  }

  async onSaveDraftOffer() {
    if (this.offerInfo.generalInfo.status === OfferStatus.DRAFT) {
      this.offerGeneralInfoForm.markAllAsTouched();

      let newGeneralInfo = { ...this.offerInfo.generalInfo };
      newGeneralInfo.title = this.title.value;
      newGeneralInfo.description = this.description.value;
      newGeneralInfo.isValid = newGeneralInfo.offerPicture1 ? true : false;
      console.log(this.offerInfo);
      this.store.dispatch(new SaveOfferGeneralInfo(newGeneralInfo))

      if (this.offerGeneralInfoForm.valid) {
        const loading = await this.loadingController.create({
          message: 'Just a moment...',
        });
        loading.present();
        
        let request: ChefUpdateOfferRequest = {
          email: this.loggedInUser.email,
          offerId: this.offerInfo.offerId,
          status: OfferStatus.DRAFT,
          offerType: this.offerInfo.dishDetailInfo.offerType,
          isPickup: this.offerInfo.deliveryOptionsInfo.isPickup,
          isDelivery: this.offerInfo.deliveryOptionsInfo.isDelivery,
          tags: [ ...this.offerInfo.dishDetailInfo.tags ],
          cuisines: [ ...this.offerInfo.dishDetailInfo.cuisines ],
          allergens: [ ...this.offerInfo.dishDetailInfo.allergens ],
          price: this.offerInfo.priceInfo.price,
        }
    
        if (this.offerInfo.generalInfo.title) {
          request["title"] = this.offerInfo.generalInfo.title;
        }
        if (this.offerInfo.generalInfo.description) {
          request["description"] = this.offerInfo.generalInfo.description;
        }
        if (this.offerInfo.generalInfo.offerPicture1) {
          request["offerPicture1"] = this.offerInfo.generalInfo.offerPicture1;
        }
        if (this.offerInfo.generalInfo.offerPicture2) {
          request["offerPicture2"] = this.offerInfo.generalInfo.offerPicture2;
        }
        if (this.offerInfo.generalInfo.offerPicture1) {
          request["offerPicture3"] = this.offerInfo.generalInfo.offerPicture3;
        }
    
        if (this.offerInfo.dishDetailInfo.offerType) {
          request["offerType"] = this.offerInfo.dishDetailInfo.offerType;
        }
        if (this.offerInfo.dishDetailInfo.weight) {
          request["weight"] = this.offerInfo.dishDetailInfo.weight;
        }
        if (this.offerInfo.dishDetailInfo.servingStart) {
          request["servingStart"] = this.offerInfo.dishDetailInfo.servingStart;
        }
        if (this.offerInfo.dishDetailInfo.servingEnd) {
          request["servingEnd"] = this.offerInfo.dishDetailInfo.servingEnd;
        }
        if (this.offerInfo.dishDetailInfo.orderUntil) {
          request["orderUntil"] = this.offerInfo.dishDetailInfo.orderUntil;
        }
        if (this.offerInfo.dishDetailInfo.maxQuantity) {
          request["maxQuantity"] = this.offerInfo.dishDetailInfo.maxQuantity;
          request["quantityAvailable"] = this.offerInfo.dishDetailInfo.maxQuantity;
        }
        if (this.offerInfo.dishDetailInfo.minPreorderHours) {
          request["minPreorderHours"] = this.offerInfo.dishDetailInfo.minPreorderHours;
        }
    
        if (this.offerInfo.deliveryOptionsInfo.zone1MaxDistance && this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice) {
          request["zone1MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone1MaxDistance;
          request["zone1DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice;
        }
        if (this.offerInfo.deliveryOptionsInfo.zone2MaxDistance && this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice) {
          request["zone2MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone2MaxDistance;
          request["zone2DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice;
        }
        if (this.offerInfo.deliveryOptionsInfo.zone3MaxDistance && this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice) {
          request["zone3MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone3MaxDistance;
          request["zone3DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice;
        }
        if (this.offerInfo.deliveryOptionsInfo.servingAddress) {
          request["servingAddress"] = this.offerInfo.deliveryOptionsInfo.servingAddress;
        }
        if (this.offerInfo.deliveryOptionsInfo.servingCity) {
          request["servingCity"] = this.offerInfo.deliveryOptionsInfo.servingCity;
        }
        if (this.offerInfo.deliveryOptionsInfo.servingPostcode) {
          request["servingPostcode"] = this.offerInfo.deliveryOptionsInfo.servingPostcode;
        }
        if (this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount) {
          request["minFreeDeliveryAmount"] = this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount;
        }

        this.store.dispatch(new UpdateOffer(request));
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
  }

  async onSaveActiveOffer() {
    if (this.offerInfo.generalInfo.status === OfferStatus.ACTIVE) { 
      this.offerGeneralInfoForm.markAllAsTouched();
      if (this.offerGeneralInfoForm.valid) {
        let newGeneralInfo = { ...this.offerInfo.generalInfo };
        newGeneralInfo.title = this.title.value;
        newGeneralInfo.description = this.description.value;
        newGeneralInfo.isValid = newGeneralInfo.offerPicture1 ? true : false;
        this.store.dispatch(new SaveOfferGeneralInfo(newGeneralInfo))

        if (this.offerInfo.generalInfo.isValid 
          && this.offerInfo.dishDetailInfo.isValid 
          && this.offerInfo.deliveryOptionsInfo.isValid 
          && this.offerInfo.priceInfo.isValid
          && this.offerInfo.offerId > 0
          && this.loggedInUser && this.loggedInUser.email
          && this.offerInfo.generalInfo.offerPicture1) {
          const loading = await this.loadingController.create({
            message: 'Just a moment...',
            backdropDismiss: true,
          });
          loading.present();
          
          let request: ChefUpdateOfferRequest = {
            email: this.loggedInUser.email,
            offerId: this.offerInfo.offerId,
            title: this.offerInfo.generalInfo.title,
            description: this.offerInfo.generalInfo.description,
            offerPicture1: this.offerInfo.generalInfo.offerPicture1,
            status: this.offerInfo.generalInfo.status,
            offerType: this.offerInfo.dishDetailInfo.offerType,
            weight: this.offerInfo.dishDetailInfo.weight,
            servingStart: this.offerInfo.dishDetailInfo.servingStart,
            servingEnd: this.offerInfo.dishDetailInfo.servingEnd,
            orderUntil: this.offerInfo.dishDetailInfo.orderUntil,
            tags: [ ...this.offerInfo.dishDetailInfo.tags ],
            cuisines: [ ...this.offerInfo.dishDetailInfo.cuisines ],
            allergens: [ ...this.offerInfo.dishDetailInfo.allergens ],
            maxQuantity: this.offerInfo.dishDetailInfo.maxQuantity,
            quantityAvailable: this.offerInfo.dishDetailInfo.maxQuantity,
            minPreorderHours: this.offerInfo.dishDetailInfo.minPreorderHours,
            zone1MaxDistance: this.offerInfo.deliveryOptionsInfo.zone1MaxDistance,
            zone1DeliveryPrice: this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice,
            isPickup: this.offerInfo.deliveryOptionsInfo.isPickup,
            isDelivery: this.offerInfo.deliveryOptionsInfo.isDelivery,
            servingAddress: this.offerInfo.deliveryOptionsInfo.servingAddress,
            servingCity: this.offerInfo.deliveryOptionsInfo.servingCity,
            servingPostcode: this.offerInfo.deliveryOptionsInfo.servingPostcode,
            minFreeDeliveryAmount: this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount,
            price: this.offerInfo.priceInfo.price,
          }

          if (this.offerInfo.deliveryOptionsInfo.zone2MaxDistance && this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice) {
            request["zone2MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone2MaxDistance;
            request["zone2DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice;
          }
          if (this.offerInfo.deliveryOptionsInfo.zone3MaxDistance && this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice) {
            request["zone3MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone3MaxDistance;
            request["zone3DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice;
          }

          if (this.offerInfo.generalInfo.offerPicture2) {
            request["offerPicture2"] = this.offerInfo.generalInfo.offerPicture2;
          }
          if (this.offerInfo.generalInfo.offerPicture1) {
            request["offerPicture3"] = this.offerInfo.generalInfo.offerPicture3;
          }
          this.store.dispatch(new UpdateOffer(request));
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
          message: "Please fill in required fields and try again.",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    }
  }

  async onPublishOffer() {
    this.offerGeneralInfoForm.markAllAsTouched();
    if (this.offerGeneralInfoForm.valid) {
      let newGeneralInfo = { ...this.offerInfo.generalInfo };
      newGeneralInfo.title = this.title.value;
      newGeneralInfo.description = this.description.value;
      newGeneralInfo.isValid = newGeneralInfo.offerPicture1 ? true : false;
      this.store.dispatch(new SaveOfferGeneralInfo(newGeneralInfo))

      if (this.offerInfo.generalInfo.isValid 
        && this.offerInfo.dishDetailInfo.isValid 
        && this.offerInfo.deliveryOptionsInfo.isValid 
        && this.offerInfo.priceInfo.isValid 
        && this.loggedInUser && this.loggedInUser.email
        && this.offerInfo.generalInfo.offerPicture1) {
        const loading = await this.loadingController.create({
          message: 'Just a moment...',
        });
        loading.present();
        
        let request: ChefOfferCreateRequest = {
          email: this.loggedInUser.email,
          title: this.offerInfo.generalInfo.title,
          description: this.offerInfo.generalInfo.description,
          offerPicture1: this.offerInfo.generalInfo.offerPicture1,
          status: OfferStatus.ACTIVE,
          offerType: this.offerInfo.dishDetailInfo.offerType,
          weight: this.offerInfo.dishDetailInfo.weight,
          servingStart: this.offerInfo.dishDetailInfo.servingStart,
          servingEnd: this.offerInfo.dishDetailInfo.servingEnd,
          orderUntil: this.offerInfo.dishDetailInfo.orderUntil,
          tags: [ ...this.offerInfo.dishDetailInfo.tags ],
          cuisines: [ ...this.offerInfo.dishDetailInfo.cuisines ],
          allergens: [ ...this.offerInfo.dishDetailInfo.allergens ],
          maxQuantity: this.offerInfo.dishDetailInfo.maxQuantity,
          minPreorderHours: this.offerInfo.dishDetailInfo.minPreorderHours,
          zone1MaxDistance: this.offerInfo.deliveryOptionsInfo.zone1MaxDistance,
          zone1DeliveryPrice: this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice,
          isPickup: this.offerInfo.deliveryOptionsInfo.isPickup,
          isDelivery: this.offerInfo.deliveryOptionsInfo.isDelivery,
          servingAddress: this.offerInfo.deliveryOptionsInfo.servingAddress,
          servingCity: this.offerInfo.deliveryOptionsInfo.servingCity,
          servingPostcode: this.offerInfo.deliveryOptionsInfo.servingPostcode,
          minFreeDeliveryAmount: this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount,
          price: this.offerInfo.priceInfo.price,
        }

        if (this.offerInfo.deliveryOptionsInfo.zone2MaxDistance && this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice) {
          request["zone2MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone2MaxDistance;
          request["zone2DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice;
        }
        if (this.offerInfo.deliveryOptionsInfo.zone3MaxDistance && this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice) {
          request["zone3MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone3MaxDistance;
          request["zone3DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice;
        }

        if (this.offerInfo.generalInfo.offerPicture2) {
          request["offerPicture2"] = this.offerInfo.generalInfo.offerPicture2;
        }
        if (this.offerInfo.generalInfo.offerPicture1) {
          request["offerPicture3"] = this.offerInfo.generalInfo.offerPicture3;
        }
        this.store.dispatch(new OfferCreate(request));
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
        message: "Please fill in required fields and try again.",
        duration: 2000,
        position: "middle",
      }).then(toast => {
        toast.present();
      });
    }
  }

  async onSaveInDraft() {
    this.offerGeneralInfoForm.markAllAsTouched();

    let newGeneralInfo = { ...this.offerInfo.generalInfo };
    newGeneralInfo.title = this.title.value;
    newGeneralInfo.description = this.description.value;
    newGeneralInfo.isValid = newGeneralInfo.offerPicture1 ? true : false;
    console.log(this.offerInfo);
    this.store.dispatch(new SaveOfferGeneralInfo(newGeneralInfo))

    if (this.offerGeneralInfoForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Just a moment...',
      });
      loading.present();
      
      let request: ChefOfferCreateRequest = {
        email: this.loggedInUser.email,
        status: OfferStatus.DRAFT,
        offerType: this.offerInfo.dishDetailInfo.offerType,
        isPickup: this.offerInfo.deliveryOptionsInfo.isPickup,
        isDelivery: this.offerInfo.deliveryOptionsInfo.isDelivery,
        tags: [ ...this.offerInfo.dishDetailInfo.tags ],
        cuisines: [ ...this.offerInfo.dishDetailInfo.cuisines ],
        allergens: [ ...this.offerInfo.dishDetailInfo.allergens ],
        price: this.offerInfo.priceInfo.price,
      }
  
      if (this.offerInfo.generalInfo.title) {
        request["title"] = this.offerInfo.generalInfo.title;
      }
      if (this.offerInfo.generalInfo.description) {
        request["description"] = this.offerInfo.generalInfo.description;
      }
      if (this.offerInfo.generalInfo.offerPicture1) {
        request["offerPicture1"] = this.offerInfo.generalInfo.offerPicture1;
      }
      if (this.offerInfo.generalInfo.offerPicture2) {
        request["offerPicture2"] = this.offerInfo.generalInfo.offerPicture2;
      }
      if (this.offerInfo.generalInfo.offerPicture1) {
        request["offerPicture3"] = this.offerInfo.generalInfo.offerPicture3;
      }
  
      if (this.offerInfo.dishDetailInfo.offerType) {
        request["offerType"] = this.offerInfo.dishDetailInfo.offerType;
      }
      if (this.offerInfo.dishDetailInfo.weight) {
        request["weight"] = this.offerInfo.dishDetailInfo.weight;
      }
      if (this.offerInfo.dishDetailInfo.servingStart) {
        request["servingStart"] = this.offerInfo.dishDetailInfo.servingStart;
      }
      if (this.offerInfo.dishDetailInfo.servingEnd) {
        request["servingEnd"] = this.offerInfo.dishDetailInfo.servingEnd;
      }
      if (this.offerInfo.dishDetailInfo.orderUntil) {
        request["orderUntil"] = this.offerInfo.dishDetailInfo.orderUntil;
      }
      if (this.offerInfo.dishDetailInfo.maxQuantity) {
        request["maxQuantity"] = this.offerInfo.dishDetailInfo.maxQuantity;
      }
      if (this.offerInfo.dishDetailInfo.minPreorderHours) {
        request["minPreorderHours"] = this.offerInfo.dishDetailInfo.minPreorderHours;
      }
  
      if (this.offerInfo.deliveryOptionsInfo.zone1MaxDistance && this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice) {
        request["zone1MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone1MaxDistance;
        request["zone1DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone1DeliveryPrice;
      }
      if (this.offerInfo.deliveryOptionsInfo.zone2MaxDistance && this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice) {
        request["zone2MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone2MaxDistance;
        request["zone2DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone2DeliveryPrice;
      }
      if (this.offerInfo.deliveryOptionsInfo.zone3MaxDistance && this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice) {
        request["zone3MaxDistance"] = this.offerInfo.deliveryOptionsInfo.zone3MaxDistance;
        request["zone3DeliveryPrice"] = this.offerInfo.deliveryOptionsInfo.zone3DeliveryPrice;
      }
      if (this.offerInfo.deliveryOptionsInfo.servingAddress) {
        request["servingAddress"] = this.offerInfo.deliveryOptionsInfo.servingAddress;
      }
      if (this.offerInfo.deliveryOptionsInfo.servingCity) {
        request["servingCity"] = this.offerInfo.deliveryOptionsInfo.servingCity;
      }
      if (this.offerInfo.deliveryOptionsInfo.servingPostcode) {
        request["servingPostcode"] = this.offerInfo.deliveryOptionsInfo.servingPostcode;
      }
      if (this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount) {
        request["minFreeDeliveryAmount"] = this.offerInfo.deliveryOptionsInfo.minFreeDeliveryAmount;
      }
      this.store.dispatch(new OfferCreate(request));
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

  onClickTips() {
    
  }

  get title() {
    return this.offerGeneralInfoForm.get('title');
  }

  get description() {
    return this.offerGeneralInfoForm.get('description');
  }

  async uploadPicture() {
    if (this.offerInfo && this.offerInfo.generalInfo) {
      if (!this.offerInfo.generalInfo.offerPicture1 || !this.offerInfo.generalInfo.offerPicture2 || !this.offerInfo.generalInfo.offerPicture3) {
        const popover = await this.popoverController.create({
          component: AvatarPopoverComponent,
          cssClass: 'avatar-popover-class'
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
        if (data?.mode) {
          if (data.mode == 'PhotoGallery') {
            this.getAvatarFromPhotoGallery();
          } else if (data.mode == 'Camera') {
            this.getAvatarFromCamera();
          }
        }
      } else {
        this.toastController.create({
          animated: true,
          message: "You can upload up to 3 pictures",
          duration: 2000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      }
    }
  }

  async getAvatarFromPhotoGallery() {
    var options = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then(image => {
      this.imageData = "data:image/png;base64," + image;
      this.store.dispatch(new UploadOfferPicture(this.imageData));
    }).catch(err => {
      console.log(err);
    });
    // var options = {
    //   quality: 50,
    //   correctOrientation: true,
    //   source: CameraSource.Photos,
    //   resultType: CameraResultType.Base64, 
    // }
    // Camera.getPhoto(options).then(image => {
    //   console.log("capacitor camera: ", image);
    //   this.imageData = `data:image/${image.format};base64,` + image.base64String;
    //   this.store.dispatch(new UploadOfferPicture(this.imageData));
    // }).catch(err => {
    //   console.error(err);
    // })
  }

  async getAvatarFromCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(async image => {
      this.imageData = "data:image/png;base64," + image;
      this.store.dispatch(new UploadOfferPicture(this.imageData));
    }).catch(err => {
      console.log(err);
    })
    // var options = {
    //   quality: 50,
    //   correctOrientation: true,
    //   source: CameraSource.Camera,
    //   resultType: CameraResultType.Base64, 
    // }
    // Camera.getPhoto(options).then(image => {
    //   console.log("capacitor camera: ", image);
    //   this.imageData = `data:image/${image.format};base64,` + image.base64String;
    //   this.store.dispatch(new UploadOfferPicture(this.imageData));
    // }).catch(err => {
    //   console.error(err);
    // })
  }

  async onClickSlides() {
    if (this.offerPictures.length > 0) {
      const modal = await this.modalController.create({
        component: ViewerModalComponent,
        componentProps: {
          src: this.offerPictures,
          srcFallback: '',
          srcHighRes: '',
          title: this.offerInfo.generalInfo.title,
          titleSize: 16,
          text: '',
          scheme: 'dark',
          slideOptions: {},
          swipeToClose: true,
        },
        cssClass: ['ion-img-viewer'],
        keyboardClose: true,
        showBackdrop: true
      });
      modal.present();
    } else {
      console.log("No offer picture available and viewer modal not opening...");
    }
  }

  get OfferStatus(): typeof OfferStatus {
    return OfferStatus;
  }
}