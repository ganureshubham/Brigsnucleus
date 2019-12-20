import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../../public service/configuration.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class VerifyAssetService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /********************************** Verify Asset *****************************************************************/

  verifyAsset(assetId: number, verified: any): Observable<any> {
    return this.httpClient.put<any>(ConfigurationService.baseUrl + `assets/updateVerifiedAsset/${assetId}`, verified);
  }

}
