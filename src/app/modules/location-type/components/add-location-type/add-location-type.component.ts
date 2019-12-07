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
  InstallationLocData: any = {};
  isEdited: boolean = false;
  formTitle: string = "Add Installation Location";
  cancelbtn = 0;

  constructor(
    private locationTypeService: LocationTypeService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddLocationTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.type == 'Add') {

    }
    if (this.data.type == 'Edit') {
      console.log(this.data);

      this.isEdited = true;
      this.formTitle = "Edit Installation Location";
      this.InstallationLocData = this.data.value;
    }
  }


  /*********************************************************** Add New Installation *******************************************************************/

  addInstallationLocation(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.locationTypeService.addInstallationLoc(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      //this.router.navigate(['/supplier']);
    },
      error => {
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
    this.locationTypeService.editInstallationLoc(this.InstallationLocData.installationLocationTypeId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      //this.router.navigate(['/supplier']);
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })

  }


}
