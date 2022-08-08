import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notification-settings-page',
  templateUrl: './notification-settings.page.html',
  styleUrls: ['./notification-settings.page.scss'],
})
export class NotificationSettingsPage implements OnInit {
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  onSave() {
    
  }

}