import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../public service/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email_address: string = null;
  mobileNumber: string = null;
  email: string = null;
  password: string = null;
  sendOTPFlag: boolean;
  forgPass: boolean = false;
  newPass: boolean;
  newPassword: any;
  confirmPassword: any;
  flag: number = 1;
  otp: any;

  public show: boolean = false;
  public hide: boolean = true;

  constructor(
    private spinnerService: SpinnerService,
    public authService: AuthenticationService,
    private snackBar: MatSnackBar,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.forgPass = false;
  }

  login() {

    let body = {
      "emailId": this.email_address,
      "password": this.password
    }

    this.spinnerService.setSpinnerVisibility(true);

    this.authService.login(body).subscribe(
      res => {

        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message)

        if (res.auth) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          if (JSON.parse(localStorage.getItem('currentUser')).data.role != 0) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/dashboard/superadmin'])
          }
        }

      },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }


  toggle() {
    this.show = !this.show;
    this.hide = !this.show;
    // console.log(this.show, 'mobile');
    // console.log(this.hide, 'email');
  }

  forgotPassword() {
    if (this.forgPass) {
      this.forgPass = false;
      this.sendOTPFlag = true;
    } else if (!this.forgPass) {
      this.forgPass = true;
      this.sendOTPFlag = false;
    }
  }

  backToLogin() {
    this.forgPass = false;
    this.newPass = false;
    this.sendOTPFlag = false;
  }

  /******************************************************* Resend OTP *****************************************************/
  sendOtp(value: any, resend: number) {
    if (this.show == true && this.hide == false) {
      // console.log(value);
      let MOBILE = { mobileNumber: this.mobileNumber }
      this.sendOtpText(MOBILE, resend);
    } else {
      // console.log("else send otp", this.email);
      let EMAIL = { email: this.email }
      this.sendOtpMail(EMAIL);
    }
  }
  /******************************************************* Send OTP by Text*****************************************************/

  sendOtpText(value: any, resend: number) {

    this.mobileNumber = value.mobileNumber;
    value.resendFlag = resend;

    this.spinnerService.setSpinnerVisibility(true);

    this.authService.sendOtpText(value).subscribe(res => {

      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message)

      if (res.status) {
        this.forgPass = true;
        this.sendOTPFlag = true;
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      });

  }

  /******************************************************* Send OTP by E-Mail*****************************************************/

  sendOtpMail(value: any) {
    // value : value must be object {email: "example@gmail.com"}
    console.log("inside send otp mail func", value);
    this.email = value.email;  //   assigning input value to global varialble for future use

    this.spinnerService.setSpinnerVisibility(true);

    this.authService.sendOtpMail(value).subscribe(res => {

      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message)

      if (res.status) {
        this.forgPass = true;
        this.sendOTPFlag = true;
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })

  }

  backToForgot() {
    this.forgPass = false;
    this.newPass = false;
    this.sendOTPFlag = false;
  }

  verifyOTP(value: any) {
    // console.log(value);

    if (this.show == true && this.hide == false) {
      value.mobileNumber = this.mobileNumber;
      this.otp = value.otp;

      this.spinnerService.setSpinnerVisibility(true);

      this.authService.verifyOTPText(value).subscribe(res => {

        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);

        if (res.status) {
          this.forgPass = true;
          this.newPass = true;
          this.sendOTPFlag = false;
        }

      },
        error => {
          this.showSnackBar("Something went wrong..!!");
        })

    }
    else {
      value.email = this.email;
      this.otp = value.otp;

      this.spinnerService.setSpinnerVisibility(true);

      this.authService.verifyOTPMail(value).subscribe(res => {
        // console.log(res);

        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);

        if (res.status) {
          this.forgPass = true;
          this.newPass = true;
          this.sendOTPFlag = false;
        }

      },
        error => {
          this.showSnackBar("Something went wrong..!!");
        })
    }
    // value.mobileNumber = this.mobileNumber;
    // this.otp = value.otp;

    // this.authService.verifyOTP(value).subscribe(res => {
    //   console.log(res);
    //   // this.toastr.success(res.message);


    //   this.forgPass = true;
    //   this.newPass = true;
    //   this.sendOTPFlag = false;
    // },
    //   error => {
    //     console.log(error.json().message);
    //     this.toastr.error(error.errors.msg);

    //   })

  }

  changePass(value: any) {
    if (this.show == true && this.hide == false) {
      value.inputType = "mobile";
      value.inputValue = this.mobileNumber;

    }
    else {
      value.inputType = "email";
      value.inputValue = this.email;

    }
    value.otp = this.otp;
    value.newPassword = this.newPassword;
    value.confirmPassword = this.confirmPassword;

    this.spinnerService.setSpinnerVisibility(true);

    this.authService.changePass(value).subscribe(res => {
      // console.log(res);

      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);

      if (res.status) {
        this.forgPass = false;
        this.sendOTPFlag = false;
        this.newPass = false;
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })

  }

}  
