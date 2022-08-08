import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefInboxMessagePage } from './chef-inbox-message.page';

const routes: Routes = [
  {
    path: '',
    component: ChefInboxMessagePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefInboxMessagePageRoutingModule {}