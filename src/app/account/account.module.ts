import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountPage } from './account-page/account.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { PersonalDetailsPage } from './personal-details-page/personal-details.page';
import { NotificationSettingsPage } from './notification-settings-page/notification-settings.page';
import { PaymentMethodsPage } from './payment-methods-page/payment-methods.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { PersonalDetailsEditPage } from './personal-details-edit-page/personal-details-edit.page';


@NgModule({
  declarations: [
    AccountPage,
    PersonalDetailsPage,
    PersonalDetailsEditPage,
    PaymentMethodsPage,
    NotificationSettingsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    AccountRoutingModule,
    IonicSelectableModule,
  ]
})
export class AccountModule { }
