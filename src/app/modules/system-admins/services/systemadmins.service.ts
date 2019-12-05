import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SystemadminsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllAdmins(pageNo) {
    return this.httpClient.get(ConfigurationService.baseUrl + `admin/listOfAdmins/${pageNo}`);
  }

  searchAdmin(keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `admin/adminSearch?keyword=${keyword}`);
  }

  deleteAdmin(adminId) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `admin/deleteAdmin/${adminId}`, {});
  }

  getAllOrganizations() {
    return this.httpClient.get(ConfigurationService.baseUrl + `organization/selectOrganization`);
  }

  addAdmin(adminDetails) {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `admin/addAdmin`, adminDetails);
  }

  editAdmin(adminId, adminDetails) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `admin/updateAdmin/${adminId}`, adminDetails);
  }

}
