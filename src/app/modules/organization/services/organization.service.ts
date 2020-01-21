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

  getListOfOrganizations(pageNo) {
    return this.httpClient.get(ConfigurationService.baseUrl + `organization/listOfOrganizations/${pageNo}`);
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

  deleteOrganization(organizationId) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `organization/deleteOrganization/${organizationId}`, {});
  }

  getOrganizationSpecificToken(organizationId) {
    return this.httpClient.get(ConfigurationService.baseUrl + `organization/getOrganizationSpecificToken/${organizationId}`);
  }

  getOrgFeatures() {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `organization/listOfOrgFeatures`);
  }

  updateOrgConfig(organizationId: number, body: any) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `organization/upadateOrgconfig/${organizationId}`, body);
  }

}