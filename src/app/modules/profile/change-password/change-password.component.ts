import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../public service/spinner.service';
import { ProfileService } from '../service/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  password: any;
  newPassword: any;
  ConfirmPassword: any;
  hide: boolean = true;
  hide1: boolean = true;
  hide2: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /************************************************ Change Password***************************************************************************/

  changePassword(value) {
    let value1: any = {};
    value1.password = value.password;
    value1.newPassword = value.newPassword;
    this.spinnerService.setSpinnerVisibility(true);
    this.profileService.changePassword(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      if (res.status) {
        this.router.navigate(['/dashboard']);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  Cancel() {
    this.router.navigate(['/dashboard']);
  }

}
