import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { SupplierService } from '../service/supplier.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
    this.loading = true;
    this.supplierService.getAllSuppliers(pageNo).subscribe(res => {
      console.log(res);
      this.paidDataSource = res.supplier;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;
      this.loading = false;
    },
      error => {
        this.loading = false;
        console.log(error);

      })
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

  deleteSupplier(supplierId: number) {
    alert('are you sure?');
    this.supplierService.deleteSupplier(supplierId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllSuppliers(this.page);
    })
    error => {
      console.log(error);
      this.toastr.error(error.message);
    }
  }

  /*********************************************************** Edit Particular Supplier  *******************************************************************/

  editSupplier(supplierId: number) {
    this.dataService.changeData(supplierId);
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

