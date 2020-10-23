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
  isNoRecordFound: boolean = false;

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
    if (this.data.numberOfUsers !== 0 || this.data.features.length !== 0) {
      this.formtitle = 'Edit org Configure';
      this.configData = this.data;
      this.isEdited = true;
      this.orgFeatureListForEdit = this.data.features;
    }
    this.getFeatureList();

  }

  // chkAllChange(event: any) {
  //   this.selectAll = !this.selectAll;
  //   if (this.selectAll) {
  //     this.OrgFeatureList.map((value) => {
  //       value.isChecked = true;
  //     });
  //     this.childFeatureList.map((value1) => {
  //       value1.isChecked = true;
  //     })
  //   } else {
  //     this.OrgFeatureList.map((value) => {
  //       value.isChecked = false;
  //     });
  //     this.childFeatureList.map((value1) => {
  //       value1.isChecked = false;
  //     })
  //   }
  // }

  onParentChange(index: any, value: any) {
    this.OrgFeatureList[index].isChecked = value.checked;
    for (let pfeature of this.OrgFeatureList) {
      for (let cfeature of pfeature.child) {
        if (pfeature.featureId == cfeature.parentId) {
          if (!pfeature.isChecked) {
            cfeature.isChecked = false;
          }
        }
      }
    }
  }

  onChildChange(parentIndex: any, childIndex: any, value: any) {
    this.OrgFeatureList[parentIndex].child[childIndex].isChecked = value.checked;
    for (let pfeature of this.OrgFeatureList) {
      for (let cfeature of pfeature.child) {
        if (cfeature.parentId == pfeature.featureId) {
          if (cfeature.isChecked) {
            pfeature.isChecked = true;
          }
        }
      }
    }
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
        for (let pfeature of this.OrgFeatureList) {
          pfeature.child = [];
          for (let resfeature of res.features) {
            if (resfeature.parentId == pfeature.featureId) {
              pfeature.child.push(resfeature);
            }
          }
        }
        if (this.OrgFeatureList.length == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        for (let feature of this.OrgFeatureList) {
          feature.isChecked = true;
          for (let childfeature of feature.child) {
            childfeature.isChecked = true;
            this.childFeatureList.push(childfeature);
          }
        }
        if (this.data.numberOfUsers !== 0 || this.data.features.length !== 0) {
          for (let pfeature of this.OrgFeatureList) {
            pfeature.isChecked = false;
            for (let cfeature of pfeature.child) {
              cfeature.isChecked = false;
            }
          }
          for (let alreadyConfiguredFeature of this.data.features) {
            for (let pfeature of this.OrgFeatureList) {
              if (pfeature.featureId == alreadyConfiguredFeature.featureIdFK) {
                pfeature.isChecked = true;
                break;
              }
              for (let cfeature of pfeature.child) {
                if (cfeature.featureId == alreadyConfiguredFeature.featureIdFK) {
                  cfeature.isChecked = true;
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
          featureIdFK: childfeature.featureId
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
