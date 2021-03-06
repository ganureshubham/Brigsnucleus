import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AssetmateService {

  private badgeUpdateActionAssetDetails = new BehaviorSubject<boolean>(false);
  private badgeUpdateActionAssetList = new BehaviorSubject<boolean>(false);
  private badgeUpdateActionQuestionList = new BehaviorSubject<boolean>(false);
  private tabSelectionDetails = new BehaviorSubject<number>(0);

  private filterCriteria = new BehaviorSubject<{
    locationType: [],
    manufacturer: [],
    supplier: [],
    department: []
  }>(
    {
      locationType: [],
      manufacturer: [],
      supplier: [],
      department: []
    }
  );


  constructor(private httpClient: HttpClient) { }

  /**********************************************  Assetmate Home Category  Starts ********************************************************************/

  getAllRootCateg(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetHome/allRootCategories`);
  }

  getCategoryPrimaryInfo(categoryId: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetHome/allCategories/${categoryId}`);
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

  searchAsset(body, keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/filterAllAssetsSearch?categoryId=${body.categoryId}&keyword=${body.keyword}&manufacturerIdFK=${body.manufacturerIdFK}&supplierIdFK=${body.supplierIdFK}&departmentIdFK=${body.departmentIdFK}&installationLocationTypeIdFK=${body.installationLocationTypeIdFK}`);
  }

  /*********************************************************** Get All Assets List ***********************************************************/

  // getAllAssets(categoryId: number, pageNo: number): Observable<any> {
  //   return this.httpClient.get(ConfigurationService.baseUrl + `assets/AssetList/${categoryId}/${pageNo}`);
  // }

  getAllAssets(
    categoryId: number,
    manufacturerIdFK: string,
    supplierIdFK: string,
    departmentIdFK: string,
    installationLocationTypeIdFK: string,
    pageNo: number
  ): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `assets/AssetList/${categoryId}/${manufacturerIdFK}/${supplierIdFK}/${departmentIdFK}/${installationLocationTypeIdFK}/${pageNo}`);
  }

  // getAllAssets(
  //   categoryId: number,
  //   manufacturerIdFK: number,
  //   supplierIdFK: number,
  //   departmentIdFK: number,
  //   installationLocationTypeIdFK: number,
  //   pageNo: number
  // ): Observable<any> {
  //   return this.httpClient.get(ConfigurationService.baseUrl + `assets/AssetList/${categoryId}/${pageNo}`);
  // }

  getAllAssetsByCategoryId(categoryId: number) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/assetQrCodeDetailsList/${categoryId}`);
  }

  getChecklistImage(imageId: any) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/getChecklistImage/${imageId}`);
  }

  getAllPendingVerificationAssets(pageNo) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/listOfPendingVerifiedAssets/${pageNo}`);
  }

  /*********************************************************** Activate/De-activate Particular Asset *******************************************************************/

  assetActive(assetId: number, body: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/setAssetIsActiveStatus/${assetId}`, body);
  }

  /*********************************************************** verify Asset *******************************************************************/

  verifyAsset(assetId: number, verified: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/updateVerifiedAsset/${assetId}`, verified);
  }

  getAssetLocation(assetId, pageNo) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/assetLocationLatLong/${assetId}/${pageNo}`);
  }

  getAssetTransferLog(assetId, pageNo) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/assetTranferLocationList/${assetId}/${pageNo}`);
  }

  /*********************************************************** Retire/Un-retire Particular Asset *******************************************************************/

  assetRetire(assetId: number, body: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/setAssetIsRetiredStatus/${assetId}`, body);

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

  transferAsset(assetId, body) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/assetTransferLocation/` + assetId, body);
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

  getChecklistPrimaryInfoByChecklistId(checklistId) {
    return this.httpClient.get(ConfigurationService.baseUrl + `checklists/viewParticularChecklist/${checklistId}`);
  }

  getChecklistQuestions(checklistId, pageNo) {
    return this.httpClient.get(ConfigurationService.baseUrl + `questions/questionsList/${checklistId}/${pageNo}`);
  }

  getAllChecklistQuestions(checklistId) {
    return this.httpClient.get(ConfigurationService.baseUrl + `questions/sequenceQuestionsList/${checklistId}`);
  }

  addChecklistQuestion(checklistQuestion): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `questions/addQuestion`, checklistQuestion);
  }

  updateChecklistQuestion(checklistQuestion) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `questions/updateQuestion`, checklistQuestion);
  }

  linkChecklistQuestion(questionOptionId, checklistQuestion) {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `questions/addLinkQuestion/${questionOptionId}`, checklistQuestion);
  }

  deleteChecklistQuestionOption(questionOptionId) {
    return this.httpClient.delete<any>(ConfigurationService.baseUrl + `questions/deleteQuestionOption/${questionOptionId}`);
  }

  getQuestionDetails(checklistQuestionId) {
    return this.httpClient.get(ConfigurationService.baseUrl + `questions/viewParticularQuestionWithOptions/${checklistQuestionId}`);
  }

  updateCheckListQuestionSequence(sequenceNumber) {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `questions/updateSequenceQuestion`, sequenceNumber);
  }

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

  deleteCheckListQuestion(checkListQuestionId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.httpClient.delete(ConfigurationService.baseUrl + `questions/deleteQuestion/${checkListQuestionId}`, httpOptions);
  }

  getCheckListQuestionTypes() {
    return this.httpClient.get(ConfigurationService.baseUrl + `questions/selectQuestionType`);
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

  /*********************************************************** Search Document of category *******************************************************************/

  searchDocumentByCategoryId(keyword, categoryId) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/documentSearchByCategoryId?categoryId=${categoryId}&keyword=${keyword}`);
  }

  /*********************************************************** Search Document of asset *******************************************************************/

  searchDocumentByAssetId(keyword, assetId) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `document/documentSearchByAssetId?assetId=${assetId}&keyword=${keyword}`);
  }

  /********************************************** Assigned User Starts *****************************************************************/


  /*********************************************************** Get All Assigned User **********************************/

  getAllAssignUsers(pageNo: number, categoryId: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `userCatAssign/listOfAssignedUsersByCategoryId/${categoryId}/${pageNo}`);
  }

  /*********************************************************** Get All Asset Assigned User **********************************/
  getAllAssignUsersToAsset(pageNo: number, assetId: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `userCatAssign/listOfAssignedUsersByAssetId/${assetId}/${pageNo}`);
  }

  /*********************************************************** Search Assigned User *******************************************************************/

  searchAssignUsers(keyword) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/userAssignSearch?keyword=${keyword}`);
  }

  /*********************************************************** Search Assigned User To Category*******************************************************************/

  searchAssignUsersToCategory(keyword, categoryId) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/userAssignSearchByCategoryId?keyword=${keyword}&categoryId=${categoryId}`);
  }

  /*********************************************************** Search Assigned User To Asset*******************************************************************/

  searchAssignUsersToAsset(keyword, assetId) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/userAssignSearchByAssetId?keyword=${keyword}&assetId=${assetId}`);
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

  getAlreadyAssignedUserList(categoryId) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/assignedUsersByCategoryId/${categoryId}`);
  }

  getAlreadyAssignedUserListForAsset(assetId) {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `userCatAssign/assignedUsersByAssetId/${assetId}`);
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

  getQuestAnsListForPDF(doneChecklistIdFK: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assets/printAudit/${doneChecklistIdFK}`);
  }

  getBadgeUpdateAction(component: string): Observable<boolean> {
    if (component == 'assetDetails') {
      return this.badgeUpdateActionAssetDetails.asObservable();
    } else if (component == 'assetList') {
      return this.badgeUpdateActionAssetList.asObservable();
    } else if (component == 'questionList') {
      return this.badgeUpdateActionQuestionList.asObservable();
    }
  }

  setBadgeUpdateAction(component: string, action: boolean) {
    if (component == 'assetDetails') {
      this.badgeUpdateActionAssetDetails.next(action);
    } else if (component == 'assetList') {
      this.badgeUpdateActionAssetList.next(action);
    } else if (component == 'questionList') {
      this.badgeUpdateActionQuestionList.next(action);
    }

  }

  getTabSelection(component: string): Observable<number> {
    if (component == 'checklistTab') {
      return this.tabSelectionDetails.asObservable();
    }
  }

  setTabSelection(component: string, action: number) {
    if (component == 'checklistTab') {
      this.tabSelectionDetails.next(action);
    }
  }

  setFilterCriteria(filterData) {
    this.filterCriteria.next({
      locationType: filterData.installationLocationTypeIdFK,
      manufacturer: filterData.manufacturerIdFK,
      supplier: filterData.supplierIdFK,
      department: filterData.departmentIdFK
    });
  }

  getFilterCriteria(): Observable<{
    locationType: [],
    manufacturer: [],
    supplier: [],
    department: []
  }> {
    return this.filterCriteria.asObservable();
  }

}
