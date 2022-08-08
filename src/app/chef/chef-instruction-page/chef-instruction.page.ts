import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-chef-instruction-page',
  templateUrl: './chef-instruction.page.html',
  styleUrls: ['./chef-instruction.page.scss'],
})
export class ChefInstructionPage implements OnInit {
  
  @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  slidesLen: number = 0;
  
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.slides.length().then(len => this.slidesLen = len);
  }

  onClickNext() {
    this.slides.isEnd().then(value => {
      if (value) {
        this.router.navigate(['/public/chef/promote']);
      } else {
        this.slides.slideNext();
      }
    })
    .catch(err => {
      console.error(err);
    })
  }

  onClickSkip() {
    // this.store.dispatch(new SetVisited());
    this.router.navigate(['/public/chef/promote']);
  }
}
