import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutPage } from './checkout.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  },

  {
    path: 'success',
    loadChildren: () => import('./checkout-success/checkout-success.module').then(m => m.CheckoutSuccessPageModule)
  },
  {
    path: 'failure',
    loadChildren: () =>import('./checkout-failure/checkout-failure.module').then(m => m.CheckoutFailurePageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutPageRoutingModule {}
