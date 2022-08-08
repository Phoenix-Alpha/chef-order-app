import { ApiModule } from './../api/api.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagePopoverComponent } from './language-popover-component/language-popover.component';
import { IonicModule } from '@ionic/angular';
import { EmptyPage } from './empty-page/empty.page';
import { AvatarPopoverComponent } from './avatar-popover-component/avatar-popover.component';
import { ImageCropperModule } from '../ngx-image-cropper/image-cropper.module';
import { AvatarEditPopoverComponent } from './avatar-edit-popover-component/avatar-edit-popover.component';
import { IonChipCheckable } from './ion-chip-checkable/ion-chip-checkable';
import { ChefInboxNotificationSettingPopoverComponent } from './chef-inbox-notification-setting-popover-component/chef-inbox-notification-setting-popover.component';
import { ChefInboxMessageSettingPopoverComponent } from './chef-inbox-message-setting-popover-component/chef-inbox-message-setting-popover.component';
import { ChatComponent } from './chat-component/chat.component';
import { ChatSettingPopoverComponent } from './chat-setting-popover-component/chat-setting-popover.component';
import { ChefOfferDraftPopoverComponent } from './chef-offer-draft-popover-component/chef-offer-draft-popover.component'
import { ChefOfferActivePopoverComponent } from './chef-offer-active-popover-component/chef-offer-active-popover.component';
import { IonChipCheckableList } from './ion-chip-checkable-list/ion-chip-checkable-list';
import { LocalizedDatePipe } from './localized-date.pipe';
import { ResultFilterPipe } from './pipes/result-filter-pipe/result-filter.pipe';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { NgxMaterialTimepickerModule } from './material-timepicker/ngx-material-timepicker.module';
import { AutocompleteLibModule } from './ng-autocomplete-lib/autocomplete-lib.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";
import { ViewerModalComponent } from './image-viewer-modal/viewer-modal.component';
import { ChefPromoteGuardPopoverComponent } from './chef-promote-guard-popover-component/chef-promote-guard-popover.component';
import { BarRatingModule } from 'ngx-bar-rating';

@NgModule({
  declarations: [
    LanguagePopoverComponent,
    AvatarPopoverComponent,
    AvatarEditPopoverComponent,
    EmptyPage,
    IonChipCheckable,
    IonChipCheckableList,
    ChefInboxNotificationSettingPopoverComponent,
    ChefInboxMessageSettingPopoverComponent,
    ChatComponent,
    ChatSettingPopoverComponent,
    ChefOfferDraftPopoverComponent,
    ChefOfferActivePopoverComponent,
    DateTimePickerComponent,
    CalendarComponent,
    DatePickerComponent,
    LocalizedDatePipe,
    ResultFilterPipe,
    ViewerModalComponent,
    ChefPromoteGuardPopoverComponent,
   ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ApiModule,
    TranslateModule,
    ImageCropperModule,
    NgxMaterialTimepickerModule,
    AutocompleteLibModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxTextOverflowClampModule,
    BarRatingModule,
  ],
  exports: [
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AutocompleteLibModule,
    LanguagePopoverComponent,
    AvatarPopoverComponent,
    IonChipCheckable,
    IonChipCheckableList,
    ChefInboxNotificationSettingPopoverComponent,
    ChefInboxMessageSettingPopoverComponent,
    ChefPromoteGuardPopoverComponent,
    ChatComponent,
    ChatSettingPopoverComponent,
    ChefOfferDraftPopoverComponent,
    ChefOfferActivePopoverComponent,
    DateTimePickerComponent,
    CalendarComponent,
    DatePickerComponent,
    LocalizedDatePipe,
    ResultFilterPipe,
    NgxTextOverflowClampModule,
    EmptyPage,
    ViewerModalComponent,
    BarRatingModule,
  ],
})

export class SharedModule { }
