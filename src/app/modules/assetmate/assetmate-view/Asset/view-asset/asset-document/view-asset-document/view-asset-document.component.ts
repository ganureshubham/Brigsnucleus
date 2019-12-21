import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { AssetmateService } from '../../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../../public service/data-sharing.service';
import { AppDialogData } from '../../../../../../../model/appDialogData';
import { DialogService } from '../../../../../../../public service/dialog.service';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../../../../../public service/spinner.service';
import { AddAssetDocumentComponent } from './add-asset-document/add-asset-document.component';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-view-asset-document',
  templateUrl: './view-asset-document.component.html',
  styleUrls: ['./view-asset-document.component.css']
})
export class ViewAssetDocumentComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  showFirst: boolean = false;
  Router: any;
  codeData: any;
  parentdata: any;
  result: string = '';
  isNoRecordFound: boolean = true;
  nonzero: boolean = false;
  animal: any;
  filepath: any;
  filedata: any = {};
  assetID: any;
  mobileQuery: MediaQueryList;





  displayedColumns: string[] = ['title', 'description', 'Actions'];
  // 'documentId', 
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  deleteDocWithId: number;
  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  dialogServiceSubscription: Subscription;

  constructor(private http: HttpClient,
    private assetmateService: AssetmateService,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    media: MediaMatcher,

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.assetID = this.route.snapshot.params['assetId'];
    this.getAllAssetDocuments(this.assetID, this.pageNumber);
  }

  ngOnDestroy() {
    this.dialogServiceSubscription.unsubscribe();
  }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssetDocuments(assetId, pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllAssetDocuments(assetId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.assetDocument) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.assetDocument;
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

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllAssetDocuments(this.assetID, this.page);
  }




  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    const dialogRef = this.dialog.open(AddAssetDocumentComponent, {
      width: this.mobileQuery.matches ? '90vw' : '40vw',
      height: this.mobileQuery.matches ? '90vh' : '60vh',
      disableClose: true,
      data: { assetId: this.assetID, action: "add" }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllAssetDocuments(this.assetID, this.pageNumber);
      }
    });
  }

  /*********************************************************** Delete Particular Asset *******************************************************************/


  deleteDocument(documentId: number, documentTite: string) {

    this.deleteDocWithId = documentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET DOCUMENT',
      message: `Are your sure you want to delete asset document "${documentTite}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "document"
    }

    this.dialogService.setDialogVisibility(appDialogData);

    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == "document") {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation 
            this.spinnerService.setSpinnerVisibility(true);
            this.assetmateService.deleteDocument(this.deleteDocWithId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              this.assetmateService.setBadgeUpdateAction('assetDetails', true);
              this.showSnackBar(res.message);
              this.getAllAssetDocuments(this.assetID, this.page);
            }, error => {
              this.showSnackBar("Something went wrong..!!");
            });
          }
        }
      })
    }

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editDocument(visit: number) {
    // this.showFirst = !this.showFirst;
    // this.dataService.saveData(visit);
    const dialogRef = this.dialog.open(AddAssetDocumentComponent, {
      width: this.mobileQuery.matches ? '90vw' : '40vw',
      // height: this.mobileQuery.matches ? '90vh' : '70vh',
      disableClose: true,
      data: { assetId: this.assetID, action: "edit", documentData: visit }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.action) {
        this.getAllAssetDocuments(this.assetID, this.pageNumber);
      }
    });
  }

  /*********************************************************** Download Particular Document  *******************************************************************/


  downloadDocument(file) {
    console.log(file);
    // var FileSaver = require('file-saver');
    const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
    var ext = Ext.substr(Ext.lastIndexOf('.') + 1); // gives extension of any file name
    saveAs(file, Ext);

  }


  /*********************************************************** Search Document *******************************************************************/

  searchDocument(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.assetmateService.searchDocumentByAssetId(keyword, this.assetID).subscribe(res => {
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
        this.getAllAssetDocuments(this.assetID, this.pageNumber);
      }
    }
  }


}

export interface Document {
  documentId: number;
  title: string;
  description: string;
}
