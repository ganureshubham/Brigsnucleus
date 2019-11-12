import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DocumateService {

  constructor(
    private httpClient: HttpClient) { }

  /******************************************************* get All Documate*******************************************************************/
  getAllDocumates(pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/listOfDocuments/${pageNo}`);

  }

  /******************************************************* Search Documate*******************************************************************/

  searchDocumate(keyword): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/documentSearch?keyword=${keyword}`);


  }


}
