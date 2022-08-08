import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  demoResults1 = [
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 1
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 1
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 1
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 1
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 1
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 1
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    {
      place: {
        img_url: 'https://www.goldennumber.net/wp-content/uploads/2013/08/florence-colgate-perfect-beautiful-face-golden-ratio.jpg',
        name: 'Inna',
        rating: '4,5',
        rating_quantity: '12',
        serving_date: 'Mon 30 Feb',
        seving_time_range: '12:00 - 15:30',
        serving_hours: '24 hours',
        available: 5,
        price: '12,50',
        distance: '3,5',
        type: 2
      },
      dish: {
        name: 'Tajine Chicken',
        description: 'Traditional tajine, as everyone knows. Prepared with original...',
        img_url: 'https://www.onceuponachef.com/images/2018/10/Moroccan-Chicken-Tagine-300-760x592.jpg'
      }
    },
    ];
  public results = [];
  public dataReceived: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  constructor() {
    this.simulateData();
  }

  simulateData() {
    this.getMoreResults();
  }

  getMoreResults(ev?) {
    setTimeout(() => {
      this.results = this.results.concat(this.demoResults1);
      console.log(this.results);
      if (ev) {
        ev.target.complete();
      }
      this.dataReceived.next(true);
    }, 500);
  }
}
