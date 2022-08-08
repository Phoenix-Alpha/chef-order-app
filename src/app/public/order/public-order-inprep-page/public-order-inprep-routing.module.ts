import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicOrderInPrepPageGuard } from './public-order-inprep.guard';
import { PublicOrderInPrepPage } from './public-order-inprep.page';

const routes: Routes = [
  {
    path: '',
    component: PublicOrderInPrepPage,
    canActivate: [ PublicOrderInPrepPageGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicOrderInPrepPageRoutingModule {}