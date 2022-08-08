import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultsListPage } from './results-list.page';
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: ResultsListPage,
  },
  {
    path: 'search',
    component: SearchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule, IonicModule],
    exports: [RouterModule],
    declarations: [
    ]
})
export class ResultsListPageRoutingModule {}
