import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefDashboardPage } from './chef-dashboard-page/chef-dashboard.page';
import { ChefEngagementsPage } from './chef-engagements-page/chef-engagements.page';
import { ChefInstructionPage } from './chef-instruction-page/chef-instruction.page';
import { ChefPackagingPage } from './chef-packaging-page/chef-packaging.page';
import { ChefPromotePage } from './chef-promote-page/chef-promote.page';
import { ChefVacationPage } from './chef-vacation-page/chef-vacation.page';
import { ChefInstructionPageGuard } from './chef.guard';
import { PhoneConfirmPage } from './phone-confirm-page/phone-confirm.page';
import { PhoneVerificationPage } from './phone-verification-page/phone-verification.page';

const routes: Routes = [
  {
    path: '',
    component: ChefInstructionPage,
    canActivate: [ ChefInstructionPageGuard ],
    pathMatch: 'full'
  },
  {
    path: 'promote',
    component: ChefPromotePage,
  },
  {
    path: 'engagements',
    component: ChefEngagementsPage,
  },
  {
    path: 'dashboard',
    component: ChefDashboardPage,
  },
  {
    path: 'offer',
    loadChildren: () => import('./chef-offer/chef-offer.module').then(m => m.ChefOfferModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./chef-inbox/chef-inbox.module').then(m => m.ChefInboxModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chef-chat/chef-chat.module').then(m => m.ChefChatModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./chef-profile/chef-profile.module').then(m => m.ChefProfileModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./chef-order/chef-order.module').then(m => m.ChefOrderModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./chef-wallet/chef-wallet.module').then(m => m.ChefWalletModule)
  },
  {
    path: 'packaging',
    component: ChefPackagingPage,
  },
  {
    path: 'vacation',
    component: ChefVacationPage,
  },
  {
    path: 'phone-verification/send',
    component: PhoneVerificationPage,
  },
  {
    path: 'phone-verification/confirm',
    component: PhoneConfirmPage,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ChefRoutingModule { }
