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

  /******************************************************* Select  User *******************************************************************/

  getuserLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `users/selectUser`);
  }

  /******************************************************* Select Responsible User *******************************************************************/

  getResponsibleUser(complaintId: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/selectResponsibleUsers/${complaintId}`);
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

  /******************************************************* View Particular Complaint *******************************************************************/

  viewComplaint(complaintId: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/viewParticularComplaint/${complaintId}`);

  }

  /******************************************************* get All Complaint Track*******************************************************************/

  getAllComplaintsTrack(complaintId: number, pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/complaintsTrackList/${complaintId}/${pageNo}`);
  }

  /******************************************************* Search Complaint Track*******************************************************************/

  searchComplaintTrack(complaintId: number, keyword: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/complaintTrackSearch?complaintId=${complaintId}&keyword=${keyword}`);
  }


  /******************************************************* get All Transfer Complaints*******************************************************************/

  getAllTransferComplaints(complaintId: number, pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/transferComplaintsList/${complaintId}/${pageNo}`);

  }

  /******************************************************* Search Complaint Transfer*******************************************************************/

  searchComplaintTransfer(complaintId: number, keyword: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/complaintTransferSearch?complaintId=${complaintId}&keyword=${keyword}`);
  }

  /******************************************************* Add New Complaint Transfer*******************************************************************/

  addComplaintTransfer(complaintId: number, complaintTransferData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `complaints/addTransferComplaint/${complaintId}`, complaintTransferData);
  }


  /******************************************************* Delete Complaint  Transfer*******************************************************************/

  deleteComplaintTransfer(complaintId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `complaints/deleteTransferComplaint/${complaintId}`, {});
  }



}
