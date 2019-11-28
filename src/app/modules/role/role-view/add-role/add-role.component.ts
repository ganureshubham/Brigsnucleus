import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  isEdited: boolean = false;
  formTitle: string = "Add User Role";
  roleData: any = {};
  uploadingLoader: boolean = false;
  cancelbtn = 0;

  constructor(private router: Router,
    private roleService: RoleService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }



  ngOnInit() {
    if (this.data.type == 'Edit') {
      this.roleData = this.data;
      this.isEdited = true;
      this.formTitle = `Edit User Role`;
    }
  }

  /*********************************************************** Add New Asset *******************************************************************/
  addRole(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.addRole(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      //this.router.navigate(['/user-role']);
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Edit Selected Role *******************************************************************/

  editRole(value) {
    value.userRoleId = this.roleData.userRoleId;
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.editRole(this.roleData.userRoleId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      // this.router.navigate(['/user-role']);
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }



  /*********************************************************** Back to role list *******************************************************************/

  backToList() {
    this.router.navigate(['/user-role']);
  }


}
