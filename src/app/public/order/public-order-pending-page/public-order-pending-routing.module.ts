import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicOrderPendingPageGuard } from './public-order-pending.guard';
import { PublicOrderPendingPage } from './public-order-pending.page';

const routes: Routes = [
  {
    path: '',
    component: PublicOrderPendingPage,
    canActivate: [ PublicOrderPendingPageGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicOrderPendingPageRoutingModule {}