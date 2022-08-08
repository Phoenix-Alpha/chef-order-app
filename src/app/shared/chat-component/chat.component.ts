import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  chatTitle: string;
  chatSubtitle: string;

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router) { }

  ngOnInit() {
    
  }

  onClickSettingButton(event) {

  }

}