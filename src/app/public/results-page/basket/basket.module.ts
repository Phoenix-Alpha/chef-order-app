import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BasketPageRoutingModule } from './basket-routing.module';
import { BasketPage } from './basket.page';
import { ResultsListPageModule } from "../results-list/results-list.module";
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { checkoutReducer } from '../../checkout/+state/checkout.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    BasketPageRoutingModule,
    ResultsListPageModule,
  ],
  declarations: [BasketPage]
})
export class BasketPageModule {}
