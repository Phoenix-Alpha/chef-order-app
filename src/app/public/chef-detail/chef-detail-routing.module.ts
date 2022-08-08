import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyPage } from 'src/app/shared/empty-page/empty.page';

import { ChefDetailPage } from './chef-detail.page';
import { PublicChefPageGuard } from './public-chef.page.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: ChefDetailPage,
    children: [
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('./reviews/reviews.module').then( m => m.ReviewsPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/about',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: ':chefId',
    canActivate: [ PublicChefPageGuard ],
    // redirectTo: 'tabs/about',
    component: EmptyPage,
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChefDetailPageRoutingModule {}
