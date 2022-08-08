import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOfferArchiveListGuard } from './chef-offer-archive.guard';
import { ChefOfferArchivePage } from './chef-offer-archive.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [ChefOfferArchiveListGuard],
    component: ChefOfferArchivePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefOfferArchivePageRoutingModule {}