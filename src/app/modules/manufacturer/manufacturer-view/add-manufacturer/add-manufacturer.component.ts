import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManufacturerService } from '../../service/manufacturer.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.css']
})
export class AddManufacturerComponent implements OnInit {
  isEdited: boolean = false;
  formTitle: string = "Add Manufacturer";
  manufacturerData: any = {};


  constructor(private router: Router,
    private manufacturerService: ManufacturerService,
    public dataService: DataSharingService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log("ngonit function", res);
        this.manufacturerData.title = res.title;
        this.manufacturerData.manufacturerId = res.manufacturerId;
        this.isEdited = true;
        this.formTitle = `Edit Manufacturer`;

      }
    })
  }

  /*********************************************************** Add New Manufacturer *******************************************************************/

  addManufacturer(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.manufacturerService.addmanufacturer(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.router.navigate(['/manufacturer']);

    },
      error => {
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
      this.router.navigate(['/manufacturer']);

    },
      error => {
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
