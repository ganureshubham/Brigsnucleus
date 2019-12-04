import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllOrganizations() {
    return this.httpClient.get(ConfigurationService.baseUrl + `organization/selectOrganization`);
  }

  searchOrganization(keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `organization/organizationSearch?keyword=${keyword}`);
  }

  addOrganization(organizationDetails) {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `organization/addOrganization`, organizationDetails);
  }

  editOrganization(organizationId, organizationDetails) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `organization/updateOrganization/${organizationId}`, organizationDetails);
  }

}