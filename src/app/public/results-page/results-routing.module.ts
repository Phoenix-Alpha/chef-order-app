import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultsListGuard } from './results-list/results-list.guard';
import { ResultsPage } from './results.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: ResultsPage,
    children: [
      {
        path: 'results-list',
        canActivate: [ ResultsListGuard ],
        children: [
          {
            path: '',
            loadChildren: () => import('./results-list/results-list.module').then( m => m.ResultsListPageModule)
          },
        ]
      },
      {
        path: 'filter',
        loadChildren: () => import('./filter/filter.module').then( m => m.FilterPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
      },
      {
        path: 'favourite',
        loadChildren: () => import('./favourite/favourite.module').then( m => m.FavouritePageModule)
      },
      {
        path: 'basket',
        loadChildren: () => import('./basket/basket.module').then( m => m.BasketPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/results-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/results-list',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultsPageRoutingModule {}
