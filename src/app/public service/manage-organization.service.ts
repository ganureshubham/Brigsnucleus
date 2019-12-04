import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ManageOrganizationService {

  constructor(
    private _http: HttpClient,
  ) { }

  getAllOrganizations() {
    return this._http.get(ConfigurationService.baseUrl + `organization/selectOrganization`);
  }

  getOrganizationSpecificToken(organizationId) {
    return this._http.get(ConfigurationService.baseUrl + `organization/getOrganizationSpecificToken/${organizationId}`);
  }

}
