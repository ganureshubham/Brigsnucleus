import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  constructor(private httpClient:HttpClient) { }
  /*********************************************************** Get All Departments *******************************************************************/

  getAllDepartments(pageNo:number) : Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `departments/departmentList/${pageNo}`);
  }
}