import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, HostBinding, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChipItemState } from '../chip';

@Component({
  selector: 'app-ion-chip-checkable',
  templateUrl: './ion-chip-checkable.html',
  styleUrls: ['./ion-chip-checkable.scss'],
  animations: [
    trigger(
      'fadeAnimation', 
      [
        // the "in" style determines the "resting" state of the element when it is visible.
        state('in', style({opacity: 1})),

        // fade in when created. this could also be written as transition('void => *')
        transition(':enter', [
          style({opacity: 0}),
          animate(100)
        ]),

        // fade out when destroyed. this could also be written as transition('void => *')
        transition(':leave', animate(100, style({opacity: 0})))
      ]
    )
  ]
})
export class IonChipCheckable implements OnInit, OnChanges {

  checked: boolean;

  @Input() label: string;
  @Input() id: string;
  @Input() isChecked: boolean;
  @Input() isSmall: boolean;
  @Input() isToggle: boolean;
  @Input() isCheckable: boolean;
  @Output() onCheckChanged = new EventEmitter<ChipItemState>();

  constructor() {
  }

  ngOnInit() { 
    this.checked = this.isChecked;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checked = this.isChecked;
  }

  onClickChip() {
    if (!this.isCheckable) return;
    if (this.isToggle || (!this.isToggle && !this.checked)) {
      this.checked = !this.checked;
      const newItemState: ChipItemState = {
        id: this.id,
        label: this.label,
        checked: this.checked,
      }
      this.onCheckChanged.emit(newItemState)
    }
  }
}
