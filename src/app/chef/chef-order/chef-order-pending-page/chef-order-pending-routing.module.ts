import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOrderPendingPageGuard } from './chef-order-pending.guard';
import { ChefOrderPendingPage } from './chef-order-pending.page';

const routes: Routes = [
  {
    path: '',
    component: ChefOrderPendingPage,
    canActivate: [ ChefOrderPendingPageGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefOrderPendingPageRoutingModule {}