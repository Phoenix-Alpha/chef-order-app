import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter-chef-rating',
  templateUrl: './filter-chef-rating.component.html',
  styleUrls: ['./filter-chef-rating.component.scss'],
})
export class FilterChefRatingComponent implements OnInit {
  @Input('number') ratingNumber;
  @Input('startNumber') startNumber;
  @Input('forChefProfile') forChefProfile = false;
  @Output() currentRatingChanged  =  new EventEmitter<number>();
  dummyArray = [];
  activeRating;
  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < this.ratingNumber; i++) {
      this.dummyArray.push(i);
    }
    this.activeRating  = this.startNumber ? this.startNumber - 1 : -1;
  }

  changeActiveRating(i: number) {
    if (!this.forChefProfile) {
      if (i === this.activeRating) {
        this.activeRating = -1;
        this.currentRatingChanged.emit(0);
      } else {
        this.activeRating = i;
        this.currentRatingChanged.emit(i + 1);
      }
    }
  }

  getIconName(i) {
    if (i <= this.activeRating) {
      return this.forChefProfile ? 'chef-star-active' : 'rating-star-active';
    } else {
      return this.forChefProfile ? 'chef-star' : 'rating-star';
    }
  }
}
