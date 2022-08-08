import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';
import { LoggedInUser } from 'src/app/auth/auth';
import { environment } from 'src/environments/environment';
import { SetChefOrderInstructionVisited } from '../../+state/chef.actions';
import { getChefDetail } from '../../+state/chef.selectors';
import { ChefDetail } from '../../chef';

@Component({
  selector: 'app-chef-order-instruction-page',
  templateUrl: './chef-order-instruction.page.html',
  styleUrls: ['./chef-order-instruction.page.scss'],
})
export class ChefOrderInstructionPage implements OnInit {
  
  loggedInUser$: Observable<LoggedInUser>;
  loggedInUser: LoggedInUser;

  chefDetail$: Observable<ChefDetail>;
  chefDetail: ChefDetail;

  currentTab: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() {

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
        console.log('user: ', this.loggedInUser);
      } else {
        this.chefDetail = null;
      }
    })
  }

  onClose() {
    this.store.dispatch(new SetChefOrderInstructionVisited());
    this.router.navigate(['public/chef/order/list']);
  }

}