import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { PublicOfferInfo } from '../results-page/+state/result.reducer';
import { PublicOfferSuggestionInfo } from './offer';


@Injectable({
  providedIn: 'root'
})
export class PublicOfferService {
  constructor(private http: HttpClient, private store: Store<any>) { }

  publicFetchOfferDetail(offerId: number, userAddress: string): Observable<PublicOfferInfo> {
    return this.http.post<PublicOfferInfo>(`/api/v1/offer/get`, { 
      userAddress: userAddress,
      offerId: offerId.toString()
    });
  }

  publicFetchOfferSuggestions(offerName: string): Observable<PublicOfferSuggestionInfo[]> {
    return this.http.get<PublicOfferSuggestionInfo[]>(`/api/v1/offer/suggest?offerName=${offerName}`);
  }

  publicFetchTopOffers(): Observable<PublicOfferSuggestionInfo[]> {
    return this.http.get<PublicOfferSuggestionInfo[]>(`/api/v1/offer/top-offers`);
  }
  
}
