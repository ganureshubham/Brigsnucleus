import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/public service/configuration.service';
import { config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private httpClient: HttpClient) { }

  getPendingComplaints(topComplaintsCount) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/pendingComplaintsList/${topComplaintsCount}`);
  }

  getPendingTasks(topTasksCount) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/pendingTasksList/${topTasksCount}`);
  }

  getCriticalConditionAssets(pageNo) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/criticalConditionAssetsList/${pageNo}`);
  }

  getAllCriticalConditionAssets() {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/criticalConditionAssetsListWithoutPagination`);
  }

  getPendingMaintainanceAssets(pageNo) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `dashboard/getMaintenanceNotDoneAssets/${pageNo}`);
  }

  getAllPendingMaintainanceAssets() {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `dashboard/getMaintenanceNotDoneAssetsWithoutPagination`);
  }

  getAllAssetList(categoryId: number) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/CategoryAssetList/${categoryId}`);
  }

  getAssetList(categoryId: number, pageNo: any) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/CategoryAssetListWithPagination/${categoryId}/${pageNo}`);
  }

  getOrgLevelAssetsPagination(pageNo: any) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/OrganizationWiseAssetList/${pageNo}`);
  }

  getOrgLevelAssets() {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/OrganizationWiseAssetListWithoutPagination`);
  }



}
