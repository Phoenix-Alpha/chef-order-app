import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { OrderStatus, PublicOrderResponse } from '../checkout/checkout';
import { Device } from '@ionic-native/device/ngx';
import { PublicOrderSubmitReviewRequest } from './public-order';

@Injectable({
  providedIn: 'root'
})
export class PublicOrderService {
  constructor(private http: HttpClient,
    private store: Store<any>,
    private device: Device) { }

  fetchOrderDetail(orderUuid: string): Observable<PublicOrderResponse> {
    return this.http.post<PublicOrderResponse>(`/api/v1/order/get`, { 
      deviceIdentifier: this.device.uuid,
      orderUuid: orderUuid
    });
  }

  fetchPendingOrders(): Observable<PublicOrderResponse[]> {
    return this.http.post<PublicOrderResponse[]>(`/api/v1/order/list/get`, { 
      deviceIdentifier: this.device.uuid,
      statusList: [
        OrderStatus.SUBMITTED,
        OrderStatus.RECEIVED,
      ],
    });
  }

  fetchInprepOrders(): Observable<PublicOrderResponse[]> {
    return this.http.post<PublicOrderResponse[]>(`/api/v1/order/list/get`, { 
      deviceIdentifier: this.device.uuid,
      statusList: [
        OrderStatus.APPROVED,
      ],
    });
  }

  fetchHistoryOrders(): Observable<PublicOrderResponse[]> {
    return this.http.post<PublicOrderResponse[]>(`/api/v1/order/list/get`, { 
      deviceIdentifier: this.device.uuid,
      statusList: [
        OrderStatus.CHEFCANCELLED,
        OrderStatus.CUSTOMERCANCELLED,
        OrderStatus.CONFIRMED,
        OrderStatus.REVIEWED,
        OrderStatus.REJECTED,
        OrderStatus.DISPUTED
      ],
    });
  }

  submitPublicOrderReview(request: PublicOrderSubmitReviewRequest): Observable<PublicOrderResponse> {
    return this.http.post<PublicOrderResponse>(`/api/v1/order/review`, request);
  }

}
