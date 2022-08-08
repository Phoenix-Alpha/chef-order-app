import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefProfileAboutMePage } from './chef-profile-aboutme.page';

const routes: Routes = [
  {
    path: '',
    component: ChefProfileAboutMePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefProfileAboutMePageRoutingModule {}