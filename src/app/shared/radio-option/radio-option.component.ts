import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';



@Component({
  selector: 'app-radio-option',
  templateUrl: './radio-option.component.html',
  styleUrls: ['./radio-option.component.scss'],
})
export class RadioOptionComponent implements OnInit {
  @Input() items: any;
  @Input() activeItem: any;
  @Output() radioChanged  =  new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onOptionSelected(item) {
    console.log("onOptionSelected: ", item)
    this.radioChanged.emit(item);
  }

}
