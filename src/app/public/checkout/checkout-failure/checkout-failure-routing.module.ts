import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutFailurePage } from './checkout-failure.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutFailurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutFailurePageRoutingModule {}
