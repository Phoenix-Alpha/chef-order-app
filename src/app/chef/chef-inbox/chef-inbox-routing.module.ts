import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefInboxPage } from './chef-inbox.page';

const routes: Routes = [
  {
    path: '',
    component: ChefInboxPage,
    children: [
      {
        path: 'notification',
        loadChildren: () => import('./chef-inbox-notification-page/chef-inbox-notification.module').then(m => m.ChefInboxNotificationModule)
      },
      {
        path: 'message',
        loadChildren: () => import('./chef-inbox-message-page/chef-inbox-message.module').then(m => m.ChefInboxMessageModule)
      },
      {
        path: '',
        redirectTo: 'notification',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChefInboxPageRoutingModule {}