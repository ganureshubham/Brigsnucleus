import { Component, OnInit, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ManufacturerService } from '../../service/manufacturer.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.css']
})
export class AddManufacturerComponent implements OnInit {
  isEdited: boolean = false;
  formTitle: string = "Add Manufacturer";
  manufacturerData: any = {};
  cancelbtn = 0;


  constructor(private router: Router,
    private manufacturerService: ManufacturerService,
    public dataService: DataSharingService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddManufacturerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    if (this.data.type == 'Edit') {
      this.manufacturerData = this.data;
      this.isEdited = true;
      this.formTitle = `Edit Manufacturer`;
    }
    // this.dataService.currentData.subscribe(res => {
    //   if (res != null && res != "null" && res != "null") {
    //     console.log("ngonit function", res);
    //     this.manufacturerData.title = res.title;
    //     this.manufacturerData.manufacturerId = res.manufacturerId;
    //     this.isEdited = true;
    //     this.formTitle = `Edit Manufacturer`;

    //   }
    // })
  }

  /*********************************************************** Add New Manufacturer *******************************************************************/

  addManufacturer(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.manufacturerService.addmanufacturer(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      //this.router.navigate(['/manufacturer']);

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");

      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Edit Selected Manufacturer *******************************************************************/

  editManufacturer(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.manufacturerService.editmanufacturer(this.manufacturerData.manufacturerId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      //this.router.navigate(['/manufacturer']);

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");

      })
  }
  /*********************************************************** Back to Manufacturer list *******************************************************************/
  backToList() {
    this.router.navigate(['/manufacturer']);
  }

  /*********************************************************** Back to Manufacturer list *******************************************************************/

  add() {
    this.router.navigate(['/manufacturer']);
  }

}
