import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefInboxNotificationPage } from './chef-inbox-notification.page';

const routes: Routes = [
  {
    path: '',
    component: ChefInboxNotificationPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefInboxNotificationPageRoutingModule {}