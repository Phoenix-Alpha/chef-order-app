import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefProfilePage } from './chef-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ChefProfilePage,
    children: [
      {
        path: 'aboutme',
        loadChildren: () => import('./chef-profile-aboutme-page/chef-profile-aboutme.module').then(m => m.ChefProfileAboutMeModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('./chef-profile-reviews-page/chef-profile-reviews.module').then(m => m.ChefProfileReviewsModule)
      },
      {
        path: '',
        redirectTo: 'aboutme',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChefProfilePageRoutingModule {}