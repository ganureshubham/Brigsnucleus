import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AssetmateService } from 'src/app/modules/assetmate/service/assetmate.service';
import { SpinnerService } from 'src/app/public service/spinner.service';

@Component({
  selector: 'app-transfer-asset',
  templateUrl: './transfer-asset.component.html',
  styleUrls: ['./transfer-asset.component.css']
})
export class TransferAssetComponent implements OnInit {

  insallationLationFormGroup: FormGroup;
  assetPrimaryDetails: any = {};
  arrAssetInstallationLocation: any = [];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private assetmateService: AssetmateService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.assetPrimaryDetails = this.data;
    this.setFromControls();
    this.getAllAssetLocationTypes();
  }

  getAllAssetLocationTypes() {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getLocationList().subscribe(res => {
      if (res.installationLocationType) {
        this.arrAssetInstallationLocation = res.installationLocationType;
        this.setFormContolValues();
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  setFromControls() {
    this.insallationLationFormGroup = this.formBuilder.group({
      locationType: ['', Validators.required],
      installationLocation: ['', Validators.required]
    });
  }

  setFormContolValues() {
    if (this.arrAssetInstallationLocation.length > 0) {
      this.insallationLationFormGroup.get('locationType').setValue(this.arrAssetInstallationLocation[0].installationLocationTypeIdFK);
    }
    this.insallationLationFormGroup.get('installationLocation').setValue(this.assetPrimaryDetails.asssetLocation);
    this.spinnerService.setSpinnerVisibility(false);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  transferAssetLocation() {
    this.dialogRef.close();
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}
