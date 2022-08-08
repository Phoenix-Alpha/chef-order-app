import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { PublicOfferInfo } from '../results-page/+state/result.reducer';
import { PublicChefDetail, PublicChefSuggestionInfo } from './chef';


@Injectable({
  providedIn: 'root'
})
export class PublicChefService {
  constructor(private http: HttpClient, private store: Store<any>) { }

  publicFetchChefDetail(chefId: number, userAddress: string): Observable<PublicChefDetail> {
    return this.http.post<PublicChefDetail>(`/api/v1/chef/get`, { 
      userAddress: userAddress,
      chefId: chefId.toString()
    });
  }

  publicFetchChefSuggestionByName(chefName: string): Observable<PublicChefSuggestionInfo[]> {
    return this.http.get<PublicChefSuggestionInfo[]>(`/api/v1/chef/suggest?chefName=${chefName}`);
  }
  
}
