import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';
import { stat } from 'node:fs';

@Component({
  selector: 'app-location-permission-page',
  templateUrl: './location-permission.page.html',
  styleUrls: ['./location-permission.page.scss'],
})
export class LocationPermissionPage implements OnInit, OnDestroy {
  
  firstName: string;
  private destroy$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private diagnostic: Diagnostic,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private store: Store<any>) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickAllow() {
    this.platform.ready().then(() => {
      this.diagnostic.requestLocationAuthorization().then((status) => {
        console.log(status);
        if (status === this.diagnostic.permissionStatus.GRANTED 
          || status === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE 
          || status === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
          this.router.navigate(['public/instruction']);
        }
      }, (err) => {
        console.log(err);
      });
    });

    // android only...
    // this.platform.ready().then(() => {
    //   this.diagnostic.requestRuntimePermission(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((result) => {
    //     console.log(result);
    //     this.router.navigate(['public/instruction']);
    //   });
    // });
    
    // this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
    //   () => {
    //     console.log('Request successful')
    //   },
    //   error => console.log('Error requesting location permissions', error)
    // );
    
    // this.locationAccuracy.canRequest().then(canRequest => {
    //   if (canRequest) {
    //     // the accuracy option will be ignored by iOS
        
    //   } else {
    //     console.error('canRequest: ', canRequest)
    //   }
    // })
    // this.geolocation.getCurrentPosition().then(position => {
    //   console.log("Position: ", position);
    // })
    // .catch(err => {
    //   console.error("Position: ", err);
    // });
  }

  onClickSkip() {
    this.router.navigate(['public/instruction']);
  }

}
