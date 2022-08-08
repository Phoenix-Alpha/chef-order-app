import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefProfileReviewsPage } from './chef-profile-reviews.page';

const routes: Routes = [
  {
    path: '',
    component: ChefProfileReviewsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefProfileReviewsPageRoutingModule {}