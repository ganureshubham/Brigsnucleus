import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { RequestOptions, Headers, Response, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import "rxjs/add/operator/map";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { LoginResponse } from '../model/login';

import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loginURL = ConfigurationService.baseUrl;
  public isLoggedIn: any;
  public loginLoader: boolean = false;
  redirectUrl: string;

  constructor(
    private _http: HttpClient,
    // private _http: Http,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  /****************************************************** Login Request **************************************************************************/

  login(body) {
    return this._http.post<LoginResponse>(this.loginURL + `authorization/login/`, body);
  }

  /***********************************************Send OTP By Text*************************************************************************/
  sendOtpText(value: any) {
    return this._http.post<any>(this.loginURL + `authorization/sendOtpViaText/`, value);
  }

  /***********************************************Send OTP By Mail*************************************************************************/

  sendOtpMail(value: any) {
    return this._http.post<any>(this.loginURL + `authorization/sendOtpViaMail/`, value);
  }
  /***********************************************Verify OTP By Text*************************************************************************/

  verifyOTPText(value: any) {
    return this._http.post<any>(this.loginURL + `authorization/verifyOtp/`, value);
  }

  /***********************************************Verify OTP By Mail*************************************************************************/
  verifyOTPMail(value: any) {
    return this._http.post<any>(this.loginURL + `authorization/verifyOtpEmail/`, value);
  }


  changePass(value: any) {
    return this._http.put<any>(this.loginURL + `authorization/saveNewPassword/`, value);
  }

  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem('currentUser');

    localStorage.clear();
    this.router.navigate(["/login"]);
  }
}
