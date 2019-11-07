import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { RequestOptions, Headers, Response, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import "rxjs/add/operator/map";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loginURL = ConfigurationService.baseUrl;
  public isLoggedIn: any;
  public loginLoader: boolean = false;
  redirectUrl: string;

  constructor(private _http: Http, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  login(body: URLSearchParams) { 
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });
    this._http.post(this.loginURL + `authorization/login/`, body.toString(), options).subscribe(
      (response: Response) => {
        if (response) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(response.json()));
          this.isLoggedIn = response.status;
          this.spinner.show();
          setTimeout(() => {
            this.router.navigate(["/dashboard"]);
            this.toastr.success(response.json().message);
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        }
        else {
          this.isLoggedIn = response.status;
        }
      },
      error => {
        this.spinner.show();
        setTimeout(() => {
          this.router.navigate(["/dashboard"]);
          this.toastr.error(error.json().message);
          this.spinner.hide();
        }, 5000);
        // console.log(error.json().message);
       
      });
  }

  /***********************************************Send OTP By Text*************************************************************************/
  sendOtpText(value: any) {
    return this._http.post(this.loginURL + `authorization/sendOtpViaText/`, value);
  }

  /***********************************************Send OTP By Mail*************************************************************************/

  sendOtpMail(value: any) {
    return this._http.post(this.loginURL + `authorization/sendOtpViaMail/`, value);
  }
  /***********************************************Verify OTP By Text*************************************************************************/

  verifyOTPText(value: any) {
    return this._http.post(this.loginURL + `authorization/verifyOtp/`, value);
  }

  /***********************************************Verify OTP By Mail*************************************************************************/
  verifyOTPMail(value: any) {
    return this._http.post(this.loginURL + `authorization/verifyOtpEmail/`, value);
  }


  changePass(value: any) {
    return this._http.put(this.loginURL + `authorization/saveNewPassword/`, value);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(["/login"]);
  }
}
