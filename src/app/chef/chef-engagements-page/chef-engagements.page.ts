import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ChefState } from '../+state/chef.reducer';
import { combineLatest } from 'rxjs';
import { getRegistrationState } from '../+state/chef.selectors';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { take } from 'rxjs/operators';
import { ChefRegistrationDetail } from '../chef';
import { ChefRegister } from '../+state/chef.actions';


@Component({
  selector: 'app-chef-engagements-page',
  templateUrl: './chef-engagements.page.html',
  styleUrls: ['./chef-engagements.page.scss'],
})
export class ChefEngagementsPage implements OnInit {
  
  @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  title: string = "chef.engagements.yourEngagements";

  agreementForm: FormGroup;
  loading: any;

  validation_messages = {
    'agreement': [
      { type: 'required', message: 'You must accept the terms and policy to start selling.' },
    ],
  }
  
  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<ChefState>,
    private loadingController: LoadingController,
    private router: Router) { }

  ngOnInit() {
    this.agreementForm = this.fb.group({
      agreement: [ false, Validators.compose([ Validators.requiredTrue ])],
    });
    this.slides.ionSlideDidChange.subscribe((event) => {
      this.slides.getActiveIndex().then(index => {
        this.title = index < 2 ? "chef.engagements.yourEngagements" : "chef.engagements.ourEngagements";
      });
    })
  }

  onClickNext() {
    this.slides.isEnd().then(async value => {
      if (value) {
        this.agreementForm.markAllAsTouched();
        if (this.agreementForm.valid) {
          const loading = await this.loadingController.create({
            message: 'Just a moment...',
          });
          loading.present();
          this.store.select(getRegistrationState).pipe(take(1)).subscribe((state) => {
            console.log("here: ", state)
            const chefRegistrationDetail: ChefRegistrationDetail = { ...state.registrationDetail };
            this.store.dispatch(new ChefRegister(chefRegistrationDetail));
          });
        }
      } else {
        this.slides.slideNext();
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  onClickSkip() {
    // this.store.dispatch(new SetVisited());
    this.router.navigate(['/public/chef/promote']);
  }
}
