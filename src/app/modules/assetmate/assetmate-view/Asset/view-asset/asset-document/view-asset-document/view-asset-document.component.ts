import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { AssetmateService } from '../../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../../public service/data-sharing.service';
import { AppDialogData } from '../../../../../../../model/appDialogData';
import { DialogService } from '../../../../../../../public service/dialog.service';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../../../../../public service/spinner.service';

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
  displayedColumns: string[] = ['title', 'description', 'Actions'];
  // 'documentId', 
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  deleteDocWithId: number;
  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  animal: any;
  filepath: any;
  filedata: any = {};
  assetID: any;

  constructor(private http: HttpClient,
    private assetmateService: AssetmateService,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private spinnerService: SpinnerService,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    // console.log('Inside asset doc init')
    // this.dataService.mSaveData.subscribe(res => {
    //   if (res != null && res != "null" && res != "null") {
    //     console.log('asset document res', res);
    this.assetID = this.route.snapshot.params['assetId'];
    this.getAllAssetDocuments(this.assetID, this.pageNumber);

    // this.assetID = res.assetId;
    // this.getAllAssetDocuments(this.assetID, this.pageNumber);
    //   }

    // })


  }



  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssetDocuments(assetId, pageNo: any) {
    this.assetmateService.getAllAssetDocuments(assetId, pageNo).subscribe(res => {
      this.dataSource = res.assetDocument;
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
    this.getAllAssetDocuments(this.assetID, this.page);
  }




  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    this.showFirst = !this.showFirst;
    let selectedAsset = null;
    this.dataService.saveData(selectedAsset);
    // this.router.navigate(['/asset/add-asset']) 
  }

  /*********************************************************** Delete Particular Asset *******************************************************************/
  // deleteDocument(documentId: number) {
  //   alert('are you sure?');
  // this.assetmateService.deleteDocument(documentId).subscribe(res => {
  //   this.toastr.success(res.message);
  //   this.getAllAssetDocuments(this.assetID, this.page);
  // })
  // error => {
  //   this.toastr.error(error.message);
  // }
  // }

  deleteDocument(documentId: number, documentTite: string) {

    this.deleteDocWithId = documentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET DOCUMENT',
      message: `Are your sure you want to delete asset document "${documentTite}" ?`,
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
          this.assetmateService.deleteDocument(this.deleteDocWithId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.assetmateService.setBadgeUpdateAction('assetDetails', true);
            this.showSnackBar(res.message);

            this.getAllAssetDocuments(this.assetID, this.page);

          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editDocument(visit: number) {
    this.showFirst = !this.showFirst;
    this.dataService.saveData(visit);
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
    if (keyword) {
      this.assetmateService.searchDocumentByAssetId(keyword, this.assetID).subscribe(res => {
        this.dataSource = res.data;
      }, error => {
        console.log(error);
      })

    } else {
      this.getAllAssetDocuments(this.assetID, this.pageNumber);
    }
  }


  // viewAsset = (assetId: number) => {
  //   this.dataService.changeData(assetId);
  //   this.router.navigate(['/asset/asset-details']);
  // }



}

export interface Document {
  documentId: number;
  title: string;
  description: string;
}
