import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class TaskmateService {

  constructor(
    private httpClient: HttpClient
  ) { }


  /******************************************************* get All Taskmates*******************************************************************/

  getAllTaskmate(pageNo: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/taskmateList/${pageNo}`);
  }

  /******************************************************* Search Taskmates*******************************************************************/

  searchTaskmate(keyword: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/taskSearch?keyword=${keyword}`);
  }

  /******************************************************* Select  User *******************************************************************/

  getuserLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `users/selectUser`);
  }


  /******************************************************* Upload Taskmate Image  *******************************************************************/

  taskmateImageUpload(complaintId: number, taskmateimageData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `taskmate/uploadTaskmateImage/${complaintId}`, taskmateimageData);
  }

  /******************************************************* Add Taskmate *******************************************************************/

  addTaskmate(taskmateData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `taskmate/addTaskmate`, taskmateData);
  }

  /******************************************************* Delete Taskmate *******************************************************************/

  deleteTaskmate(complaintId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `taskmate/deleteTaskmate/${complaintId}`, {});
  }

  /******************************************************* View Particular Taskmate *******************************************************************/

  viewParticularTaskmate(complaintId: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/viewParticularTask/${complaintId}`);
  }

  /******************************************************* get All Task Tracklist *******************************************************************/

  getAllTaskTracklist(complaintId: number, pageNo: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/tasksTrackList/${complaintId}/${pageNo}`);
  }

  /******************************************************* Search Task Tracklist*******************************************************************/

  searchTaskTracklist(complaintId: number, keyword: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/taskTrackSearch?complaintId=${complaintId}&keyword=${keyword}`);
  }

  /******************************************************* get All Task transfer list *******************************************************************/

  getAllTaskTransferList(complaintId: number, pageNo: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/transferTasksList/${complaintId}/${pageNo}`);
  }

  /******************************************************* Search Task transfer*******************************************************************/
  searchTaskTransferlist(complaintId: number, keyword: any): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `taskmate/taskTransferSearch?complaintId=${complaintId}&keyword=${keyword}`);
  }

  /******************************************************* Select Responsible User *******************************************************************/

  getResponsibleUser(complaintId: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `complaints/selectResponsibleUsers/${complaintId}`);
  }

  /******************************************************* Add Transfer Task *******************************************************************/

  addTransferTask(complaintId: number, taskTransferData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `taskmate/addTransferTask/${complaintId}`, taskTransferData);
  }






}
