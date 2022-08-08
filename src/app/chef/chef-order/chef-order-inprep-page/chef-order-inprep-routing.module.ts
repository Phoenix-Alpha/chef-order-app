import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefOrderInPrepPageGuard } from './chef-order-inprep.guard';
import { ChefOrderInPrepPage } from './chef-order-inprep.page';

const routes: Routes = [
  {
    path: '',
    component: ChefOrderInPrepPage,
    canActivate: [ ChefOrderInPrepPageGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefOrderInPrepPageRoutingModule {}