import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, first, flatMap, map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authEndpoint = /api/gi;
    
    let requestUrl = request.url;
    // if the request URL have the string prefix, 
    // then make the replace by the correct url 
    if (requestUrl.indexOf('/api/') !== -1) {
      requestUrl = environment.backend.baseURL + requestUrl; 
    } else if (requestUrl.indexOf('api/') !== -1) {
      requestUrl = environment.backend.baseURL + '/' + requestUrl; 
    }
    // clone the http request
    request = request.clone({
      url: requestUrl
    });
    // move to next HttpClient request life cycle
    return next.handle(request);
  }


}
