import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService { 

  constructor(private httpClient: HttpClient) { }  

  /***********************************************************Select Department***************************************************/

  getDeptList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl +`departments/selectDepartment`);
  }

/*********************************************************** Get All Departments ************************************************/
  getAllDept(parentId :number):Observable<any>{
    return this.httpClient.get<any>(ConfigurationService.baseUrl +`departments/departmentList/${parentId}`);
  }

/*********************************************************** Add New Department *************************************************/
  addDept(deptData:any):Observable<any>{
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `departments/addDepartment`,deptData); 
  }
}
