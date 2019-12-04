import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { complaintList } from '../../../model/complaints';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  constructor(private httpClient: HttpClient) { }


  /******************************************************* get All Complaints*******************************************************************/

  getAllComplaints(pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/complaintsList/${pageNo}`);

  }

  /******************************************************* Search Complaint*******************************************************************/


  searchComplaint(keyword: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/complaintSearch?keyword=${keyword}`);

  }

  /******************************************************* Select  Asset Title *******************************************************************/

  selectAssetTitle(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/selectAssets`);
  }

  /******************************************************* Select User *******************************************************************/

  getuserLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `users/selectUser`);
  }

  /******************************************************* Add Complaint *******************************************************************/

  addComplaint(complaintData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `complaints/addComplaint`, complaintData);
  }

  /******************************************************* Delete Complaint *******************************************************************/

  deleteComplaint(complaintId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `complaints/deleteComplaint/${complaintId}`, {})
  }

  /******************************************************* Upload Complaint Image  *******************************************************************/

  imageUpload(complaintId: number, imageData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `complaints/uploadComplaintImage/${complaintId}`, imageData);
  }




}
