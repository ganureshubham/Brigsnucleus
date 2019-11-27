import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
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
import jsPDF from 'jspdf';
import { QRCodeComponent } from 'angularx-qrcode';

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
  assetCode1: string = '1';

  displayedColumns: string[] = ['assetCodeImage', 'companyAssetNo', 'assetCode', 'assetImage', 'assetTitle', 'categoryName', 'modelNumber', 'Actions'];
  // 'assetId',
  dataSource: MatTableDataSource<Asset> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  animal: any;
  deleteAssetWithId: number;

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
    this.showFirst = !this.showFirst;
    this.dataService.saveData(assetId);
    // this.dataService.changeData(assetId);
    // this.router.navigate(['/asset/add-asset']);
  }

  /*********************************************************** View Particular Asset  *******************************************************************/


  viewAsset = (assetId: number) => {
    this.router.navigate(['/assetmate/assetmate-details/' + this.route.snapshot.params['categoryId'] + '/asset-details/' + assetId]);
  }

  printQRcode(asset) {

    this.assetForQRcode = asset;
    this.assetCode1 = asset.assetCode;
    // console.log(this.assetCode1);


    setTimeout(() => {

      // var qrCodeImg = document.getElementById("qrcode").innerText;

      // console.log('qrCodeImg');

      // var html = this.qrcodechild.el.nativeElement.innerHTML;
      var html = document.getElementById('qrcode').innerHTML;
      // console.log(html);

      let img64: string = html.substr(0, html.length - 2).split('base64,')[1];
      var dispimg64 = 'data:image/png;base64,' + img64;
      // console.log(dispimg64);

      var doc = new jsPDF('l', 'mm', [370, 150]);

      //QRCODE img
      doc.addImage(dispimg64, '*', 2, 2, 50, 50);

      //TITLE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(60, 8, 'Asset Title');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(60, 14, this.assetForQRcode.assetTitle);

      //ASSETCODE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(60, 25, 'AssetCode');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(60, 31, this.assetForQRcode.assetCode);

      //ASSETCODE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(60, 41, 'Model No.');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(60, 47, this.assetForQRcode.modelNumber);

      window.open(doc.output('bloburl'), '_blank');
    }, 50);

    // var doc = new jsPDF('l', 'mm', [297, 150]);
    // var source = window.document.getElementById("div-print");
    // doc.fromHTML(source, 0, 0, {}, () => {
    //   window.open(doc.output('bloburl'), '_blank');
    // });

    // this.router.navigate([]).then(result => { window.open(`/#/print-qrcode/${assetId}`, '_blank'); });
    // console.log(assetId);
    // doc.text('Hello world!', 10, 10)
    // doc.save('a4.pdf')
    // console.log(source);
    // doc.addHTML(source, options, function () {
    //   doc.save("test.pdf");
    // });
    // doc.output('dataurlnewwindow');
    // doc.save('a4.pdf')
    // doc.autoPrint();

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
  companyAssetNo: string;
}
