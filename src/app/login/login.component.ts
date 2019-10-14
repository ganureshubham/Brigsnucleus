import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../public service/authentication.service';
import { Router } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ToastrService } from 'ngx-toastr';

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
  newpassword: string = null;
  confirmpassword: string = null;
  sendOTPFlag: boolean;
  forgPass: boolean = false;
  newPassword: boolean;
  new_password: any;
  confirm_password: any;
  flag: number = 1;
  otp: any;
  public show: boolean = false;
  public hide: boolean = true;

  constructor(public authService: AuthenticationService,
    public router: Router,
    private toastr: ToastrService) { }

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
    console.log(body);

  }


  toggle() {
    this.show = !this.show;
    this.hide = !this.show;
    console.log(this.show, 'mobile');
    console.log(this.hide, 'email');

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
    this.newPassword = false;
    this.sendOTPFlag = false;


  }
  /******************************************************* Send OTP by Text*****************************************************/

  sendOtpText(value: any) {
    this.mobileNumber = value.mobileNumber;
    value.resendFlag = this.flag++;

    this.authService.sendOtpText(value).subscribe(res => {
      console.log(res);

      this.forgPass = true;
      this.sendOTPFlag = true;
      // this.newPassword = true;
    },
      error => {
        console.log(error);
        this.toastr.error(error.errors.msg);
      });

  }

  /******************************************************* Send OTP by E-Mail*****************************************************/

  sendOtpMail(value: any) {
    this.email = value.email;
    value.resendFlag = this.flag++;
    this.authService.sendOtpMail(value).subscribe(res => {
      console.log(res);
      this.forgPass = true;
      this.sendOTPFlag = true;
      // this.newPassword = true;


    },
      error => {
        console.log(error);

      })

  }

  backToForgot() {
    this.forgPass = false;
    this.newPassword = false;
    this.sendOTPFlag = false;
  }

  verifyOTP(value: any) {
    if (this.show == true && this.hide == false) {
      value.mobileNumber = this.mobileNumber;
      this.otp = value.otp;

      this.authService.verifyOTPText(value).subscribe(res => {
        console.log(res);
        // this.toastr.success(res.message);


        this.forgPass = true;
        this.newPassword = true;
        this.sendOTPFlag = false;
      },
        error => {
          console.log(error.json().message);
          this.toastr.error(error.errors.msg);

        })

    }
    else {
      value.email = this.email;
      this.otp = value.otp;
      this.authService.verifyOTPMail(value).subscribe(res => {
        console.log(res);
        this.forgPass = true;
        this.newPassword = true;
        this.sendOTPFlag = false;


      },
        error => {
          console.log(error);

        })


    }
    // value.mobileNumber = this.mobileNumber;
    // this.otp = value.otp;

    // this.authService.verifyOTP(value).subscribe(res => {
    //   console.log(res);
    //   // this.toastr.success(res.message);


    //   this.forgPass = true;
    //   this.newPassword = true;
    //   this.sendOTPFlag = false;
    // },
    //   error => {
    //     console.log(error.json().message);
    //     this.toastr.error(error.errors.msg);

    //   })

  }

  changePass(value: any) {
    value.otp = this.otp;
    value.mobileNumber = this.mobileNumber;
    this.authService.changePass(value).subscribe(res => {
      console.log(res);
      // this.toastr.success(res.message);

      this.forgPass = false;
      this.sendOTPFlag = false;
      this.newPassword = false;

    },
      error => {
        console.log(error);
        this.toastr.error(error.errors.msg);

      })

  }

}  
