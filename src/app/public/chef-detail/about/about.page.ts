import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getPublicChefDetail } from '../+state/public-chef.selectors';
import { PublicChefDetail } from '../chef';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  
  chefDetail$: Observable<PublicChefDetail>;
  chefDetail: PublicChefDetail;

  chefDishes: string = '';

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.chefDetail$ = this.store.select(getPublicChefDetail);
    this.chefDetail$.subscribe(detail => {
      this.chefDetail = { ...detail };
      this.chefDishes = '';
    })
  }

}
