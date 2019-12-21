import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { SupplierService } from '../service/supplier.service';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';

interface supplierDialogData {
  type: string;
  supplierId: number;
  firstName: string;
  lastName: string;
  businessName: string;
  mobileNumber: number;
  emailId: string;
}

@Component({
  selector: 'app-supplier-view',
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.css']
})

export class SupplierViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  supplierData: any = {};
  supplierName: any;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = false;
  dialogData: supplierDialogData;
  Router: any;
  supplierId: number;

  displayedColumns: string[] = ['supplierName', 'businessName', 'mobileNumber', 'emailId', 'Actions'];
  paidDataSource: MatTableDataSource<Supplier> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;

  constructor(private http: HttpClient,
    private router: Router,
    private supplierService: SupplierService,
    public dataService: DataSharingService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllSuppliers(this.pageNumber);
  }

  ngOnDestroy(): void { }


  /*********************************************************** Get All Suppliers *******************************************************************/


  getAllSuppliers(pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.supplierService.getAllSuppliers(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message, 2000);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.supplier;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message, 2000);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
      })
  }

  showSnackBar(message: string, duration: any) {
    this.snackBar.open(message, '', { duration: duration });
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllSuppliers(this.page);
  }

  /*********************************************************** Add Supplier *******************************************************************/

  addSupplier() {
    this.dialogData = {
      type: 'Add',
      supplierId: 0,
      firstName: '',
      lastName: '',
      businessName: '',
      mobileNumber: 0,
      emailId: '',
    }
    const dialogRef = this.dialog.open(AddSupplierComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllSuppliers(this.pageNumber);
      }
    });
  }

  /*********************************************************** Delete Particular Supplier *******************************************************************/

  deleteSupplier(supplierId: number, firstName: string) {
    this.supplierId = supplierId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE Supplier',
      message: ` Are your sure you want to delete supplier "${firstName}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "supplier"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == "supplier") {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation
            this.spinnerService.setSpinnerVisibility(true);
            this.supplierService.deleteSupplier(this.supplierId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              if (res.status) {
                this.showSnackBar(res.message, 4000);
                this.getAllSuppliers(this.page);
              } else {
                this.showSnackBar(res.message, 4000);
              }
            }, error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!", 2000);
            });
          }
        }
      })
    }
  }

  /*********************************************************** Edit Particular Supplier  *******************************************************************/

  editSupplier(visit: any) {
    this.dialogData = {
      type: 'Edit',
      supplierId: visit.supplierId,
      firstName: visit.firstName,
      lastName: visit.lastName,
      businessName: visit.businessName,
      mobileNumber: visit.mobileNumber,
      emailId: visit.emailId,
    }

    const dialogRef = this.dialog.open(AddSupplierComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllSuppliers(this.pageNumber);
      }
    });
  }

}

export interface Supplier {
  "supplierId": number,
  "firstName": string;
  "lastName": string;
  "businessName": string,
  "mobileNumber": number,
  "emailId": string
}

