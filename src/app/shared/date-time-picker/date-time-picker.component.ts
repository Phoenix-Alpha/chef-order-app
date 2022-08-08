import { PublicOfferInfo } from './../../public/results-page/+state/result.reducer';
import { PublicOrder } from 'src/app/public/checkout/+state/checkout.reducer';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { AddOrderToBasket } from 'src/app/public/checkout/+state/checkout.actions';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent implements OnInit {
  @ViewChild('pickerContainer',{static: false}) picker: ElementRef;
  @Output('pickerState') pickerState = new EventEmitter();

  timePickerOpened = false;

  pickupTime: string = '';

  pickupForm: FormGroup;

  constructor(private fb: FormBuilder,
    private popoverController: PopoverController,
    private store: Store,
    private router: Router,
    private toastController: ToastController) {
  }

  ngOnInit() {
    this.pickupForm = this.fb.group({
      pickupDate: [null, Validators.compose([ Validators.required ])],
      timePickerInput: [null, Validators.compose([ Validators.required ])],
    });
  }

  get pickupDate() {
    return this.pickupForm.get('pickupDate');
  }

  get timePickerInput() {
    return this.pickupForm.get('timePickerInput');
  }

  closePicker() {
    this.popoverController.dismiss();
  }

  addToCart() {
    this.pickupForm.markAllAsTouched();
    if (this.pickupForm.valid && this.pickupTime) {
      let date = this.pickupDate.value;
      let time = this.pickupTime;
      let year = date.slice(-4);
      let month = date.slice(-7,-5);
      let day = date.slice(-10,-8);
      let hour = time.slice(0,2);
      let min = time.slice(3,5);
      let dateTime = new Date(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), parseInt(min));
      this.popoverController.getTop().then(el => {
        el.dismiss({ pickupDate:  dateTime});
        this.toastController.create({
          animated: true,
          message: `Order added to basket successfully.`,
          duration: 3000,
          position: "middle",
        }).then(toast => {
          toast.present();
        });
      });
    }
  }

  onTimeChanged(newTime) {
    this.pickupTime = newTime;
    this.timePickerInput.setValue(newTime);
    console.log("onTimeChanged", newTime);
  }

  onTimePickerClosed() {
    this.timePickerOpened = false;
  }

  onTimePickerOpened() {
    this.timePickerOpened = true;
  }

  onTimePickerTimeSet(newTime) {
    this.pickupTime = newTime;
    this.timePickerInput.setValue(newTime);
    console.log("onTimerPickerTimeSet", newTime);
  }

  async onClickDatePicker() {
    const popover = await this.popoverController.create({
      component: DatePickerComponent,
      cssClass: 'date-picker-popover-class',
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data?.selectedDate) {
      const dateStr = dayjs(data.selectedDate).format("ddd, DD.MM.YYYY");
      console.log(dateStr);
      this.pickupDate.setValue(dateStr);
    }
  }
}
