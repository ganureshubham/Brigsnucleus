import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/public service/configuration.service';

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

}
