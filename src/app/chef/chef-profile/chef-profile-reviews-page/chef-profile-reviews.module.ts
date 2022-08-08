import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChefProfileReviewsPage } from './chef-profile-reviews.page';
import { ChefProfileReviewsPageRoutingModule } from './chef-profile-reviews-routing.module';
import { BarRatingModule } from 'ngx-bar-rating';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    BarRatingModule,
    ChefProfileReviewsPageRoutingModule,
  ],
  declarations: [ 
    ChefProfileReviewsPage
  ]
})
export class ChefProfileReviewsModule {}