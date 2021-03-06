import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userData: any = {}
  fileToUpload: File = null;
  isEdited: boolean = false;
  photoPath: any;
  profileImage: any;
  imageerror: any;
  deptList: any;
  userRoleList: any;
  formTitle: string = "Add User";
  placeholder: string = "Password"
  hide = true;
  cancelbtn = 0;
  password: any;
  userResp: any = false;

  constructor(private router: Router,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    if (this.data.type == 'Add') {

    } else if (this.data.type = 'Edit') {
      this.userData = this.data;
      this.password = this.data.password;
      this.userData.password = '';
      this.profileImage = this.data.profileImage.split('/').pop().split('?')[0];
      this.isEdited = true;
      this.formTitle = `Edit User`;
      this.placeholder = `Change Password`;
    }
    this.getDeptList();
    this.getUserRoleList();
  }

  mobilePattern() {
    return (/^[6-9]\d{9}$/)
  }

  /*********************************************************** Add New User *******************************************************************/

  addUser(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadImageToserver((result) => {
        value.profileImage = result;
        this.spinnerService.setSpinnerVisibility(true);
        this.userService.addUser(value).subscribe(res => {
          this.spinnerService.setSpinnerVisibility(false);
          if (res.status) {
            if (res.isRecover) {
              this.userResp = res.isRecover;
              this.formTitle = 'Recover Email-Id';
              this.showSnackBar(res.message);
            } else {
              this.showSnackBar(res.message);
              this.dialog.closeAll();
            }
          } else {
            this.showSnackBar(res.message);
          }
        },
          error => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar("Something went wrong..!!");
          })
      })
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  uploadImageToserver = (callback) => {
    if (this.fileToUpload == null) {
      callback(this.profileImage)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.userService.photoUpload1(formData).subscribe(res => {
        callback(res.ImageName);
      })
    }
  }

  /*********************************************************** Recover Email *******************************************************************/

  recoverEmail() {
    let userEmail = {};
    userEmail = {
      emailId: this.userData.emailId
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.userService.recoverUserEmail(userEmail).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        this.showSnackBar(res.message);
        this.dialog.closeAll();
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /*********************************************************** Edit Selected Asset *******************************************************************/
  // on submit of update button send updated data on server 

  editUser(formData: NgForm) {
    let value = formData.value;
    if (value.password == '') {
      value.password = this.password;
    }
    if (formData.valid) {
      this.uploadImageToserver((result) => {
        value.profileImage = result;
        this.spinnerService.setSpinnerVisibility(true);
        this.userService.editUser(this.userData.userId, value).subscribe(res => {
          this.spinnerService.setSpinnerVisibility(false);
          if (res.status) {
            this.showSnackBar(res.message);
            this.dialog.closeAll();
          } else {
            this.showSnackBar(res.message);
          }
        },
          error => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar("Something went wrong..!!");
          })
      })
    }
  }

  /*********************************************************** Add Asset Photo *****************************************************************/

  imageChange(files: FileList) {
    var validImageFormats = ['jpg', 'gif', 'GIF', 'PNG', 'JPEG', 'png', 'jpeg', 'JPG'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
      this.imageerror = "";
      let formData: FormData = new FormData();
      this.fileToUpload = files.item(0);
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.profileImage = files.item(0).name;
    } else {
      this.imageerror = "please select image only";
    }
  }

  /*********************************************************** Get Department List *******************************************************************/

  getDeptList() {
    this.userService.getDeptList().subscribe(res => {
      if (res.department) {
        this.deptList = res.department;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Get User Role List *******************************************************************/

  getUserRoleList() {
    this.userService.getUserRoleList().subscribe(res => {
      if (res.userRole) {
        this.userRoleList = res.userRole;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Back to User Role List *******************************************************************/

  backToList() {
    this.router.navigate(['/user/user-list']);
  }

  add() {
    this.router.navigate(['/user']);
  }


}
