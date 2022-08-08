import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { getLoggedInUser } from 'src/app/auth/+state/auth.selectors';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit, OnDestroy {
  
  firstName: string = "";
  private destroy$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<any>) { }

  ngOnInit() {
    this.store.pipe(
      select(getLoggedInUser),
      filter(user => user.id > 0),
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.firstName = user.firstName;
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.router.navigate(['public/home']);
    }, 1000)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPage() {
    this.router.navigate(['public/home']);
  }
}
