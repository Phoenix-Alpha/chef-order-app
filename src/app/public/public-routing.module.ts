import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicInstructionGuard } from './public-instruction.guard';
import { HomePage } from './home-page/home.page';
import { InstructionPage } from './instruction-page/instruction.page';
import { WelcomePage } from './welcome-page/welcome-page';
import { LocationPermissionPage } from './location-permission-page/location-permission-page';
import { LocationPermissionGuard } from './location-permission.guard';
import { OfferMapPage } from './offer-map-page/offer-map.page';

const routes: Routes = [
  {
    path: '',
    component: LocationPermissionPage,
    canActivate: [ LocationPermissionGuard ],
    pathMatch: 'full'
  },
  {
    path: 'instruction',
    component: InstructionPage,
    canActivate: [ PublicInstructionGuard ],
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'welcome',
    component: WelcomePage,
  },
  {
    path: 'account',
    loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'chef',
    loadChildren: () => import('../chef/chef.module').then(m => m.ChefModule)
  },
  {
    path: 'offer/map',
    component: OfferMapPage,
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'transition',
    loadChildren: () => import('./transition-page/transition.module').then(m => m.TransitionPageModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./results-page/results.module').then(m => m.ResultsPageModule)
  },
  {
    path: 'chef-detail',
    loadChildren: () => import('./chef-detail/chef-detail.module').then( m => m.ChefDetailPageModule)
  },
  {
    path: 'offer',
    loadChildren: () => import('./offer/offer.module').then( m => m.OfferPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./order/public-order.module').then( m => m.PublicOrderModule)
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PublicRoutingModule {}
