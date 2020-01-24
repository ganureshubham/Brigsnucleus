import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }


  /**************************************************Get Profile Details***************************************************************************/
  getProfile() {
    return this.httpClient.get(ConfigurationService.baseUrl + `profile/viewAdminProfile`);
  }

  /**************************************************Change Admin Password***************************************************************************/

  changePassword(value: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `profile/changepassword`, value);
  }

  /**************************************************Change Super Admin Password***************************************************************************/

  changeSuperAdminPassword(value: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `profile/changepasswordbysuperadmin`, value);
  }

}
