import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

  selectedDate: string;

  today: Date;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
    this.today = this.getNow();
    this.selectedDate = this.today.toISOString();
  }

  ionViewWillEnter() {
    this.today = this.getNow();
    this.selectedDate = this.today.toISOString();
  }

  dateSelected(selected) {
    console.log("selectedDate: ", selected);
    this.selectedDate = selected.toISOString();
  }

  onClickCancel() {
    this.popoverController.getTop().then(el => {
      el.dismiss({ selectedDate: null });
    });
  }

  onClickOk() {
    this.popoverController.getTop().then(el => {
      el.dismiss({ selectedDate: this.selectedDate });
    });
  }

  getNow() {
    return new Date();
  }

}
