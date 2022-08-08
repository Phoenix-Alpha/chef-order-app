import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { CognitoAuthService } from 'src/app/auth/cognito-auth.service';
import { ChefRegister, PrepareChefRegister, UploadChefAvatar } from '../+state/chef.actions';
import { ChefState, RegistrationStatus } from '../+state/chef.reducer';
import { ChefRegistrationDetail } from '../chef';
import { Camera, CameraOptions, CameraPopoverOptions, PictureSourceType, DestinationType, EncodingType, MediaType } from '@ionic-native/camera/ngx';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { getRegistrationState, getRegistrationStatus } from '../+state/chef.selectors';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { combineLatest, Observable } from 'rxjs';
import { AvatarPopoverComponent } from 'src/app/shared/avatar-popover-component/avatar-popover.component';

@Component({
  selector: 'app-chef-promote-page',
  templateUrl: './chef-promote.page.html',
  styleUrls: ['./chef-promote.page.scss'],
})
export class ChefPromotePage implements OnInit {
  
  chefPromoteForm: FormGroup;

  imageData: any;

  validation_messages = {
    'profileName': [
      { type: 'required', message: 'validation.chef.profileName.required' },
      { type: 'minlength', message: 'validation.chef.profileName.minLength' },
      { type: 'maxlength', message: 'validation.chef.profileName.maxLength' },
    ],
    'aboutMe': [
      { type: 'required', message: 'validation.chef.aboutMe.required' },
      { type: 'minlength', message: 'validation.chef.aboutMe.minLength' },
      { type: 'maxlength', message: 'validation.chef.aboutMe.maxLength' },
    ],
    'cuisines': [
      { type: 'required', message: 'validation.chef.cuisines.required' },
    ],
    'sellPlan': [
      { type: 'required', message: 'validation.chef.cuisines.required' },
    ],
    'referalCode': [
    ],
  }

  chefRegistrationStatus$: Observable<RegistrationStatus>;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<ChefState>,
    private cognitoAuthService: CognitoAuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private camera: Camera,
    private router: Router) { }

  ngOnInit() {
    this.chefPromoteForm = this.fb.group({
      profileName: ['', Validators.compose([ Validators.required, Validators.minLength(5), Validators.maxLength(32) ])],
      aboutMe: ['', Validators.compose([ Validators.required, Validators.minLength(10), Validators.maxLength(256) ])],
      cuisines: ['', Validators.compose([ Validators.required, Validators.minLength(1) ])],
      sellPlan: ['', Validators.compose([ Validators.required ])],
      referalCode: [''],
    });

    this.chefRegistrationStatus$ = this.store.select(getRegistrationStatus);
  }

  async onSave() {
    this.chefPromoteForm.markAllAsTouched();
    console.log(this.chefPromoteForm);
    if (this.chefPromoteForm.valid) {
      combineLatest([
        this.store.select(getRegistrationState),
        this.store.select(getLoggedInUser)
      ]).pipe(take(1)).subscribe(([state, user]) => {
        const chefRegistrationDetail: ChefRegistrationDetail = {
          email: user.email,
          profilePicture: state.registrationDetail.profilePicture,
          profileName: this.profileName.value,
          aboutMe: this.aboutMe.value,
          cuisines: this.cuisines.value,
          sellPlan: this.sellPlan.value,
        };
        if (this.referalCode.value) {
          chefRegistrationDetail.referralCode = this.referalCode.value;
        }
        this.store.dispatch(new PrepareChefRegister(chefRegistrationDetail));
        this.router.navigate(['public/chef/phone-verification/send'])
      });
    }
  }

  get profileName() {
    return this.chefPromoteForm.get('profileName');
  }

  get aboutMe() {
    return this.chefPromoteForm.get('aboutMe');
  }

  get cuisines() {
    return this.chefPromoteForm.get('cuisines');
  }

  get sellPlan() {
    return this.chefPromoteForm.get('sellPlan');
  }

  get referalCode() {
    return this.chefPromoteForm.get('referalCode');
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
      this.store.dispatch(new UploadChefAvatar(this.imageData));
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
    //   this.store.dispatch(new UploadChefAvatar(this.imageData));
    // }).catch(err => {
    //   console.error(err);
    //   this.loadingController.getTop().then(el => {
    //     el.dismiss();
    //   })
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
      this.store.dispatch(new UploadChefAvatar(this.imageData));
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
    //   this.store.dispatch(new UploadChefAvatar(this.imageData));
    // }).catch(err => {
    //   console.error(err);
    //   this.loadingController.getTop().then(el => {
    //     el.dismiss();
    //   })
    // })
  }

  async onClickAvatar() {
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
  }

  
}
