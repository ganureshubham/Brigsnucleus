import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumateService } from '../service/documate.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { saveAs } from 'file-saver';
import { DialogService } from '../../../public service/dialog.service';
import { AppDialogData } from '../../../model/appDialogData';
import { AddDocumateComponent } from './add-documate/add-documate.component';
import { DocumateCodeComponent } from '../documate-code/documate-code.component';
import jsPDF from 'jspdf';

interface documateDialogData {
  type: string;
  title: string;
  documentType: string;
  description: string;
  documentCodeImage: string;
  filepath: string;
  documentTypeIdFK: number;
  documentId: number;
}


@Component({
  selector: 'app-documate-view',
  templateUrl: './documate-view.component.html',
  styleUrls: ['./documate-view.component.css']
})
export class DocumateViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  manufacturerData: any = {};
  totalAlerts: any;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  Router: any;
  alertid: any;
  totalDocumate: any;
  documentId: number;
  nonzero: boolean = false;
  isNoRecordFound: boolean = true;
  documentForQRcode: any = {};
  allDocumentForQRcode: any = [];
  documentCode1: string = '1';
  dialogData: documateDialogData;
  dialogServiceSubscription: Subscription = null;



  displayedColumns: string[] = ['documentCodeImage', 'title', 'documentType', 'description', 'Actions'];
  paidDataSource: MatTableDataSource<Alert> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;


  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private documateService: DocumateService,
    public dataService: DataSharingService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllDocumates(this.pageNumber);
  }

  ngOnDestroy() {
    if (this.dialogServiceSubscription) {
      this.dialogServiceSubscription.unsubscribe();
    }
  }

  isCurrentUserAdmin() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 1;
  }

  /*********************************************************** Open Document Code Dialog *******************************************************************/

  openDialog(documentCode): void {
    this.dataService.saveData(documentCode);
    const dialogRef = this.dialog.open(DocumateCodeComponent, {
    });

  }


  /*********************************************************** Get all Documents *******************************************************************/

  getAllDocumates(pageNo) {
    this.spinnerService.setSpinnerVisibility(true);
    this.documateService.getAllDocumates(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.document) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.document;
        this.totalDocumate = res.totalCount;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllDocumates(this.page);
  }

  /*********************************************************** Edit Particular Document  *******************************************************************/

  editDocumate(visit: any) {
    this.dialogData = {
      type: 'Edit',
      documentId: visit.documentId,
      title: visit.title,
      documentType: visit.documentType,
      description: visit.description,
      documentCodeImage: visit.documentCodeImage,
      filepath: visit.filepath,
      documentTypeIdFK: visit.documentTypeIdFK
    }
    const dialogRef = this.dialog.open(AddDocumateComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllDocumates(this.pageNumber);
      }
    });
  }


  /*********************************************************** Download Particular Document  *******************************************************************/


  downloadDocument(file) {
    // var FileSaver = require('file-saver');
    const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
    var ext = Ext.substr(Ext.lastIndexOf('.') + 1); // gives extension of any file name
    saveAs(file, Ext);
  }


  /*********************************************************** Delete Particular Document *******************************************************************/


  deleteDocumate(documentId: number, title: string) {
    this.documentId = documentId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE DOCUMENT',
      message: ` Are your sure you want to delete document "${title}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "documate"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == 'documate') {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation
            this.spinnerService.setSpinnerVisibility(true);
            this.documateService.deleteDocumate(this.documentId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              this.getAllDocumates(this.page);
            }, error => {
              this.showSnackBar("Something went wrong..!!");
            });
          }
        }
      })
    }
  }

  /*********************************************************** Search Documate *******************************************************************/

  searchDocumate(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.documateService.searchDocumate(keyword).subscribe(res => {
        if (res && res.data) {
          this.paidDataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.paidDataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }
      },
        error => {
          console.log(error.errors.msg);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllDocumates(this.pageNumber);
      }
    }
  }

  /*********************************************************** Print Particular Qr-Code Document *******************************************************************/

  printQRcode(documate) {
    this.documentForQRcode = documate;
    this.documentCode1 = documate.documentCode;

    setTimeout(() => {
      var html = document.getElementById('qrcode').innerHTML;
      let img64: string = html.substr(0, html.length - 2).split('base64,')[1];
      var dispimg64 = 'data:image/png;base64,' + img64;
      var doc = new jsPDF('l', 'mm', [470, 170]);
      //QRCODE img
      doc.addImage(dispimg64, '*', 5, 5, 50, 50);

      //TITLE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(60, 8, 'Document Title');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(60, 14, this.documentForQRcode.title.length >= 25 ? (this.documentForQRcode.title.substring(0, 25) + ' ...') : this.documentForQRcode.title);

      //DOCUMENTCODE
      doc.setFontSize(12);
      doc.setFontType("normal");
      doc.text(60, 25, 'Document Code');

      doc.setFontSize(16);
      doc.setFontType("bold");
      doc.text(60, 31, this.documentForQRcode.documentCode);

      window.open(doc.output('bloburl'), '_blank');
    }, 50);
  }

  /*********************************************************** Add  Documate *******************************************************************/

  addDocumate(): void {
    this.dialogData = {
      type: 'Add',
      documentId: 0,
      title: '',
      documentType: '',
      description: '',
      documentCodeImage: '',
      filepath: '',
      documentTypeIdFK: 0
    }
    const dialogRef = this.dialog.open(AddDocumateComponent, {
      data: this.dialogData,
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllDocumates(this.pageNumber);
      }
    });
  }

}
export interface Alert {
  title: string;
  documentType: string;
  description: string;
  documentCodeImage: string;
}

