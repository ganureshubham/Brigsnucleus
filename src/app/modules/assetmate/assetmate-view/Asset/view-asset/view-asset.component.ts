import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { AssetCodeComponent } from '../asset-code/asset-code.component';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../../../../public service/dialog.service';
import { AppDialogData } from '../../../../../model/appDialogData';
import jsPDF from 'jspdf';
import { AssetAddComponent } from '../../Asset/view-asset/asset-add/asset-add.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppImgDialogComponent } from '../../../../../shared/app-img-dialog/app-img-dialog.component';

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
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = true;
  assetForQRcode: any = {};
  allAssetForQRcode: any = [];
  nonzero: boolean = false;
  assetCode1: string = '1';
  mobileQuery: MediaQueryList;
  displayedColumns: string[] = ['assetCodeImage', 'companyAssetNo', 'assetCode', 'assetImage', 'assetTitle', 'categoryName', 'modelNumber', 'activateasset', 'Actions'];
  // 'assetId',
  dataSource: MatTableDataSource<Asset> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  animal: any;
  deleteAssetWithId: number;

  constructor(private http: HttpClient,
    media: MediaMatcher,
    private route: ActivatedRoute,
    private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
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
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.asset;
        this.parentdata = res.asset;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message)
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
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
    if (keyword.length > 0) {
      this.nonzero = true;
      this.assetmateService.searchAsset(this.categoryID, keyword).subscribe(res => {
        if (res && res.data) {
          this.dataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.dataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }

      },
        error => {
          console.log(error.errors.msg);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllAssets(this.categoryID, this.pageNumber);
      }
    }
  }

  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    const dialogRef = this.dialog.open(AssetAddComponent, {
      width: this.mobileQuery.matches ? '90vw' : '80vw',
      // height: this.mobileQuery.matches ? '90vh' : '70vh',
      disableClose: true,
      data: { categoryId: this.categoryID, action: "add" }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.action) {
        this.getAllAssets(this.categoryID, this.pageNumber);
      }
    });
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
  deleteAsset(assetId: number, assetTitle: string) {

    this.deleteAssetWithId = assetId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET',
      message: `Are your sure you want to delete asset "${assetTitle}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel"
    }

    this.dialogService.setDialogVisibility(appDialogData);

    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogService.getUserDialogAction().subscribe(userAction => {
        if (userAction == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (userAction == 1) {

          this.dialogService.setUserDialogAction(0);

          //User has approved delete operation 
          this.spinnerService.setSpinnerVisibility(true);
          this.assetmateService.deleteAsset(this.deleteAssetWithId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.assetmateService.setBadgeUpdateAction('assetList', true);
            this.getAllAssets(this.categoryID, this.page);

          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editAsset(assetId: number) {
    const dialogRef = this.dialog.open(AssetAddComponent, {
      width: this.mobileQuery.matches ? '90vw' : '80vw',
      height: this.mobileQuery.matches ? '90vh' : '70vh',
      disableClose: true,
      data: { categoryId: this.categoryID, action: "edit", assetId: assetId }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.action) {
        this.getAllAssets(this.categoryID, this.pageNumber);
      }
    });

  }


  /*********************************************************** Preview Particular Asset Image  *******************************************************************/

  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'Asset', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

  /*********************************************************** View Particular Asset  *******************************************************************/


  viewAsset = (assetId: number) => {
    this.router.navigate(['/assetmate/assetmate-details/' + this.route.snapshot.params['categoryId'] + '/asset-details/' + assetId]);
  }

  printQRcode(asset) {

    let imageLeftMargin = 5;
    let textLeftMargin = 60;
    let allCompTopMargin = 5;

    this.assetForQRcode = asset;
    this.assetCode1 = asset.assetCode;
    // console.log(this.assetCode1);


    setTimeout(() => {
      var html = document.getElementById('qrcode').innerHTML;
      // console.log(html);

      let img64: string = html.substr(0, html.length - 2).split('base64,')[1];
      var dispimg64 = 'data:image/png;base64,' + img64;
      // console.log(dispimg64);

      var doc = new jsPDF('l', 'mm', [470, 170]);

      //QRCODE img
      doc.addImage(dispimg64, '*', imageLeftMargin, allCompTopMargin, 50, 50);

      //TITLE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(textLeftMargin, 8, 'Asset Title');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(textLeftMargin, 14, this.assetForQRcode.assetTitle.length >= 25 ? (this.assetForQRcode.assetTitle.substring(0, 25) + ' ...') : this.assetForQRcode.assetTitle);

      //ASSETCODE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(textLeftMargin, 25, 'AssetCode');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(textLeftMargin, 31, this.assetForQRcode.assetCode);

      //MODELNO
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(textLeftMargin, 41, 'Model No.');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(textLeftMargin, 47, this.assetForQRcode.modelNumber);

      window.open(doc.output('bloburl'), '_blank');
    }, 50);

  }

  printAllAssetQRcode() {

    this.spinnerService.setSpinnerVisibility(true);

    let imageLeftMargin = 5;
    let textLeftMargin = 60;
    let allCompTopMargin = 5;

    this.assetmateService.getAllAssetsByCategoryId(this.categoryID).subscribe(
      resp => {
        if (resp.status) {

          this.allAssetForQRcode = resp.data;

          setTimeout(() => {

            var doc = new jsPDF('l', 'mm', [470, 170]);

            for (let i = 0; i < this.allAssetForQRcode.length; i++) {

              var html = document.getElementById('qrcode' + i).innerHTML;

              let img64: string = html.substr(0, html.length - 2).split('base64,')[1].split('"')[0];
              var dispimg64 = 'data:image/png;base64,' + img64;
              // console.log('----------------------------');
              // console.log((html.substr(0, html.length - 2).split('base64,')[1]).split('"')[0]);
              // console.log(dispimg64);

              doc.addImage(dispimg64, '*', imageLeftMargin, allCompTopMargin, 50, 50);

              doc.setFontSize(12);
              doc.setFontType("normal");
              doc.text(textLeftMargin, 8, 'Asset Title');

              doc.setFontSize(16);
              doc.setFontType("bold");
              doc.text(textLeftMargin, 14, this.allAssetForQRcode[i].assetTitle.length >= 25 ? (this.allAssetForQRcode[i].assetTitle.substring(0, 25) + ' ...') : this.allAssetForQRcode[i].assetTitle);

              doc.setFontSize(12);
              doc.setFontType("normal");
              doc.text(textLeftMargin, 25, 'AssetCode');

              doc.setFontSize(16);
              doc.setFontType("bold");
              doc.text(textLeftMargin, 31, this.allAssetForQRcode[i].assetCode);

              doc.setFontSize(12);
              doc.setFontType("normal");
              doc.text(textLeftMargin, 41, 'Model No.');

              doc.setFontSize(16);
              doc.setFontType("bold");
              doc.text(textLeftMargin, 47, this.allAssetForQRcode[i].modelNumber);

              if (i != (resp.data.length - 1)) {
                doc.addPage();
              }

            }

            this.spinnerService.setSpinnerVisibility(false);
            this.allAssetForQRcode = [];
            window.open(doc.output('bloburl'), '_blank');

          },
            // Number(this.allAssetForQRcode.length * 1000)
            50
          );

        } else {
          this.spinnerService.setSpinnerVisibility(false);
          this.showSnackBar(resp.message)
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!")
      }
    );

  }

  activateAsset(assetId: number, value: any) {
    let body = {
      isActive: value.checked ? 1 : 0
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.assetActive(assetId, body).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        this.showSnackBar(res.message);
        this.getAllAssets(this.categoryID, this.pageNumber);
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

}

export interface Asset {
  assetId: number;
  isActive: string;
  assetCodeImage: string;
  assetCode: number;
  assetImage: string;
  assetTitle: string;
  categoryName: string;
  modelNumber: string;
  companyAssetNo: string;
}
