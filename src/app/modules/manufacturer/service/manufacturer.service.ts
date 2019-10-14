import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../public service/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private httpClient: HttpClient) { }
  /*********************************************************** Get All manufacturers *******************************************************************/

  getAllmanufacturers(pageNo: number): Observable<any> {
    return this.httpClient.get(ConfigurationService.baseUrl + `manufacturers/listOfManufacturer/${pageNo}`);
  }

  /*********************************************************** Add manufacturers *******************************************************************/
  addmanufacturer(manufacturerData: any): Observable<any> {
    return this.httpClient.post<any>(ConfigurationService.baseUrl + `manufacturers/addManufacturer`, manufacturerData);

  }

  /*********************************************************** Edit Particular manufacturer *******************************************************************/

  editmanufacturer(manufacturerId: number, editedmanufacturerData: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `manufacturers/updateManufacturer/` + manufacturerId, editedmanufacturerData);

  }

  /*********************************************************** Delete Particular manufacturers *******************************************************************/

  deletemanufacturer(manufacturerId: number): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `manufacturers/deleteManufacturer/` + manufacturerId, {});

  }
}
