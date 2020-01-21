import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
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
  featureList: any;
  features: any = [];
  selectAll: boolean = true;
  featureListForEdit: any;

  constructor(private router: Router,
    private roleService: RoleService,
    public dataService: DataSharingService,
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
      this.featureListForEdit = this.data.features;
    } else {
      this.isEdited = false;
    }
    this.getFeatureList();
  }

  chkAllChange(event: any) {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.featureList.map((value) => {
        value.isChecked = true;
      })
    } else {
      this.featureList.map((value) => {
        value.isChecked = false;
      })
    }
  }

  valueChange(index: any, value: any) {
    this.featureList[index].isChecked = value.checked;
    for (let feature of this.featureList) {
      if (!feature.isChecked) {
        this.selectAll = false;
        break;
      } else {
        this.selectAll = true;
      }
    }
  }

  /*********************************************************** Add New Role ************************************************************/

  addRole(formData) {
    let body = {
      title: formData.title,
      features: []
    };
    for (let feature of this.featureList) {
      if (feature.isChecked) {
        body.features.push({
          featureIdFK: feature.featureIdFK
        })
      }
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.addRole(body).subscribe(res => {
      if (res.status) {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
        this.dialog.closeAll();
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
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

  /*********************************************************** Edit Selected Role *******************************************************************/

  editRole(formData) {
    let body = {
      title: formData.title,
      features: []
    };
    for (let feature of this.featureList) {
      if (feature.isChecked) {
        body.features.push({
          featureIdFK: feature.featureIdFK
        })
      }
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.editRole(this.roleData.userRoleId, body).subscribe(res => {
      if (res.status) {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
        this.dialog.closeAll();
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
      }
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

  /*********************************************************** Get All Feature Lists *******************************************************************/

  getFeatureList() {
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.getFeatureList().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        this.featureList = res.features;
        if (this.data.type == 'Edit') {
          for (let feature of this.featureList) {
            feature.isChecked = false;
            for (let editfeature of this.featureListForEdit) {
              if (feature.featureIdFK == editfeature.featureIdFK) {
                feature.isChecked = true;
                break;
              }
            }
          }
        } else {
          for (let feature of this.featureList) {
            feature.isChecked = true;
          }
        }
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

}
