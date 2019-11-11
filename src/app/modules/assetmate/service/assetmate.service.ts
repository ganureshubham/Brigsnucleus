import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AssetmateService {

  constructor(private httpClient: HttpClient) { }

  /**********************************************  Assetmate Home Category  Starts ********************************************************************/

  getAllRootCateg(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetHome/allRootCategories`);
  }

  searchCategory(keyword): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetHome/categorySearch?keyword=${keyword}`);
  }

  /**********************************************  category Filter ********************************************************************/

  filterCategoryList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetcategories/categoryList`);
  }


  /**********************************************  Asset Starts **************************************************************************************************************/


  /*********************************************************** Search Assets *******************************************************************/

  searchAsset(categoryId, keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/AssetSearch?categoryId=${categoryId}&keyword=${keyword}`);
  }

  /*********************************************************** Get All Assets List *******************************************************************/

  getAllAssets(categoryId: number, pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `assets/AssetList/${categoryId}/${pageNo}`);
  }

  /*********************************************************** Get All Documents *************************************/

  getAllAssetDocuments(assetId: number, pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `document/listOfDocumentsByAssetId/${assetId}/${pageNo}`);
  }

  /*********************************************************** Add New Asset *******************************************************************/

  addAsset(assetData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `assets/addAsset`, assetData);
  }

  /*********************************************************** Add Asset Photo *****************************************************************/
  photoUpload(photoData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `assets/uploadAssetImage`, photoData);
  }

  /*********************************************************** Add Asset Document *****************************************************************/
  docUpload(DocData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `assets/uploadAssetDoc`, DocData);
  }


  /*********************************************************** Edit Particular Asset *******************************************************************/

  editAsset(assetId: number, editedAssetData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/upadateAsset/` + assetId, editedAssetData);

  }

  /*********************************************************** Get Installation Location List *******************************************************************/

  getDetails(assetId): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/viewParticularAsset/${assetId}`);
  }


  /*********************************************************** Get Installation Location List *******************************************************************/

  getLocationList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/selectInstallationLocationType`);
  }

  /***********************************************************Select Department************************************************************/

  getDeptList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `departments/selectDepartment`);
  }

  /*********************************************************** Delete Selected Asset *******************************************************************/

  deleteAsset(assetId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/deleteAsset/` + assetId, {});

  }

  /***********************************************************Select Manufacturer************************************************************/

  getManufList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/selectManufacturer`);
  }

  /*********************************************************** Select Supplier ************************************************************/

  getsuppList(): Observable<any> {

    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/selectSupplier`);
  }

  /*********************************************************** Select Category ************************************************************/

  getcategoryList(): Observable<any> {

    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetcategories/selectAssetCategory`);
  }


  /***********************************************************Select check & Warrenty duration************************************************************/

  getDurationList(): Observable<any> {

    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/selectDurationType`);
  }

  /***********************************************************View Particular Asset************************************************************/

  viewAsset(assetId: number): Observable<any> {

    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/viewParticularAsset/${assetId}`);
  }


  /**********************************************  Checklist Starts ********************************************************************************************/


  /*********************************************************** Get All Checklists ********************************/

  getAllChecklists(categoryId: number, pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `questions/listOfCheckListWithQuestions/${categoryId}/${pageNo}`);
  }

  /*********************************************************** Select Asset Category *******************************************************************/

  getCategoryList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetcategories/selectAssetCategory`);
  }

  /***********************************************************Add New Checklist *******************************************************************/

  addChecklist(checklistData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `checklists/addChecklist`, checklistData);

  }

  /***********************************************************Edit Checklist *******************************************************************/

  editChecklist(checklistId: number, editedChecklistData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `checklists/updateChecklist/${checklistId}`, editedChecklistData);
  }

  /*********************************************************** Delete Selected Checklist *******************************************************************/

  deleteChecklist(checklistId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `checklists/deleteChecklist/` + checklistId, {});

  }

  /*********************************************************** Search Checklist *******************************************************************/

  searchChecklist(categoryIdFK, keyword) {
    return this.httpClient.get(ConfigurationService.baseUrl + `questions/allChecklistSearch?categoryIdFK=${categoryIdFK}&keyword=${keyword}`);

  }

  /********************************************** Category Document Starts *****************************************************************/


  /*********************************************************** Get All Documents *************************************/

  getAllDocuments(categoryId: number, pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `document/listOfDocumentsByCategoryId/${categoryId}/${pageNo}`);
  }

  /***********************************************************Select Document************************************************************/

  getDocumentList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/selectDocumentType`);
  }

  /***********************************************************Select Category************************************************************/

  getcategoryLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetcategories/selectAssetCategory`);
  }

  /***********************************************************Select Asset************************************************************/
  getAssetLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/selectAsset`);
  }




  /*********************************************************** Add New Document *******************************************************************/

  addDocument(documentData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `document/addDocument`, documentData);
  }

  /*********************************************************** Add Category  Document file *****************************************************************/
  docsUpload(DocsData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `document/uploadCategoryDoc`, DocsData);
  }

  /*********************************************************** Delete Selected Document *******************************************************************/

  deleteDocument(documentId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `document/deleteDocument/` + documentId, {});

  }

  /*********************************************************** Edit Particular Document *******************************************************************/

  editDocument(documentId: number, editedDocumentData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `document/updateDocument/` + documentId, editedDocumentData);

  }

  /*********************************************************** Search Document *******************************************************************/

  searchDocument(keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/documentSearch?keyword=${keyword}`);
  }


  /********************************************** Assigned User Starts *****************************************************************/


  /*********************************************************** Get All Assigned User **********************************/

  getAllAssignUsers(pageNo: number, categoryId: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `userCatAssign/listOfAssignedUsersByCategoryId/${categoryId}/${pageNo}`);
  }

  /*********************************************************** Search Assigned User *******************************************************************/

  searchAssignUsers(keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/userAssignSearch?keyword=${keyword}`);
  }

  /*********************************************************** Delete Selected  Assigned User *******************************************************************/

  deleteAssignUsers(userCatAssignmentId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `userCatAssign/deleteAssignedUser/` + userCatAssignmentId, {});

  }

  /***********************************************************Select Assignment Type************************************************************/

  getassignmentLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/selectAssignmentType`);
  }

  /***********************************************************Select User************************************************************/

  getuserLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `users/selectUser`);
  }

  /*********************************************************** Add New Assign User *******************************************************************/

  addAssignUser(assignUserData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `userCatAssign/addAssignUser`, assignUserData);
  }



  /*********************************************************** History Starts *******************************************************************/

  doneChecklistLists(assetIdFK: number, pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/assetHistory/${assetIdFK}/${pageNo}`);
  }

  getQuestAnsList(doneChecklistIdFK: number, pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/questionAnswer/${doneChecklistIdFK}/${pageNo}`);
  }





}
