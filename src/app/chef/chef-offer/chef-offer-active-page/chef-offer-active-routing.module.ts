import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOfferActiveListGuard } from './chef-offer-active.guard';
import { ChefOfferActivePage } from './chef-offer-active.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [ChefOfferActiveListGuard],
    component: ChefOfferActivePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefOfferActivePageRoutingModule {}