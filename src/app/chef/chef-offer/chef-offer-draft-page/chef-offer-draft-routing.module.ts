import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOfferDraftListGuard } from './chef-offer-draft.guard';
import { ChefOfferDraftPage } from './chef-offer-draft.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [ChefOfferDraftListGuard],
    component: ChefOfferDraftPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefOfferDraftPageRoutingModule {}