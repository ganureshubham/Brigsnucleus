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




  /********************************** Super-Admin Dashboard*****************************************************************/


  getSuperAdminDashboardDetails(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/superAdminCount`);
  }

  getMonthlyOrgGraphData(year: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/monthlyOrganizationCreationCounts/${year}`);

  }

  getTopOrgGraphData(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/topOrganizationsAssetsCounts`);

  }

  getDashboardDetails(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/home`);
  }



  /********************************** Admin Dashboard*****************************************************************/

  getMonthlyAssetAdded(year: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/monthlyAssetCreationCounts/${year}`);
  }

  monthlyComplaintsAssigned(year: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/monthlyComplaintsAssignedCounts/${year}`);

  }

  categoryWiseAssets(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/categoryWiseAssetsCounts`);
  }

  categoryWiseMaintainance(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/categoryPendingMaintenceAssetsCounts`);

  }

  installationLocWiseAsset(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `dashboard/installationLocationWiseAssetsCounts`);
  }

}
