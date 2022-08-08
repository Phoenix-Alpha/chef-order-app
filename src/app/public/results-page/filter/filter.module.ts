import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterPageRoutingModule } from './filter-routing.module';
import { FilterPage } from './filter.page';
import { ResultsListPageModule } from "../results-list/results-list.module";
import { TranslateModule } from '@ngx-translate/core';
import { FilterChefRatingComponent } from '../../../shared/filter-chef-rating/filter-chef-rating.component';
import { RadioOptionComponent } from '../../../shared/radio-option/radio-option.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FilterPageRoutingModule,
    ResultsListPageModule,
    TranslateModule,
  ],
  exports: [
    FilterChefRatingComponent
  ],
  declarations: [FilterPage, FilterChefRatingComponent, RadioOptionComponent]
})
export class FilterPageModule {}
