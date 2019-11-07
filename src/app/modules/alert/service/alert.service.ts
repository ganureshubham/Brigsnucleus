import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private httpClient:HttpClient,          
    ) { }

    /***********************************************************get all Alerts************************************************************/

  getAlertList(pageNo:number):Observable<any>{
    return this.httpClient.get<any>(ConfigurationService.baseUrl +`alerts/AlertList/${pageNo}` );
  }

  /***********************************************************View Particular Asset************************************************************/

  viewAlert(alertId:number):Observable<any>{
    return this.httpClient.get<any>(ConfigurationService.baseUrl+`alerts/viewParticularAlert/${alertId}`);
  }

   /*********************************************************** Delete Selected Alert *******************************************************************/

   deleteAlert(alertId: number): Observable<any> { 
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `alerts/deleteAlert/` + alertId, {});

  }

} 
