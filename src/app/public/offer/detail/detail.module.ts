import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { DateTimePickerComponent } from '../../../shared/date-time-picker/date-time-picker.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { DatePickerComponent } from '../../../shared/date-picker/date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewerModalComponent } from 'src/app/shared/image-viewer-modal/viewer-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
  ],
  declarations: [ 
    DetailPage,
  ],
  entryComponents: [
    DateTimePickerComponent,
    CalendarComponent,
    DatePickerComponent,
    ViewerModalComponent,
  ]
})
export class DetailPageModule {}
