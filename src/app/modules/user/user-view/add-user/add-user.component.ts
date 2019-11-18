import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(private router: Router,
    private userService: UserService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log("ngonit function", res);

        this.isEdited = true;
        this.formTitle = `Edit User`;


      }
    })

    this.getDeptList();
    this.getUserRoleList();
  }

  /*********************************************************** Add New User *******************************************************************/
  addUser(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadImageToserver((result) => {
        value.image = result;
        this.userService.addUser(value).subscribe(res => {
          console.log(res);
          this.spinner.show();
          setTimeout(() => {
            this.toastr.success(res.message);
            this.router.navigate(['/user']);
            this.spinner.hide();
          }, 1000);
        },
          error => {
            this.toastr.error(error.error.message);
          })
      })
    }
  }

  uploadImageToserver = (callback) => {
    if (this.fileToUpload == null) {
      callback(this.profileImage)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.userService.photoUpload(formData).subscribe(res => {
        console.log(res);
        callback(res.ImageName)
      })
    }

  }

  /*********************************************************** Edit Selected Asset *******************************************************************/
  // on submit of update button send updated data on server 

  editUser(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadImageToserver((result) => {
        value.image = result;
        this.userService.editUser(this.userData.userId, value).subscribe(res => {
          console.log(res);
          this.toastr.success(res.message);
          this.router.navigate(['/user']);

        },
          error => {
            this.toastr.error(error.error.message);

          })
      })
    }
  }

  /*********************************************************** Add Asset Photo *****************************************************************/
  imageChange(files: FileList) {
    var validImageFormats = ['jpg', 'gif', 'PNG', 'JPEG', 'png', 'jpeg', 'JPG'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
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
        console.log(error);
        this.toastr.error(error.message);

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
        console.log(error);

      }
    );
  }


  backToList() {
    this.router.navigate(['/user']);
  }


  add() {
    this.router.navigate(['/user']);
  }


}
