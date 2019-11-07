import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManufacturerService } from '../../service/manufacturer.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
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
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.manufacturerService.addmanufacturer(value).subscribe(res => {
      console.log(res);
      this.toastr.success(res.message);
      this.router.navigate(['/manufacturer']);




    },
      error => {
        console.log(error);
        this.toastr.error(error.message);

      })
  }

  /*********************************************************** Edit Selected Manufacturer *******************************************************************/

  editManufacturer(value) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.manufacturerService.editmanufacturer(this.manufacturerData.manufacturerId, value).subscribe(res => {
      console.log(res);
      this.toastr.success(res.message);
      this.router.navigate(['/manufacturer']);

    },
      error => {
        console.log(error);
        this.toastr.error(error.message);

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
