import { Component, OnInit, Inject } from '@angular/core';
import { LocationTypeService } from '../../service/location-type.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-location-type',
  templateUrl: './add-location-type.component.html',
  styleUrls: ['./add-location-type.component.css']
})
export class AddLocationTypeComponent implements OnInit {

  isEdited: boolean = false;
  formTitle: string = "Add Installation Location";
  cancelbtn = 0;

  installationLocationTypeId: number;
  installationLocType: string = '';

  constructor(
    private locationTypeService: LocationTypeService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddLocationTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.type == 'Edit') {
      this.isEdited = true;
      this.formTitle = "Edit Installation Location";
      this.installationLocationTypeId = this.data.value.installationLocationTypeId;
      this.installationLocType = this.data.value.installationLocationName;
    }
  }


  /*********************************************************** Add New Installation *******************************************************************/

  addInstallationLocation(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.locationTypeService.addInstallationLoc(value).subscribe(res => {
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

  showSnackBar(message: string) {
    this.spinnerService.setSpinnerVisibility(false);
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Edit New Installation *******************************************************************/

  editInstallationLocation(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.locationTypeService.editInstallationLoc(this.installationLocationTypeId, value).subscribe(res => {
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


}
