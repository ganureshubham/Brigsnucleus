import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
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

  displayedColumns: string[] = ['documentId', 'title', 'description', 'Actions'];
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
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
  ) {

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

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllDocuments(categoryId, pageNo: any) {

    this.spinnerService.setSpinnerVisibility(true);

    this.assetmateService.getAllDocuments(categoryId, pageNo).subscribe(res => {

      this.spinnerService.setSpinnerVisibility(false);

      if (res.categoryDocument) {
        this.dataSource = res.categoryDocument;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
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
    this.getAllDocuments(this.categoryID, this.page);
  }




  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    this.showFirst = !this.showFirst;
    let selectedAsset = null;
    this.dataService.saveData(selectedAsset);
    // this.router.navigate(['/asset/add-asset'])
  }



  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteDocument(documentId: number, documentTitle: string) {

    this.deletedocWithId = documentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE CATEGORY DOCUMENT',
      message: `Are your sure you want to delete document "${documentTitle}" ?`,
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
          this.assetmateService.deleteDocument(this.deletedocWithId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.assetmateService.setBadgeUpdateAction('assetList', true);
            this.getAllDocuments(this.categoryID, this.page);

          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }

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
      this.assetmateService.searchDocumentByCategoryId(keyword, this.categoryID).subscribe(res => {
        this.dataSource = res.data;
      }, error => {
        console.log(error);
      })
    } else {
      this.getAllDocuments(this.categoryID, this.pageNumber);
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
