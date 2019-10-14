import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private httpClient: HttpClient) { }
  /*********************************************************** Get All Suppliers *******************************************************************/

  getAllSuppliers(pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `suppliers/listOfSuppliers/${pageNo}`);
  }

  /*********************************************************** Add Suppliers *******************************************************************/
  addSupplier(supplierData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `suppliers/addSupplier`, supplierData);

  }

  /*********************************************************** Edit Particular Suppliers *******************************************************************/

  editSupplier(supplierId: number, editedsupplierData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `suppliers/updateSupplier/` + supplierId, editedsupplierData);

  }

  /*********************************************************** Delete Particular Suppliers *******************************************************************/

  deleteSupplier(supplierId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `suppliers/deleteSupplier/` + supplierId, {});

  }
}
