import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { AssetCodeComponent } from '../asset-code/asset-code.component';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-view-asset',
  templateUrl: './view-asset.component.html',
  styleUrls: ['./view-asset.component.css']
})
export class ViewAssetComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  assetData: any = {};
  showFirst: boolean = false;
  Router: any;
  categoryID: any;
  codeData: any;
  parentdata: any;
  result: string = '';


  displayedColumns: string[] = ['assetId', 'assetCodeImage', 'assetCode', 'assetImage', 'assetTitle', 'categoryName', 'modelNumber', 'Actions'];
  dataSource: MatTableDataSource<Asset> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  animal: any;




  constructor(private http: HttpClient,
    private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
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
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        this.categoryID = res.categoryId;
        this.getAllAssets(this.categoryID, this.pageNumber);
      } else {
        let categorydata = localStorage.getItem('Category-Object');
        let category = JSON.parse(categorydata);
        console.log('res from local storage Asset',category);
        
        this.getAllAssets(category.categoryId, this.pageNumber);
        this.categoryID=category.categoryId; 
      }
    })
  }

  ngOnDestroy(): void { } 

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssets(categoryId: number, pageNo: any) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.assetmateService.getAllAssets(categoryId, pageNo).subscribe(res => {
      this.dataSource = res.asset;
      this.parentdata = res.asset;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;
    },
      error => {
        this.toastr.error(error.error.message);
      }
    );
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllAssets(this.categoryID, this.page);
  }


  /*********************************************************** Search Category *******************************************************************/



  searchAsset(keyword) {
    if (keyword) {
      this.assetmateService.searchAsset(this.categoryID, keyword).subscribe(res => { 
        this.dataSource = res.data;
      }, error => {
        console.log(error); 
      })

    }else {
      this.getAllAssets(this.categoryID, this.pageNumber); 
    }
  }


  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    this.showFirst = !this.showFirst;
    let selectedAsset = null;
    this.dataService.saveData(selectedAsset);
    // this.router.navigate(['/asset/add-asset'])
  }

  /*********************************************************** Print Asset Code *******************************************************************/
  openDialog(assetCode): void {
    this.dataService.saveData(assetCode);
    const dialogRef = this.dialog.open(AssetCodeComponent, { 
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }


  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteAsset(assetId: number) {
    // alert('are you sure?');
    const message = `Are you sure you want to do this?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "1000px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
    this.assetmateService.deleteAsset(assetId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllAssets(this.categoryID, this.page);
    })
    error => {
      this.toastr.error(error.message); 
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editAsset(assetId: number) {
    this.showFirst = !this.showFirst;
    this.dataService.saveData(assetId);
    // this.dataService.changeData(assetId);
    // this.router.navigate(['/asset/add-asset']);
  }

  /*********************************************************** View Particular Asset  *******************************************************************/


  viewAsset = (assetId: number) => {
    // let AssetId=assetId;
    // localStorage.setItem('Category-Object',JSON.stringify(AssetId));
    this.dataService.saveData(assetId);
    this.router.navigate(['/assetmate/detail-asset']);
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
