import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, LoadingController, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { UpdateChefProfile } from '../../+state/chef.actions';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail, UpdateChefProfileRequest } from '../../chef';

@Component({
  selector: 'app-chef-profile-aboutme-page',
  templateUrl: './chef-profile-aboutme.page.html',
  styleUrls: ['./chef-profile-aboutme.page.scss'],
})
export class ChefProfileAboutMePage implements OnInit {
  
  dishes: string = "Tajine, Couscous, Biryani, Chiken … masala"

  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  chefProfileForm: FormGroup;

  isEditable: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    private loadingController: LoadingController,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.chefProfileForm = this.fb.group({
      aboutMe: ['', Validators.compose([ Validators.required, Validators.minLength(10), Validators.maxLength(256) ])],
      cuisines: ['', Validators.compose([ Validators.required, Validators.minLength(1) ])],
    });

    this.aboutMe.disable();
    this.cuisines.disable();
    this.isEditable = false;

    this.loggedInUser$ = this.store.select(getLoggedInUser);
    this.loggedInUser$.subscribe(user => {
      if (user.id > 0) {
        this.loggedInUser = { ...user };
      } else {
        this.loggedInUser = null;
      }
    });

    this.chefDetail$ = this.store.select(getChefDetail);
    this.chefDetail$.subscribe(chef => {
      if (chef.id > 0) {
        this.chefDetail = { ...chef };
        this.aboutMe.setValue(this.chefDetail.aboutMe);
        this.cuisines.setValue(this.chefDetail.cuisines);
      } else {
        this.chefDetail = null;
      }
    })
  }

  async onClickEditButton() {
    if (!this.isEditable) {
      this.aboutMe.enable();
      this.cuisines.enable();
    } else {
      this.aboutMe.disable();
      this.cuisines.disable();
      if (this.loggedInUser && this.loggedInUser.email) {
        const loading = await this.loadingController.create({
          message: 'Just a moment...',
        });
        loading.present();
        const request: UpdateChefProfileRequest = {
          email: this.loggedInUser.email,
          cuisines: [ ...this.cuisines.value ],
          aboutMe: this.aboutMe.value,
        };
        this.store.dispatch(new UpdateChefProfile(request));
      }
    }
    this.isEditable = !this.isEditable;
  }

  get aboutMe() {
    return this.chefProfileForm.get('aboutMe');
  }

  get cuisines() {
    return this.chefProfileForm.get('cuisines');
  }

}