import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SetVisited } from '../+state/public.actions';
import { PublicState } from '../+state/public.reducer';


@Component({
  selector: 'app-instruction-page',
  templateUrl: './instruction.page.html',
  styleUrls: ['./instruction.page.scss'],
})
export class InstructionPage implements OnInit {
  
  @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  slidesLen: number = 0;
  
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<PublicState>) { }

  ngOnInit() {
    this.slides.length().then(len => this.slidesLen = len);
  }

  onClickNext() {
    this.slides.isEnd()
    .then(value => {
      if (value) {
        this.store.dispatch(new SetVisited());
        this.router.navigate(['/public/home']);
      } else {
        this.slides.slideNext();
      }
    })
    .catch(err => {
      console.error(err);
    })
  }

  onClickLearnMore() {
    this.store.dispatch(new SetVisited());
    this.router.navigate(['/public/home']);
  }

  onClickSkip() {
    this.store.dispatch(new SetVisited());
    this.router.navigate(['/public/home']);
  }
}
