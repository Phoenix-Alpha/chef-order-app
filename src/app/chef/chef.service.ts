import { ChefWalletActivateResponse, ChefWalletInfo } from './chef-wallet/+state/wallet.reducer';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChefActivateWalletRequest, ChefDetail, ChefRegistrationDetail, ChefWalletStripeDashboardLoginResponse, UpdateChefProfileRequest, UploadAvatarResponse } from './chef';

function dataUrltoFile(dataurl, filename) {
  let arr = dataurl.split(','),
  mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]),
  n = bstr.length,
  u8arr = new Uint8Array(n);

  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  // return new Blob([u8arr], filename, { type:mime });
  return new Blob([u8arr], { type: mime });
}

@Injectable({
  providedIn: 'root'
})
export class ChefService {
  constructor(private http: HttpClient, private store: Store<any>) { }

  uploadAvatar(imageData: string): Observable<UploadAvatarResponse> {
    const blob = dataUrltoFile(imageData, "avatar.png")
    const formData = new FormData();
    formData.append('file', blob, "avatar.png");
    return this.http.post<UploadAvatarResponse>('/api/v1/auth/chef/avatar/upload', formData);
  }

  updateAvatar(imageData: string): Observable<UploadAvatarResponse> {
    const blob = dataUrltoFile(imageData, "avatar.png")
    const formData = new FormData();
    formData.append('file', blob, "avatar.png");
    return this.http.post<UploadAvatarResponse>('/api/v1/auth/chef/avatar/update', formData);
  }

  register(data: ChefRegistrationDetail): Observable<ChefDetail> {
    return this.http.post<ChefDetail>('/api/v1/auth/chef/register', data);
  }

  fetchChefDetail(): Observable<ChefDetail> {
    return this.http.get<ChefDetail>(`/api/v1/auth/chef/get`);
  }

  updateProfile(request: UpdateChefProfileRequest): Observable<ChefDetail> {
    return this.http.post<ChefDetail>('/api/v1/auth/chef/update', request);
  }

  // activateWallet(request: ChefActivateWalletRequest): Observable<ChefWalletActivateResponse> {
  //   return this.http.post<ChefWalletActivateResponse>('/api/v1/auth/chef/wallet/activate', request);
  // }
  activateWallet(): Observable<ChefWalletActivateResponse> {
    return this.http.post<ChefWalletActivateResponse>('/api/v1/auth/chef/wallet/activate', {});
  }

  getWalletInfo(): Observable<ChefWalletInfo> {
    return this.http.get<ChefWalletInfo>('/api/v1/auth/chef/wallet/get');
  }

  redirectToStripeDashboard(): Observable<ChefWalletStripeDashboardLoginResponse> {
    return this.http.post<ChefWalletStripeDashboardLoginResponse>('/api/v1/auth/chef/wallet/stripe-dashboard', {});
  }
}
