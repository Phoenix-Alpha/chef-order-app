 import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

declare var google;

@Component({
  selector: 'app-offer-map-page',
  templateUrl: './offer-map.page.html',
  styleUrls: ['./offer-map.page.scss'],
})
export class OfferMapPage implements OnInit, OnDestroy {

  private destroy$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<any>) { }

  ngOnInit() {
    let map = new google.maps.Map(document.getElementById("offer-map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });

    const marker = new google.maps.Marker({
      position: { lat: -34.397, lng: 150.644 },
      map: map,
      icon: "/assets/images/location.svg",
      title: "Halal Homemade powered Chef",
    });

    // Create an info window to share between markers.
    const infoWindow = new google.maps.InfoWindow();

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.getTitle());
      infoWindow.open(marker.getMap(), marker);
    });
  }

  ionViewWillEnter() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
