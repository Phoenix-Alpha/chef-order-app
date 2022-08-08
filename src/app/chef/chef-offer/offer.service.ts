import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChefOfferCreateRequest, ChefUpdateOfferRequest, OfferDetail, OfferStatus } from './offer';
import { UploadAvatarResponse } from '../chef';

function dataUrltoFile(dataurl) {
  let arr = dataurl.split(','),
  mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), 
  n = bstr.length, 
  u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type:mime });
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  constructor(private http: HttpClient, private store: Store<any>) { }

  uploadOfferPicture(imageData: string): Observable<UploadAvatarResponse> {
    const file = dataUrltoFile(imageData)
    const formData = new FormData();
    formData.append('file', file, "avatar.png");
    return this.http.post<UploadAvatarResponse>('/api/v1/auth/chef/offer/picture/upload', formData);
  }

  create(request: ChefOfferCreateRequest): Observable<OfferDetail> {
    return this.http.post<OfferDetail>('/api/v1/auth/chef/offer/create', request);
  }

  update(request: ChefUpdateOfferRequest): Observable<OfferDetail> {
    return this.http.post<OfferDetail>('/api/v1/auth/chef/offer/update', request);
  }

  fetchOfferDetail(offerId: number): Observable<OfferDetail> {
    return this.http.post<OfferDetail>(`/api/v1/auth/chef/offer/get`, { 
      email: '',
      offerId: offerId.toString()
    });
  }

  fetchOffersByStatus(status: OfferStatus): Observable<OfferDetail[]> {
    return this.http.post<OfferDetail[]>(`/api/v1/auth/chef/offer/list/get`, { 
      email: '',
      status: status,
    });
  }
}
