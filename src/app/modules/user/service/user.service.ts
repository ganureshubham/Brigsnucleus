import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  /*********************************************************** Get All Users *******************************************************************/

  getAllUsers(departmentId: number, pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `users/listOfUsers/${departmentId}/${pageNo}`);
  }

  /*********************************************************** Get All Departments ************************************************/
  getAllDepts(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `departments/departmentList`);
  }

  /*********************************************************** Add New User *******************************************************************/

  addUser(userData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `users/addUser`, userData);
  }

  /*********************************************************** Add User Photo *****************************************************************/
  photoUpload1(photoData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `users/uploadProfileImage`, photoData);
  }

  /*********************************************************** Edit Particular User *******************************************************************/

  editUser(userId: number, editedUserData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `users/updateUser/` + userId, editedUserData);

  }

  /*********************************************************** Delete Selected User *******************************************************************/

  deleteUser(userId: number) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `users/deleteUser/` + userId, {});
  }

  /***********************************************************Select Department************************************************************/

  getDeptList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `departments/selectDepartment`);
  }

  getUserRoleList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `users/selectUserRole`);
  }

}
