import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOrderDeliveryConfirmPage } from './chef-order-delivery-confirm-page/chef-order-delivery-confirm.page';
import { ChefOrderInPrepDetailPage } from './chef-order-inprep-detail-page/chef-order-inprep-detail.page';
import { ChefOrderInprepDetailPageGuard } from './chef-order-inprep-detail-page/chef-order-inprep-detail.page.guard';
import { ChefOrderInstructionGuard } from './chef-order-instruction-page/chef-order-instruction.guard';
import { ChefOrderInstructionPage } from './chef-order-instruction-page/chef-order-instruction.page';
import { ChefOrderPendingDetailPage } from './chef-order-pending-detail-page/chef-order-pending-detail.page';
import { ChefOrderPendingDetailPageGuard } from './chef-order-pending-detail-page/chef-order-pending-detail.page.guard';
import { ChefOrderPage } from './chef-order.page';

const routes: Routes = [
  {
    path: 'list',
    component: ChefOrderPage,
    children: [
      {
        path: 'pending',
        loadChildren: () => import('./chef-order-pending-page/chef-order-pending.module').then(m => m.ChefOrderPendingModule)
      },
      {
        path: 'inprep',
        loadChildren: () => import('./chef-order-inprep-page/chef-order-inprep.module').then(m => m.ChefOrderInPrepModule)
      },
      {
        path: 'delivered',
        loadChildren: () => import('./chef-order-delivered-page/chef-order-delivered.module').then(m => m.ChefOrderDeliveredModule)
      },
      {
        path: '',
        redirectTo: 'pending',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'list/pending/detail',
    component: ChefOrderPendingDetailPage,
    canActivate: [ ChefOrderPendingDetailPageGuard ]
  },
  {
    path: 'list/inprep/detail',
    component: ChefOrderInPrepDetailPage,
    canActivate: [ ChefOrderInprepDetailPageGuard ]
  },
  {
    path: 'list/inprep/detail/confirm-delivery',
    component: ChefOrderDeliveryConfirmPage,
  },
  {
    path: 'instruction',
    canActivate: [ ChefOrderInstructionGuard ],
    component: ChefOrderInstructionPage,
  },
  {
    path: '',
    redirectTo: 'instruction',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class ChefOrderPageRoutingModule {}