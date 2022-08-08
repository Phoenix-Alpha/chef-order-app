import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { AvatarEditPopoverComponent } from 'src/app/shared/avatar-edit-popover-component/avatar-edit-popover.component';
import { AvatarPopoverComponent } from 'src/app/shared/avatar-popover-component/avatar-popover.component';
import { environment } from 'src/environments/environment';
import { getChefDetail, getChefDetailStatus } from '../+state/chef.selectors';
import { ChefDetail } from '../chef';
import { Camera, CameraOptions, CameraPopoverOptions, PictureSourceType, DestinationType, EncodingType, MediaType } from '@ionic-native/camera/ngx';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { UpdateChefAvatar } from '../+state/chef.actions';

@Component({
  selector: 'app-chef-dashboard-page',
  templateUrl: './chef-dashboard.page.html',
  styleUrls: ['./chef-dashboard.page.scss'],
})
export class ChefDashboardPage implements OnInit {
  
  imageData: any;

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  chefDetailStatus$: Observable<string>;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private camera: Camera,
    private loadingController: LoadingController,
    private popoverController: PopoverController) { }

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
        console.log('chefDetail: ', this.chefDetail);
      } else {
        this.chefDetail = null;
      }
    })

    this.chefDetailStatus$ = this.store.select(getChefDetailStatus);
  }

  async onEditAvatar() {
    if (this.chefDetail.profilePicture) {
      const popover = await this.popoverController.create({
        component: AvatarEditPopoverComponent,
        cssClass: 'avatar-edit-popover-class',
        componentProps: {
          profilePictureUrl: this.chefDetail.profilePicture
        }
      });
      await popover.present();
      const { data } = await popover.onDidDismiss();
      if (data?.mode) {
        if (data.mode == 'UPLOADNEW') {
          await this.showSourceSelectionPopover();
        }
      }
    } else {
      await this.showSourceSelectionPopover();
    }
  }

  async showSourceSelectionPopover(){
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
      this.store.dispatch(new UpdateChefAvatar(this.imageData));
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
    //   this.store.dispatch(new UpdateChefAvatar(this.imageData));
    // }).catch(err => {
    //   console.error(err);
    // })
  }

  async getAvatarFromCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(image => {
      this.imageData = "data:image/png;base64," + image;
      this.store.dispatch(new UpdateChefAvatar(this.imageData));
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
    //   this.store.dispatch(new UpdateChefAvatar(this.imageData));
    // }).catch(err => {
    //   console.error(err);
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