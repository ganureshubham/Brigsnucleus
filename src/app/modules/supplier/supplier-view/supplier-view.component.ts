import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { SupplierService } from '../service/supplier.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';

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

  displayedColumns: string[] = ['supplierId', 'supplierName', 'businessName', 'mobileNumber', 'emailId', 'Actions'];
  paidDataSource: MatTableDataSource<Supplier> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private router: Router,
    private supplierService: SupplierService,
    public dataService: DataSharingService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
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
      if (res.supplier) {
        this.paidDataSource = res.supplier;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;

      } else {
        this.showSnackBar(res.message);
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }


  // getAllSuppliers(pageNo: any) {
  //   this.loading = true;
  //   this.supplierService.getAllSuppliers(pageNo).subscribe(res => {
  //     console.log(res);
  //     this.paidDataSource = res.userroles;
  //     this.pageNumber = res.currentPage;
  //     this.totalCount = res.totalCount;
  //     this.loading = false;

  //   },
  //     error => {
  //       this.loading = false;
  //       console.log(error);

  //     }
  //   )
  // }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllSuppliers(this.page);
  }


  addSupplier() {
    let selectedSupplier = null;
    this.dataService.changeData(selectedSupplier);
    this.router.navigate(['/supplier/add-supplier'])
  }

  /*********************************************************** Delete Particular Supplier *******************************************************************/

  // deleteSupplier(supplierId: number) {
  //   alert('are you sure?');
  //   this.supplierService.deleteSupplier(supplierId).subscribe(res => {
  //     this.toastr.success(res.message);
  //     this.getAllSuppliers(this.page);
  //   })
  //   error => {
  //     this.toastr.error(error.message);
  //   }
  // }

  deleteDocumate(documentId: number, title: string) {
    // this.documentId = documentId;
    // let appDialogData: AppDialogData = {
    //   visibilityStatus: true,
    //   title: 'DELETE ASSET',
    //   message: ` Are your sure you want to delete documate "${documentId}"`,
    //   positiveBtnLable: "Yes",
    //   negativeBtnLable: "Cancel"
    // }
    // this.dialogService.setDialogVisibility(appDialogData);
    // if (!this.isAlreadySubscribedToDialogUserActionService) {
    //   this.isAlreadySubscribedToDialogUserActionService = true;
    //   this.dialogService.getUserDialogAction().subscribe(userAction => {
    //     if (userAction == 0) {
    //       //User has not performed any action on opened app dialog or closed the dialog;
    //     } else if (userAction == 1) {
    //       this.dialogService.setUserDialogAction(0);
    //       //User has approved delete operation
    //       this.spinnerService.setSpinnerVisibility(true);
    //       this.documateService.deleteDocumate(this.documentId).subscribe(res => {
    //         this.spinnerService.setSpinnerVisibility(false);
    //         this.showSnackBar(res.message);
    //         this.getAllDocumates(this.page);
    //       }, error => {
    //         this.showSnackBar("Something went wrong..!!");
    //       });
    //     }
    //   })
    // }
  }

  /*********************************************************** Edit Particular Supplier  *******************************************************************/

  editSupplier(visit: number) {
    this.dataService.changeData(visit);
    this.router.navigate(['/supplier/add-supplier']);


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

