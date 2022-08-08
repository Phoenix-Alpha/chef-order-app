import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPage } from './account-page/account.page';
import { PersonalDetailsPage } from './personal-details-page/personal-details.page';
import { PaymentMethodsPage } from './payment-methods-page/payment-methods.page';
import { NotificationSettingsPage } from './notification-settings-page/notification-settings.page';
import { PersonalDetailsEditPage } from './personal-details-edit-page/personal-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
    pathMatch: 'full'
  },
  {
    path: 'personal-details-edit',
    component: PersonalDetailsEditPage,
  },
  {
    path: 'personal-details',
    component: PersonalDetailsPage,
  },
  // {
  //   path: 'payment-methods',
  //   component: PaymentMethodsPage,
  // },
  {
    path: 'notification-settings',
    component: NotificationSettingsPage,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AccountRoutingModule { }
