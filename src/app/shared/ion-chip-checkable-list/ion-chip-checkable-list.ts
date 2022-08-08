import { Component, OnInit, HostBinding, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChipItem, ChipItemState } from '../chip';

@Component({
  selector: 'app-ion-chip-checkable-list',
  templateUrl: './ion-chip-checkable-list.html',
  styleUrls: ['./ion-chip-checkable-list.scss']
})
export class IonChipCheckableList implements OnInit, OnChanges {

  states: ChipItemState[];

  @Input() itemList: ChipItem[];
  @Input() selectedItems: any;
  @Input() isMultiple: boolean;
  @Input() isSmall: boolean;
  @Input() isCheckable: boolean;
  @Output() onChanged = new EventEmitter<any>();

  constructor() { 
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    let newStates = [];
    this.itemList.forEach(item => {
      if (this.isMultiple) {
        const newState : ChipItemState = {
          id: item.id,
          label: item.label,
          checked: this.selectedItems.includes(item.id),
        }
        newStates.push(newState);
      } else {
        const newState : ChipItemState = {
          id: item.id,
          label: item.label,
          checked: this.selectedItems == item.id,
        }
        newStates.push(newState);
      }
    })
    this.states = newStates;
  }

  onClickChip(event) {
    const idx = this.states.findIndex(s => s.id === event.id);
    if (this.isMultiple) {
      if (idx >= 0) {
        this.states[idx].checked = event.checked;
        const result = this.states.filter(s => s.checked).map(s => {
          return s.id;
        })
        this.onChanged.emit([ ...result ]);
      }
    } else {
      if (idx >= 0) {
        this.states.forEach(s => {
          s.checked = false;
        })
        this.states[idx].checked = event.checked;
        this.onChanged.emit(this.states[idx].id);
      }
    }
    
  }
}
