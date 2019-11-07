import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../public service/authentication.service';
import { Router } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
  // newpassword: string = null;
  // confirmpassword: string = null;
  sendOTPFlag: boolean;
  forgPass: boolean = false;
  newPass: boolean;
  newPassword: any;
  confirmPassword: any;
  flag: number = 1;
  otp: any;
  public show: boolean = false;
  public hide: boolean = true;

  constructor(public authService: AuthenticationService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard'])
    }
  }

  ngOnInit() {
    this.authService.loginLoader = true;
    this.forgPass = false;
  }

  login() {
    this.authService.loginLoader = false;
    let body = new URLSearchParams();
    body.set("emailId", this.email_address);
    body.set("password", this.password);
    body.set("grant_type", "implicit");
    this.authService.login(body);
  }


  toggle() {
    this.show = !this.show;
    this.hide = !this.show;
    console.log(this.show, 'mobile');
    console.log(this.hide, 'email');

  }


  forgotPassword() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
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


    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
    if (this.show == true && this.hide == false) {
      console.log(value);
      let MOBILE = { mobileNumber: this.mobileNumber }

      this.sendOtpText(MOBILE, resend);
    } else {
      console.log("else send otp", this.email);

      let EMAIL = { email: this.email }
      this.sendOtpMail(EMAIL);

    }
  }
  /******************************************************* Send OTP by Text*****************************************************/

  sendOtpText(value: any, resend: number) {
    console.log(value);

    this.mobileNumber = value.mobileNumber;
    value.resendFlag = resend;


    this.authService.sendOtpText(value).subscribe(res => {
      console.log(res.json().status);
      if (res.json().status) {
        this.spinner.show();
        setTimeout(() => {
          this.toastr.success(res.json().message);
          this.forgPass = true;
          this.sendOTPFlag = true;
          /** spinner ends after 1 seconds */
          this.spinner.hide();
        }, 1000);


      } else {
        this.spinner.show();
        setTimeout(() => {
          this.toastr.show(res.json().message);
          this.spinner.hide();
        }, 1000);




      }


      // this.newPass = true;
    },
      error => {
        console.log(error);
        this.toastr.error(error.json().message);
      });

  }

  /******************************************************* Send OTP by E-Mail*****************************************************/

  sendOtpMail(value: any) {
    // value : value must be object {email: "example@gmail.com"}
    console.log("inside send otp mail func", value);
    this.email = value.email;  //   assigning input value to global varialble for future use
    this.authService.sendOtpMail(value).subscribe(res => {
      console.log(res.json());
      if (res.json().status) {
        this.spinner.show();
        setTimeout(() => {
          this.toastr.success(res.json().message);
          this.forgPass = true;
          this.sendOTPFlag = true;
          /** spinner ends after 1 seconds */
          this.spinner.hide();
        }, 1000);



      } else {
        this.spinner.show();
        setTimeout(() => {
          this.toastr.show(res.json().message);
          this.spinner.hide();
        }, 1000);


      }

      // this.newPass = true;


    },
      error => {
        console.log(error);

      })

  }

  backToForgot() {
    this.forgPass = false;
    this.newPass = false;
    this.sendOTPFlag = false;
  }

  verifyOTP(value: any) {
    console.log(value);

    if (this.show == true && this.hide == false) {
      value.mobileNumber = this.mobileNumber;
      this.otp = value.otp;
      this.authService.verifyOTPText(value).subscribe(res => {
        console.log(res.json());
        if (res.json().status) {
          this.spinner.show();
          setTimeout(() => {
            this.toastr.success(res.json().message);
            this.forgPass = true;
            this.newPass = true;
            this.sendOTPFlag = false;
            this.spinner.hide();
          }, 1000);


        } else {
          this.spinner.show();
          setTimeout(() => {
            this.toastr.show(res.json().message);
            this.spinner.hide();
          }, 1000);
        }
      },
        error => {
          console.log(error.json().message);
          this.toastr.error(error.json().message);
        })

    }
    else {
      value.email = this.email;
      this.otp = value.otp;

      this.authService.verifyOTPMail(value).subscribe(res => {
        console.log(res);
        if (res.json().status) {
          this.spinner.show();
          setTimeout(() => {
            this.toastr.success(res.json().message);
            this.forgPass = true;
            this.newPass = true;
            this.sendOTPFlag = false;
            this.spinner.hide();
          }, 1000);


        } else {
          this.spinner.show();
          setTimeout(() => {
            this.toastr.show(res.json().message);
            this.spinner.hide();
          }, 1000);
        }




      },
        error => {
          console.log(error.json().message);
          this.toastr.error(error.json().message);

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
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
    this.authService.changePass(value).subscribe(res => {
      console.log(res);
      if (res.json().status) {
        this.toastr.success(res.json().message);
        this.forgPass = false;
        this.sendOTPFlag = false;
        this.newPass = false;


      } else {
        this.toastr.show(res.json().message);

      }
      // this.toastr.success(res.message);



    },
      error => {
        console.log(error);
        this.toastr.error(error.json().message);

      })

  }

}  
