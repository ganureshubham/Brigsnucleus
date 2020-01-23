import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from '../../../public service/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class CronLogService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCronLogsList(pageNo: number): Observable<any> {
    return this.httpClient.get<any>(ConfigurationService.baseUrl + `cronJobs/listOfAllCrons/${pageNo}`);
  }
}
