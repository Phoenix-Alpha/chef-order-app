import {Component, OnInit, ViewChild} from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { bool } from 'aws-sdk/clients/signer';
import { Observable } from 'rxjs';
import { PublicOrder } from '../checkout/+state/checkout.reducer';
import { getOrders } from '../checkout/+state/checkout.selectors';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  
  @ViewChild('menuTabs') tabs: IonTabs;
  
  activeTab = '';
  
  isBasketEmpty: bool = false;
  
  orders$: Observable<PublicOrder[]>;
  
  constructor(private store: Store) { }

  ngOnInit() {
    this.orders$ = this.store.select(getOrders);
  }

  changeActiveTab() {
    this.activeTab = this.tabs.getSelected();
  }
}
