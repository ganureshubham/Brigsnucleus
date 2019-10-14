import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ManufacturerService } from '../service/manufacturer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manufacturer-view',
  templateUrl: './manufacturer-view.component.html',
  styleUrls: ['./manufacturer-view.component.css']
})
export class ManufacturerViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  manufacturerData: any = {};

  displayedColumns: string[] = ['manufacturerId', 'title', 'Actions'];
  paidDataSource: MatTableDataSource<Manufacturer> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private router: Router,
    private manufacturerService: ManufacturerService,
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
    this.getAllmanufacturers(this.pageNumber);
  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/

  getAllmanufacturers(pageNo: any) {
    this.loading = true;
    this.manufacturerService.getAllmanufacturers(pageNo).subscribe(res => {
      console.log(res);
      this.paidDataSource = res.manufacturer;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;
      this.loading = false;


    },
      error => {
        this.loading = false;
        console.log(error);
        this.toastr.error(error.message);

      })

  }




  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllmanufacturers(this.page);
  }


  addManufacturer() {
    let selectedManufacturer = null;
    this.dataService.changeData(selectedManufacturer);
    this.router.navigate(['/manufacturer/add-manufacturer']);
  }

  /*********************************************************** Delete Particular Role *******************************************************************/

  deleteManufacturer(manufacturerId: number) {
    alert('are you sure?');
    this.manufacturerService.deletemanufacturer(manufacturerId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllmanufacturers(this.page);
    })
    error => {
      console.log(error);
      this.toastr.error(error.message);
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editManufacturer(manufacturerId: number) {
    this.dataService.changeData(manufacturerId);
    this.router.navigate(['/manufacturer/add-manufacturer']);


  }


}

export interface Manufacturer {
  manufacturerId: number;
  title: string;
}

