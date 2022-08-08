import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChefHandlePendingRequest, ChefOrderConfirmDeliveryRequest, ChefOrderDetail, OrderStatus } from './order';

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
export class ChefOrderService {
  constructor(private http: HttpClient, private store: Store<any>) { }

  fetchOrderDetail(orderUuid: string): Observable<ChefOrderDetail> {
    return this.http.post<ChefOrderDetail>(`/api/v1/auth/chef/order/get`, { 
      email: '',
      orderUuid: orderUuid
    });
  }

  fetchPendingOrders(): Observable<ChefOrderDetail[]> {
    return this.http.post<ChefOrderDetail[]>(`/api/v1/auth/chef/order/list/get`, { 
      email: '',
      statusList: [
        OrderStatus.SUBMITTED,
        OrderStatus.RECEIVED,
      ],
    });
  }

  fetchInprepOrders(): Observable<ChefOrderDetail[]> {
    return this.http.post<ChefOrderDetail[]>(`/api/v1/auth/chef/order/list/get`, { 
      email: '',
      statusList: [
        OrderStatus.APPROVED,
      ],
    });
  }

  fetchHistoryOrders(): Observable<ChefOrderDetail[]> {
    return this.http.post<ChefOrderDetail[]>(`/api/v1/auth/chef/order/list/get`, { 
      email: '',
      statusList: [
        OrderStatus.CHEFCANCELLED,
        OrderStatus.CUSTOMERCANCELLED,
        OrderStatus.CONFIRMED,
        OrderStatus.REJECTED,
        OrderStatus.DISPUTED
      ],
    });
  }

  handlePendingOrder(request: ChefHandlePendingRequest) {
    return this.http.post<any>(`/api/v1/auth/chef/order/handle`, request);
  }

  confirmDelivery(request: ChefOrderConfirmDeliveryRequest) {
    return this.http.post<any>(`/api/v1/auth/chef/order/confirm-delivery`, request);
  }
}
