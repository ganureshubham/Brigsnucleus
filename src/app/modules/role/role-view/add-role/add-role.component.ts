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
  featureList: any[] = [];
  features: any = [];
  selectAll: boolean = true;
  featureListForEdit: any;
  childList: any;
  isNoRecordFound: boolean = false;
  childFeatureList: any[] = [];

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
      });
      // this.childFeatureList.map((value1) => {
      //   value1.isChecked = true;
      // })
    } else {
      this.featureList.map((value) => {
        value.isChecked = false;
      });
      // this.childFeatureList.map((value1) => {
      //   value1.isChecked = false;
      // })
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

  valueChange1(parentIndex: any, childIndex: any, value: any) {
    this.featureList[parentIndex].child[childIndex].isChecked = value.checked;
    for (let childfeature of this.childFeatureList) {
      if (!childfeature.isChecked) {
        this.selectAll = false;
        break;
      } else {
        this.selectAll = true;
      }
    }
    for (let pfeature of this.featureList) {
      for (let cfeature of pfeature.child) {
        if (cfeature.parentId == pfeature.featureIdFK) {
          if (!cfeature.isChecked) {
            pfeature.isChecked = false;
          } else {
            pfeature.isChecked = true;
          }
        }
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
    for (let childfeature of this.childFeatureList) {
      if (childfeature.isChecked) {
        body.features.push({
          featureIdFK: childfeature.featureIdFK
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
    for (let childfeature of this.childFeatureList) {
      if (childfeature.isChecked) {
        body.features.push({
          featureIdFK: childfeature.featureIdFK
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

        for (let resfeature of res.features) {
          if (resfeature.parentId == 0) {
            this.featureList.push(resfeature);
          }
        }

        for (let pfeature of this.featureList) {
          pfeature.child = [];
          for (let resfeature of res.features) {
            if (resfeature.parentId == pfeature.featureIdFK) {
              pfeature.child.push(resfeature);
            }
          }
        }
        if (this.featureList.length == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        for (let feature of this.featureList) {
          feature.isChecked = true;
          for (let childfeature of feature.child) {
            childfeature.isChecked = true;
            this.childFeatureList.push(childfeature);
          }
        }
        if (this.data.type == 'Edit') {

          for (let pfeature of this.featureList) {
            pfeature.isChecked = false;
            for (let cfeature of pfeature.child) {
              cfeature.isChecked = false;
            }
          }
          for (let alreadyConfiguredFeature of this.featureListForEdit) {
            for (let pfeature of this.featureList) {
              if (pfeature.featureIdFK == alreadyConfiguredFeature.featureIdFK) {
                pfeature.isChecked = true;
                break;
              }
              for (let cfeature of pfeature.child) {
                if (cfeature.featureIdFK == alreadyConfiguredFeature.featureIdFK) {
                  cfeature.isChecked = true;
                  break;
                }
              }
            }
          }
        } else {
          for (let feature of this.featureList) {
            feature.isChecked = true;
            for (let childfeature of this.childFeatureList) {
              childfeature.isChecked = true;
            }
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


/*     this.featureList = res.features;
          if (this.featureList.length == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
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
          } */