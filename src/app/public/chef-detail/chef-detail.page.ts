import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {ChefDetail} from '../../chef/chef';
import { AddFavouriteChef } from '../results-page/favourite/+state/favourite.actions';
import { getPublicChefDetail } from './+state/public-chef.selectors';
import { PublicChefDetail } from './chef';

@Component({
  selector: 'app-chef-detail',
  templateUrl: './chef-detail.page.html',
  styleUrls: ['./chef-detail.page.scss'],
})
export class ChefDetailPage implements OnInit {
  
  chefDetail$: Observable<PublicChefDetail>;
  chefDetail: PublicChefDetail;

  currentTab: string;

  constructor(private store: Store<any>,
    private toastController: ToastController) { }

  ngOnInit() {
    this.chefDetail$ = this.store.select(getPublicChefDetail);
    this.chefDetail$.subscribe(detail => {
      this.chefDetail = { ...detail };
    })
  }

  onClickShareButton($event: MouseEvent) {

  }

  onClickFavouriteButton($event: MouseEvent) {
    this.store.dispatch(new AddFavouriteChef(this.chefDetail));
    this.toastController.create({
      animated: true,
      message: `Chef ${this.chefDetail.profileName} added to the favourites successfully!`,
      duration: 3000,
      position: "middle",
    }).then(toast => {
      toast.present();
    });
  }

  tabWillChange($event: { tab: string }) {
    this.currentTab = $event.tab;
  }
}
