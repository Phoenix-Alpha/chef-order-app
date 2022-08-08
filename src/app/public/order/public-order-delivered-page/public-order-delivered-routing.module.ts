import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicOrderDeliveredPageGuard } from './public-order-delivered.guard';
import { PublicOrderDeliveredPage } from './public-order-delivered.page';

const routes: Routes = [
  {
    path: '',
    component: PublicOrderDeliveredPage,
    canActivate: [ PublicOrderDeliveredPageGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicOrderDeliveredPageRoutingModule {}