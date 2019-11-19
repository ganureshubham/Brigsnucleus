import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';
import { Observable, config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  constructor(private httpClient: HttpClient) { }
  /*********************************************************** Get All Asset Category's *******************************************************************/

  getAllAssetCategoryLists(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetcategories/categoryList`);
  }

  /***********************************************************Select Asset Category***************************************************/

  getCategoryList(): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `assetcategories/selectAssetCategory`);
  }

  /*********************************************************** Add New Asset Category *************************************************/
  addAssetCategory(AssetCategoryData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `assetcategories/addAssetCategory`, AssetCategoryData);
  }

  /*********************************************************** Edit particular Asset Category *************************************************/

  editAssetCategory(categoryId: number, editedAssetCategorydata: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assetcategories/updateAssetCategory/${categoryId}`, editedAssetCategorydata);
  }
  /*********************************************************** Delete particular Asset Category *************************************************/

  deleteAssetCategory(categoryId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assetcategories/deleteAssetCategory/${categoryId}`, {});
  }




}