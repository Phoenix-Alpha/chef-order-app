import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { defaultPaging, PageableResults } from 'src/app/api/types/Pageable';
import { PublicOfferInfo } from './+state/result.reducer';
import { PublicOfferSearchRequest } from './results';


@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  constructor(private http: HttpClient, private store: Store<any>) { }

  searchOffers(request: PublicOfferSearchRequest, paging = defaultPaging): Observable<PageableResults<PublicOfferInfo>> {
    return this.http.post<PageableResults<PublicOfferInfo>>(`/api/v1/offer/search?page=${paging.page}&size=${paging.size}`, request);
  }

  
}
