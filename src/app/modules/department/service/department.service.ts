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
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `departments/selectDepartment`);
  }

  /*********************************************************** Get All Departments ************************************************/
  getAllDept(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `departments/departmentList`);
  }

  /*********************************************************** Add New Department *************************************************/
  addDept(deptData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `departments/addDepartment`, deptData);
  }

  /*********************************************************** Edit particular Department *************************************************/

  editDept(departmentId: number, editedDeptdata: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `departments/updateDepartment/${departmentId}`, editedDeptdata);
  }

  /*********************************************************** Delete particular Department *************************************************/

  deleteDept(departmentId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `departments/deleteDepartment/${departmentId}`, {});
  }



}
