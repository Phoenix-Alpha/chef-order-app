import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {

  ratingText = {
    0: 'Worst',
    1: 'Bad',
    2: 'Okay',
    3: 'Great',
    4: 'Top',
  };
  
  reviews = [
    {
      name: 'Adam B.',
      date: '15.09.2019',
      review: 'Quantity not enough\nTaste very good',
      rating: 5
    },
    {
      name: 'Karim D.',
      date: '15.09.2019',
      review: 'Very delicious',
      rating: 5
    },
    {
      name: 'Adam B.',
      date: '15.09.2019',
      review: 'Quantity not enough\nTaste very good',
      rating: 3
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  getRatingText(rating: number) {
    return this.ratingText[rating - 1];
  }
}
