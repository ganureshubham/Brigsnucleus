import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SpinnerService } from '../../../../public service/spinner.service';
import { OrganizationService } from '../../services/organization.service';
import { MatSnackBar } from '@angular/material';

interface OrganizationDetails {
  organizationName: string,
  description: string,
  organizationCode: string
}

@Component({
  selector: 'app-organization-add-edit',
  templateUrl: './organization-add-edit.component.html',
  styleUrls: ['./organization-add-edit.component.css']
})
export class OrganizationAddEditComponent implements OnInit {

  organizationForm: FormGroup;
  isCurrentOperationEdit: boolean = false;
  organization: any = {};

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private organizationService: OrganizationService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.setFormControls();
    if (this.data.action == 'edit') {
      this.organization = this.data.organization;
      this.setFormControlsValue();
      this.isCurrentOperationEdit = true;
    } else {
      this.isCurrentOperationEdit = false;
    }
  }

  setFormControls() {
    this.organizationForm = this.formBuilder.group({
      organizationName: ['', Validators.required],
      organizationDescription: ['', Validators.required],
      organizationCode: [{ value: '', disabled: this.data.action == 'edit' ? true : false }, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  setFormControlsValue() {
    this.organizationForm.controls['organizationName'].setValue(this.organization.organizationName);
    this.organizationForm.controls['organizationDescription'].setValue(this.organization.description);
    this.organizationForm.controls['organizationCode'].setValue(this.organization.organizationCode);
  }

  onNoClick(): void {
    this.dialogRef.close({ action: false });
  }

  addOrganization() {

    this.spinnerService.setSpinnerVisibility(true);

    let organizationDetails: OrganizationDetails = {
      organizationName: '',
      description: '',
      organizationCode: ''
    };

    organizationDetails.organizationName = this.organizationForm.get('organizationName').value;
    organizationDetails.description = this.organizationForm.get('organizationDescription').value;
    organizationDetails.organizationCode = this.organizationForm.get('organizationCode').value;

    this.organizationService.addOrganization(organizationDetails).subscribe(resp => {
      if (resp && resp.status) {
        this.dialogRef.close({ action: true });
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(resp.message);
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(resp.message);
      }
    },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );

  }

  editOrganization() {

    this.spinnerService.setSpinnerVisibility(true);

    let organizationDetails: OrganizationDetails = {
      organizationName: '',
      description: '',
      organizationCode: ''
    };

    organizationDetails.organizationName = this.organizationForm.get('organizationName').value;
    organizationDetails.description = this.organizationForm.get('organizationDescription').value;

    this.organizationService.editOrganization(this.data.organization.organizationId, organizationDetails).subscribe(resp => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(resp.message);
      if (resp && resp.status) {
        this.dialogRef.close({ action: true });
      }
    },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }

  onOrganizationNameChange(orgName) {
    if (this.data.action == 'add') {
      let autoSuggestedOrgCode = orgName.replace(/\s/g, "").substring(0, 4);
      this.organizationForm.controls['organizationCode'].setValue(autoSuggestedOrgCode.toUpperCase());
    }
  }

}
