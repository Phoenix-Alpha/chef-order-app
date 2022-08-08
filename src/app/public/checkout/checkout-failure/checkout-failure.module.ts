import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutFailurePageRoutingModule } from './checkout-failure-routing.module';

import { CheckoutFailurePage } from './checkout-failure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutFailurePageRoutingModule
  ],
  declarations: [ CheckoutFailurePage ]
})
export class CheckoutFailurePageModule {}
