import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from './types/Country';
import { Observable } from 'rxjs';
import { NonPageableResults } from './types/NonPageable';
import { Language } from './types/Language';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  constructor(private http: HttpClient) { }

  getCountries(): Observable<NonPageableResults<Country>> {
    return this.http.get<NonPageableResults<Country>>('/api/v1/refdata/countries');
  }

  getLanguages(): Observable<NonPageableResults<Language>> {
    return this.http.get<NonPageableResults<Language>>('/api/v1/refdata/languages');
  }
}
