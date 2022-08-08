import { Component, OnInit } from '@angular/core';
import {ResultsService} from '../../shared/services/results.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.page.html',
  styleUrls: ['./transition.page.scss'],
})
export class TransitionPage implements OnInit {

  constructor(private resSrv: ResultsService, private router: Router) {
    
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.router.navigate(['/public/results']);
    }, 1000)
  }

}
