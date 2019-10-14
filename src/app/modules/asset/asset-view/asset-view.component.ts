import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AssetService } from '../service/asset.service';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';


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
  assetData:any={};

  displayedColumns: string[] = ['assetId', 'assetCodeImage', 'assetCode', 'assetImage', 'assetTitle', 'categoryName', 'modelNumber', 'Actions'];
  paidDataSource: MatTableDataSource<Asset> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private assetService: AssetService,
    private router: Router,
    public dataService: DataSharingService,
    private toastr:ToastrService
    ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator; 
  }

  ngOnInit() {
    this.getAllAssets(this.pageNumber);
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssets(pageNo: any) {
    this.loading = true;
    this.assetService.getAllAssets(pageNo).subscribe(res => {
      console.log(res);
      
      this.paidDataSource = res.asset;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;
      this.loading = false;
    },
      error => {
        this.loading = false;
        console.log(error);
        this.toastr.error(error.message);
      }
    );
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllAssets(this.page);
  }

  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    let selectedAsset = null;
    this.dataService.changeData(selectedAsset);
    this.router.navigate(['/asset/add-asset'])  
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
  editAsset(assetId:number) {
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
