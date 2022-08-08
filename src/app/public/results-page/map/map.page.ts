import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PublicOfferInfo } from '../+state/result.reducer';
import { getOffers } from '../+state/result.selectors';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  offers$: Observable<PublicOfferInfo[]>;
  offers: PublicOfferInfo[];

  map: any;

  markers = [];

  constructor(private store: Store<any>,
    private geolocation: Geolocation,
    protected platform: Platform,
    private router: Router) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById("offer-map") as HTMLElement, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    this.offers$ = this.store.select(getOffers);

    this.offers$.subscribe(o => {
      this.offers = [ ...o ];

      this.markers = [];

      this.offers.forEach(offer => {
        
        const marker = new google.maps.Marker({
          position: { lat: offer.latitude, lng: offer.longitude },
          map: this.map,
          icon: {
            url: "/assets/images/location.svg",
            size: new google.maps.Size(20, 50),
            scaledSize: new google.maps.Size(20, 50),
          },
        });
        
        const content =
          `<div style="font-family: \'HP Simplified\', sans-serif; color: #616161;">` +
          `<p style="font-size: 16px;">${offer.title}</p><p>Serving on ${dayjs(offer.servingStart).format("ddd D MMM, ")}</p><p>From ${dayjs(offer.servingStart).format("hh:mm")} to ${dayjs(offer.servingEnd).format("hh:mm")}</p>` +
          `</div>`;

        // Create an info window to share between markers.
        const infoWindow = new google.maps.InfoWindow();

        // Add a click listener for each marker, and set up the info window.
        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(content);
          infoWindow.open(marker.getMap(), marker);
        });

        this.markers.push(marker);
      })
    })

    this.platform.ready().then(() => {
      const subscription = this.geolocation.watchPosition().pipe(
        take(1)
      ).subscribe(position => {
        if ("coords" in position) {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (this.map) {
            this.map.setCenter(pos);
            const marker = new google.maps.Marker({
              position: { lat: pos.lat, lng: pos.lng },
              map: this.map,
              icon: {
                size: new google.maps.Size(20, 50),
                scaledSize: new google.maps.Size(20, 50),
              },
            });
            // Add a click listener for each marker, and set up the info window.
            this.markers.push(marker);
          }
        } else {
          console.error("position error: ", position);
        }
      });
    });
  }

  backTo() {
    this.router.navigate(['public/results'])
  }

  moveToCurrentLocation() {
    this.platform.ready().then(() => {
      const subscription = this.geolocation.watchPosition().pipe(
        take(1)
      ).subscribe(position => {
        if ("coords" in position) {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (this.map) {
            this.map.setCenter(pos);
          }
        } else {
          console.error("position error: ", position);
        }
      });
    });
  }

}
