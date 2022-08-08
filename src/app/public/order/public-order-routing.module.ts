import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicOrderDeliveredDetailPage } from './public-order-delivered-detail-page/public-order-delivered-detail.page';
import { PublicOrderDeliveredDetailPageGuard } from './public-order-delivered-detail-page/public-order-delivered-detail.page.guard';
import { PublicOrderDeliveredDetailReviewPage } from './public-order-delivered-detail-review-page/public-order-delivery-detail-review.page';
import { PublicOrderDeliveryConfirmPage } from './public-order-delivery-confirm-page/public-order-delivery-confirm.page';
import { PublicOrderInPrepDetailPage } from './public-order-inprep-detail-page/public-order-inprep-detail.page';
import { PublicOrderInprepDetailPageGuard } from './public-order-inprep-detail-page/public-order-inprep-detail.page.guard';
import { PublicOrderPendingDetailPage } from './public-order-pending-detail-page/public-order-pending-detail.page';
import { PublicOrderPendingDetailPageGuard } from './public-order-pending-detail-page/public-order-pending-detail.page.guard';
import { PublicOrderPage } from './public-order.page';

const routes: Routes = [
  {
    path: 'list',
    component: PublicOrderPage,
    children: [
      {
        path: 'pending',
        loadChildren: () => import('./public-order-pending-page/public-order-pending.module').then(m => m.PublicOrderPendingModule)
      },
      {
        path: 'inprep',
        loadChildren: () => import('./public-order-inprep-page/public-order-inprep.module').then(m => m.PublicOrderInPrepModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./public-order-delivered-page/public-order-delivered.module').then(m => m.PublicOrderDeliveredModule)
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
    component: PublicOrderPendingDetailPage,
    canActivate: [ PublicOrderPendingDetailPageGuard ]
  },
  {
    path: 'list/inprep/detail',
    component: PublicOrderInPrepDetailPage,
    canActivate: [ PublicOrderInprepDetailPageGuard ]
  },
  {
    path: 'list/inprep/detail/confirm-delivery',
    component: PublicOrderDeliveryConfirmPage,
    canActivate: [ PublicOrderInprepDetailPageGuard ]
  },
  {
    path: 'list/history/detail',
    component: PublicOrderDeliveredDetailPage,
    canActivate: [ PublicOrderDeliveredDetailPageGuard ]
  },
  {
    path: 'list/history/detail/review',
    component: PublicOrderDeliveredDetailReviewPage,
    canActivate: [ PublicOrderDeliveredDetailPageGuard ]
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class PublicOrderPageRoutingModule {}