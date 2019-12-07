import { Injectable } from '@angular/core';

import { Observable, config } from 'rxjs';
import { getTestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class LocationTypeService {

  constructor(
    private httpClient: HttpClient
  ) { }


  /*******************************************Get All Location List****************************************************************/

  getAllLocationList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `installationLocation/listOfInstallationLocation`);

  }

  /*******************************************Add New Installation Location ********************************************************/

  addInstallationLoc(InstallationLocData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `installationLocation/addInstallationLocation`, InstallationLocData);
  }

  /*******************************************Update New Installation Location ********************************************************/

  editInstallationLoc(installationLocationTypeId: number, InstallationLocData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `installationLocation/updateInstallationLocation/${installationLocationTypeId}`, InstallationLocData);
  }




  /*******************************************Delete Particular Installation Location ********************************************************/

  deleteInstallationLoc(installationLocationTypeId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `installationLocation/deleteInstallationLocation/${installationLocationTypeId}`, {});
  }


}
