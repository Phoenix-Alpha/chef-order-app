import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavParams, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UpdateChefAvatar } from 'src/app/chef/+state/chef.actions';
import { ChefState } from 'src/app/chef/+state/chef.reducer';
import { ImageCropperComponent } from 'src/app/ngx-image-cropper/component/image-cropper.component';

import { Dimensions, ImageCroppedEvent, ImageTransform } from '../../ngx-image-cropper/interfaces/index';
import { base64ToFile } from '../../ngx-image-cropper/utils/blob.utils';

@Component({
  selector: 'app-avatar-edit-popover-component',
  templateUrl: './avatar-edit-popover.component.html',
  styleUrls: ['./avatar-edit-popover.component.scss'],
})
export class AvatarEditPopoverComponent implements OnInit {
  
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  loadingStatus = 0;
  containWithinAspectRatio = false;
  readyToCrop = false;
  transform: ImageTransform = {};
  profilePictureUrl: string = "";

  constructor(private popoverController: PopoverController,
    private loadingController: LoadingController,
    private store: Store<ChefState>,
    private navParams: NavParams) { }

  ngOnInit() {
    this.loadingStatus = 0;
    this.readyToCrop = false;
    this.profilePictureUrl = this.navParams.data.profilePictureUrl;
    console.log("profilePictureUrl", this.profilePictureUrl);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  async imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // const loading = await this.loadingController.create({
    //   message: 'Uploading image...',
    // });
    // loading.present();
    this.store.dispatch(new UpdateChefAvatar(this.croppedImage));
  }

  imageLoaded() {
    this.loadingStatus = 1;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    this.readyToCrop = true;
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    this.loadingStatus = -1;
    // this.popoverController.dismiss();
    console.log('Load failed');
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  onClickEdit() {
    if (this.imageCropper) {
      this.popoverController.dismiss();
      this.imageCropper.crop();
    }
  }

  onClickUploadNew() {
    this.popoverController.dismiss({ mode: "UPLOADNEW" });
  }
}
