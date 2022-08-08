import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOrderDeliveredPageGuard } from './chef-order-delivered.guard';
import { ChefOrderDeliveredPage } from './chef-order-delivered.page';

const routes: Routes = [
  {
    path: '',
    component: ChefOrderDeliveredPage,
    canActivate: [ ChefOrderDeliveredPageGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefOrderDeliveredPageRoutingModule {}