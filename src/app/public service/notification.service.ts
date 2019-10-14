import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/mergeMapTo';
import 'rxjs/add/observable/timer';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  baseUrl = ConfigurationService.baseUrl;
  
  constructor(private httpClient: HttpClient) { }

  

  

  getDashboardDetails(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/home` );
  }




}
