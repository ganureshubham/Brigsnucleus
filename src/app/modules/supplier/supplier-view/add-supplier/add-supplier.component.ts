import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../service/supplier.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  isEdited: boolean = false;
  formTitle: string = "Add Supplier";
  supplierData: any = {};

  constructor(private router: Router,
    private supplierService: SupplierService,
    public dataService: DataSharingService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log("ngonit function", res);
        this.supplierData.businessName = res.businessName;
        this.supplierData.firstName = res.firstName;
        this.supplierData.lastName = res.lastName;
        this.supplierData.emailId = res.emailId;
        this.supplierData.mobileNumber = res.mobileNumber;
        this.supplierData.supplierId = res.supplierId;
        this.supplierData.supplierName = res.supplierName;
        this.isEdited = true;
        this.formTitle = `Edit Supplier`;

      }
    })
  }

  /*********************************************************** Add New Asset *******************************************************************/
  addSupplier(value) {
    this.spinnerService.setSpinnerVisibility(true);

    this.supplierService.addSupplier(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.router.navigate(['/supplier']);
    },
      error => {
        this.showSnackBar("Something went wrong..!!");

      })

  }
  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Edit Selected Role *******************************************************************/
  editSupplier(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.supplierService.editSupplier(this.supplierData.supplierId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.router.navigate(['/supplier']);

    },
      error => {
        this.showSnackBar("Something went wrong..!!");

      })
  }

  /*********************************************************** Back to supplier list *******************************************************************/
  backToList() {
    this.router.navigate(['/supplier']);
  }

  /*********************************************************** Back to supplier list *******************************************************************/
  add() {
    this.router.navigate(['/supplier']);
  }
}
