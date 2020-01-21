import { Component, OnInit, Inject } from '@angular/core';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { OrganizationService } from '../../services/organization.service';
import { ManageOrganizationComponent } from '../../../../shared/manage-organization/manage-organization.component';

interface feature {
  featureId: number,
  featureCode: string,
  purpose: string,
  title: string,
  parentId: number,
  isChecked: boolean,
  child: childfeature[]
}

interface childfeature {
  featureId: number,
  featureCode: string,
  purpose: string,
  title: string,
  parentId: number,
  isChecked: boolean
}


@Component({
  selector: 'app-organization-configure',
  templateUrl: './organization-configure.component.html',
  styleUrls: ['./organization-configure.component.css']
})
export class OrganizationConfigureComponent implements OnInit {
  formtitle: string = 'Add Org Configure';
  cancelbtn = 0;
  configData: any = {};
  OrgFeatureList: feature[] = [];
  selectAll: boolean = true;
  isEdited: boolean = false;
  orgFeatureListForEdit: any;
  organizationId: any;
  childFeatureList: any[] = [];

  constructor(
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private organizationService: OrganizationService,
    public dialogRef: MatDialogRef<OrganizationConfigureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.organizationId = this.data.organizationId;
    if (this.data.numberOfUsers !== 0) {
      this.formtitle = 'Edit org Configure';
      this.configData = this.data;
      this.isEdited = true;
      this.orgFeatureListForEdit = this.data.features;
    }
    this.getFeatureList();

  }

  chkAllChange(event: any) {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.OrgFeatureList.map((value) => {
        value.isChecked = true;
      });
      this.childFeatureList.map((value1) => {
        value1.isChecked = true;
      })
    } else {
      this.OrgFeatureList.map((value) => {
        value.isChecked = false;
      });
      this.childFeatureList.map((value1) => {
        value1.isChecked = false;
      })
    }
  }

  valueChange(index: any, value: any) {
    this.OrgFeatureList[index].isChecked = value.checked;
    for (let feature of this.OrgFeatureList) {
      if (!feature.isChecked) {
        this.selectAll = false;
        break;
      } else {
        this.selectAll = true;
      }
    }
  }

  valueChange1(index: any, value: any, child: any) {
    console.log('index', index);
    console.log('value', value);
    console.log('child', child);
    console.log('child feature', this.childFeatureList);

    this.childFeatureList[index].isChecked = value.checked;
    for (let pfeature of this.OrgFeatureList) {
      for (let resfeature of pfeature.child) {
        if (resfeature.parentId == pfeature.featureId) {
          if (!resfeature.isChecked) {
            this.selectAll = false;
            break;
          } else {
            this.selectAll = true;
          }
        }
      }
    }


    // this.childFeatureList[index].isChecked = value.checked;
    // for (let childfeature of this.childFeatureList) {
    //   if (!childfeature.isChecked) {
    //     this.selectAll = false;
    //     break;
    //   } else {
    //     this.selectAll = true;
    //   }
    // }
  }


  /*********************************************************** Get All Feature Lists *******************************************************************/

  getFeatureList() {
    this.spinnerService.setSpinnerVisibility(true);
    this.organizationService.getOrgFeatures().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        for (let resfeature of res.features) {
          if (resfeature.parentId == 0) {
            this.OrgFeatureList.push(resfeature);
          }
        }
        console.log('OrgList', this.OrgFeatureList);

        for (let pfeature of this.OrgFeatureList) {
          pfeature.child = [];
          for (let resfeature of res.features) {
            if (resfeature.parentId == pfeature.featureId) {
              pfeature.child.push(resfeature);
            }
          }
        }

        for (let feature of this.OrgFeatureList) {
          feature.isChecked = true;
          for (let childfeature of feature.child) {
            childfeature.isChecked = true;
            this.childFeatureList.push(childfeature);
          }
        }

        if (this.data.numberOfUsers !== 0) {
          for (let feature of this.OrgFeatureList) {
            feature.isChecked = false;
            for (let feature1 of this.childFeatureList) {
              feature1.isChecked = false;
              for (let editfeature of this.orgFeatureListForEdit) {
                if (feature.featureId == editfeature.featureIdFK || feature1.featureId == editfeature.featureIdFK) {
                  feature.isChecked = true;
                  feature1.isChecked = true;
                  break;
                }
              }
            }
          }
        } else {
          for (let feature of this.OrgFeatureList) {
            feature.isChecked = true;
            for (let childfeature of this.childFeatureList) {
              childfeature.isChecked = true;
            }
          }
        }
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message, 2000);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
      })
  }

  /*********************************************************** update Org Config *******************************************************************/

  UpdateOrgConfig(formData) {
    let body = {
      numberOfUsers: formData.numberOfUsers,
      features: []
    };
    for (let feature of this.OrgFeatureList) {
      if (feature.isChecked) {
        body.features.push({
          featureIdFK: feature.featureId
        })
      }

    }
    for (let childfeature of this.childFeatureList) {
      if (childfeature.isChecked) {
        body.features.push({
          featureIdFk: childfeature.featureId
        })
      }
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.organizationService.updateOrgConfig(this.organizationId, body).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message, 2000);
        this.dialog.closeAll();
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message, 2000);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
      })
  }

  showSnackBar(message: string, duration: any) {
    this.snackBar.open(message, '', { duration: duration });
  }

}
