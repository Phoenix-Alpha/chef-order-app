import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultsListPageRoutingModule } from './results-list-routing.module';

import { ResultsListPage } from './results-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { SearchComponent } from './search/search.component';
import { ViewerModalComponent } from 'src/app/shared/image-viewer-modal/viewer-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ResultsListPageRoutingModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [
  ],
  declarations: [
    ResultsListPage,
    SearchComponent,
  ],
  entryComponents: [
    ViewerModalComponent,
  ]
})
export class ResultsListPageModule {}
