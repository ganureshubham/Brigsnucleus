import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, config } from 'rxjs';
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

  /***********************************************************Select Document************************************************************/

  selectDocumentType(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/selectDocumentType`);
  }

  /*********************************************************** Add New Document *******************************************************************/

  addDocumate(documentData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `document/addDocumate`, documentData);
  }

  /*********************************************************** Add Category  Document file *****************************************************************/
  docUpload(DocsData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `document/uploadCategoryDoc`, DocsData);
  }

  /*********************************************************** Edit Particular Document *******************************************************************/

  editDocumate(documentId: number, editedDocumentData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `document/updateDocumate/` + documentId, editedDocumentData);

  }

  /*********************************************************** Delete Documate *******************************************************************/

  deleteDocumate(documentId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `document/deleteDocument/` + documentId, {});
  }



}
