import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { AssetCodeComponent } from '../asset-code/asset-code.component';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../../../../public service/dialog.service';
import { AppDialogData } from '../../../../../model/appDialogData';

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
    private route: ActivatedRoute,
    private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
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
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllAssets(this.categoryID, this.pageNumber);
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssets(categoryId: number, pageNo: any) {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllAssets(categoryId, pageNo).subscribe(res => {

      this.spinnerService.setSpinnerVisibility(false);

      if (res.asset) {
        this.dataSource = res.asset;
        this.parentdata = res.asset;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message)
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
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

    } else {
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
  // deleteAsset(assetId: number) {
  //   // alert('are you sure?');
  //   const message = `Are you sure you want to do this?`;
  //   const dialogData = new ConfirmDialogModel("Confirm Action", message);
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     maxWidth: "1000px",
  //     data: dialogData
  //   });
  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     this.result = dialogResult;
  //   });
  //   this.assetmateService.deleteAsset(assetId).subscribe(res => {
  //     this.toastr.success(res.message);
  //     this.getAllAssets(this.categoryID, this.page);
  //   })
  //   error => {
  //     this.toastr.error(error.message);
  //   }
  // }

  deleteAsset(assetId: number, assetTitle: string) {

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSETE',
      message: `Are your sure you want to delete assete "${assetTitle}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel"
    }

    this.dialogService.setDialogVisibility(appDialogData);

    this.dialogService.getUserDialogAction().subscribe(userAction => {
      if (userAction == 0) {
        //User has not performed any action on opened app dialog or closed the dialog;
      } else if (userAction == 1) {
        //User has approved delete operation 
        this.spinnerService.setSpinnerVisibility(true);
        this.assetmateService.deleteAsset(assetId).subscribe(res => {

          this.spinnerService.setSpinnerVisibility(false);
          this.showSnackBar(res.message);

          this.getAllAssets(this.categoryID, this.page);

        }, error => {
          this.showSnackBar("Something went wrong..!!");
        });
      }
    })
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
    this.router.navigate(['/assetmate/assetmate-details/' + this.route.snapshot.params['categoryId'] + '/asset-details/' + assetId]);
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
