import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }
  /*********************************************************** Get All Roles *******************************************************************/

  getAllRoles(pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `userroles/listOfUserRoles/${pageNo}`);
  }

  /*********************************************************** Add Roles *******************************************************************/
  addRole(roleData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `userroles/addUserRole`, roleData);

  }

  /*********************************************************** Edit Particular Role *******************************************************************/

  editRole(userRoleId: number, editedRoleData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `userroles/UpdateUserRole/` + userRoleId, editedRoleData);

  }

  /*********************************************************** Delete Particular Role *******************************************************************/

  deleteRole(userRoleId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `userroles/deleteUserRole/` + userRoleId, {});

  }

} 
