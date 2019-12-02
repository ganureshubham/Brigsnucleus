import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../service/supplier.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  isEdited: boolean = false;
  formTitle: string = "Add Supplier";
  supplierData: any = {};
  cancelbtn = 0;

  constructor(private router: Router,
    private supplierService: SupplierService,
    public dataService: DataSharingService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    if (this.data.type == 'Edit') {
      this.supplierData = this.data;
      this.isEdited = true;
      this.formTitle = `Edit Supplier`;
    }
  }

  /*********************************************************** Add New Asset *******************************************************************/
  addSupplier(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.supplierService.addSupplier(value).subscribe(res => {
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

  /*********************************************************** Edit Selected Role *******************************************************************/
  editSupplier(value) {
    this.spinnerService.setSpinnerVisibility(true);
    this.supplierService.editSupplier(this.supplierData.supplierId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
      // this.router.navigate(['/supplier']);
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
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
