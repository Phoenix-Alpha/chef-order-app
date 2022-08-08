import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPage } from 'src/app/shared/empty-page/empty.page';
import { ChefOfferPage } from './chef-offer.page';
import { NewOfferModePage } from './new-offer-mode-page/new-offer-mode.page';
import { OfferDeliveryOptionsPage } from './offer-delivery-options-page/offer-delivery-options.page';
import { OfferDishDetailPage } from './offer-dish-detail-page/offer-dish-detail.page';
import { OfferListPageGuard } from './offer-list.page.guard';
import { OfferPage } from './offer-page/offer.page';
import { OfferPageGuard } from './offer-page/offer.page.guard';
import { OfferPricePage } from './offer-price-page/offer-price.page';

const routes: Routes = [
  {
    path: 'list',
    component: ChefOfferPage,
    children: [
      {
        path: 'draft',
        loadChildren: () => import('./chef-offer-draft-page/chef-offer-draft.module').then(m => m.ChefOfferDraftModule)
      },
      {
        path: 'active',
        loadChildren: () => import('./chef-offer-active-page/chef-offer-active.module').then(m => m.ChefOfferActiveModule)
      },
      {
        path: 'archive',
        loadChildren: () => import('./chef-offer-archive-page/chef-offer-archive.module').then(m => m.ChefOfferArchiveModule)
      },
      {
        path: '',
        canActivate: [ OfferListPageGuard ],
        component: EmptyPage,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'new',
    component: NewOfferModePage,
    pathMatch: 'full',
  },
  {
    path: ':offerId',
    canActivate: [ OfferPageGuard ],
    component: OfferPage,
  },
  {
    path: ':offerId/dish-detail',
    component: OfferDishDetailPage,
  },
  {
    path: ':offerId/delivery-options',
    component: OfferDeliveryOptionsPage,
  },
  {
    path: ':offerId/price',
    component: OfferPricePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class ChefOfferPageRoutingModule {}