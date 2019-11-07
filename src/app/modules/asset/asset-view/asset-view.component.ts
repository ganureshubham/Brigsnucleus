import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AssetService } from '../service/asset.service';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-asset-view',
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.css']
})
export class AssetViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  assetData: any = {};
  showFirst:boolean=false;

  displayedColumns: string[] = ['assetId', 'assetCodeImage', 'assetCode', 'assetImage', 'assetTitle', 'categoryName', 'modelNumber', 'Actions'];
  dataSource: MatTableDataSource<Asset> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private assetService: AssetService,
    private router: Router,
    public dataService: DataSharingService, 
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Asset, filter: string) => {
      return data.assetTitle == filter;
    };
  }

  ngOnInit() {
    this.getAllAssets(this.pageNumber);
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssets(pageNo: any) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.assetService.getAllAssets(pageNo).subscribe(res => {
      console.log(res);

      this.dataSource = res.asset;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;
    },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllAssets(this.page);
  }


  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    this.dataSource.filter = filterValue;
  }

  /*********************************************************** Search Client *******************************************************************/

  searchClient(page) {
    setTimeout(() => {
      this.loading = true;
      let pageCounter = 0;
      if (this.page != 0) {
        let changedPage = this.page - 1;
        let pages = changedPage;
        pageCounter = Number(pages);
      }
      this.getAllAssets(page);
    }, 1000);

  }

  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    this.showFirst=!this.showFirst;
    let selectedAsset = null;
    this.dataService.changeData(selectedAsset);
    // this.router.navigate(['/asset/add-asset'])
  }


  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteAsset(assetId: number) {
    alert('are you sure?');
    this.assetService.deleteAsset(assetId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllAssets(this.page);
    })
    error => {
      console.log(error);
      this.toastr.error(error.message);
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editAsset(assetId: number) {
    this.dataService.changeData(assetId);
    this.router.navigate(['/asset/add-asset']);
  }

  /*********************************************************** View Particular Asset  *******************************************************************/


  viewAsset(assetId: number) {
    this.dataService.changeData(assetId);
    this.router.navigate(['/asset/asset-details']);
  }
  
}

export interface Asset {
  assetId: number;
  assetCodeImage: string;
  assetCode: number;
  assetImage: string;
  assetTitle: string;
  categoryName: string;
  modelNumber: string;
}
