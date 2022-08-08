import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferPage } from './offer.page';
import { PublicOfferPageGuard } from './public-offer.page.guard';

const routes: Routes = [
  {
    path: ':offerId',
    canActivate: [ PublicOfferPageGuard ],
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferPageRoutingModule {}
