import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../service/supplier.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
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
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.supplierService.addSupplier(value).subscribe(res => {
      this.toastr.success(res.message);
      this.router.navigate(['/supplier']);
    },
      error => {
        this.toastr.error(error.error.message); 

      })

  }

  /*********************************************************** Edit Selected Role *******************************************************************/
  editSupplier(value) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.supplierService.editSupplier(this.supplierData.supplierId, value).subscribe(res => {
      this.toastr.success(res.message);
      this.router.navigate(['/supplier']);

    },
      error => {
        this.toastr.error(error.error.message);

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
