import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { saveAs } from 'file-saver';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../../../../public service/dialog.service';
import { AppDialogData } from 'src/app/model/appDialogData';
import { MediaMatcher } from '@angular/cdk/layout';
import { AddCategoryDocumentComponent } from './add-category-document/add-category-document.component';

@Component({
  selector: 'app-view-category-document',
  templateUrl: './view-category-document.component.html',
  styleUrls: ['./view-category-document.component.css']
})
export class ViewCategoryDocumentComponent implements AfterViewInit, OnDestroy {

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
  deletedocWithId;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = true;
  mobileQuery: MediaQueryList;
  nonzero: boolean = false;




  displayedColumns: string[] = ['title', 'description', 'Actions'];
  // 'documentId',
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  dialogServiceSubscription: Subscription;
  animal: any;
  filepath: any;
  filedata: any = {};

  constructor(private http: HttpClient,
    private assetmateService: AssetmateService,
    private router: Router,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
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
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllDocuments(this.categoryID, this.pageNumber);
  }

  ngOnDestroy() {
    this.dialogServiceSubscription.unsubscribe();
  }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllDocuments(categoryId, pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllDocuments(categoryId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.categoryDocument) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.categoryDocument;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
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
    this.getAllDocuments(this.categoryID, this.page);
  }




  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    const dialogRef = this.dialog.open(AddCategoryDocumentComponent, {
      width: this.mobileQuery.matches ? '90vw' : '40vw',
      // height: this.mobileQuery.matches ? '90vh' : '60vh',
      disableClose: true,
      data: { categoryId: this.categoryID, action: "add" }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllDocuments(this.categoryID, this.pageNumber);
      }
    });
  }



  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteDocument(documentId: number, documentTitle: string) {

    this.deletedocWithId = documentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE CATEGORY DOCUMENT',
      message: `Are your sure you want to delete document "${documentTitle}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "category-document"
    }

    this.dialogService.setDialogVisibility(appDialogData);

    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == "category-document") {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation 
            this.spinnerService.setSpinnerVisibility(true);
            this.assetmateService.deleteDocument(this.deletedocWithId).subscribe(res => {

              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              this.assetmateService.setBadgeUpdateAction('assetList', true);
              this.getAllDocuments(this.categoryID, this.page);

            }, error => {
              this.showSnackBar("Something went wrong..!!");
            });
          }

        }
      })
    }

  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editDocument(visit) {
    const dialogRef = this.dialog.open(AddCategoryDocumentComponent, {
      width: this.mobileQuery.matches ? '90vw' : '40vw',
      // height: this.mobileQuery.matches ? '90vh' : '70vh',
      disableClose: true,
      data: { categoryId: this.categoryID, action: "edit", documentData: visit }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.action) {
        this.getAllDocuments(this.categoryID, this.pageNumber);
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
      this.assetmateService.searchDocumentByCategoryId(keyword, this.categoryID).subscribe(res => {
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
        this.getAllDocuments(this.categoryID, this.pageNumber);
      }
    }
  }



}

export interface Document {
  documentId: number;
  title: string;
  description: string;
}
