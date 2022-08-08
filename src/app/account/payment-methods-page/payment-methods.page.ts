import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-methods-page',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  onSave() {
    
  }

}