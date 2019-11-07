import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private httpClient: HttpClient) { }
  
  /*********************************************************** Get All Departments *******************************************************************/

  getAllAssets(pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `assets/AssetList/${pageNo}`);
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


}
 