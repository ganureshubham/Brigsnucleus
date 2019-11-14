import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumateService } from '../service/documate.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { saveAs } from 'file-saver';
import { DialogService } from '../../../public service/dialog.service';
import { AppDialogData } from '../../../model/appDialogData';


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




  displayedColumns: string[] = ['title', 'documentType', 'description', 'Actions'];
  paidDataSource: MatTableDataSource<Alert> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  alertid: any;
  totalDocumate: any;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private documateService: DocumateService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    public dataService: DataSharingService,
    private dialogService: DialogService
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


  /*********************************************************** Get all Alerts *******************************************************************/

  getAllDocumates(pageNo) {
    this.spinnerService.setSpinnerVisibility(true);

    this.documateService.getAllDocumates(pageNo).subscribe(res => {
      console.log(res);

      this.spinnerService.setSpinnerVisibility(false);
      if (res.document) {
        this.paidDataSource = res.document;
        this.totalDocumate = res.totalCount;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message)
      }
    },
      error => {
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

  /*********************************************************** View Particular Alert  *******************************************************************/


  editDocumate(visit: any) {
    this.dataService.changeData(visit);
    this.router.navigate(['/documate/add-documate']);


  }

  /*********************************************************** Download Particular Document  *******************************************************************/


  downloadDocument(file) {
    console.log(file);
    // var FileSaver = require('file-saver');
    const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
    var ext = Ext.substr(Ext.lastIndexOf('.') + 1); // gives extension of any file name
    saveAs(file, Ext);

  }


  /*********************************************************** Delete Particular Alert *******************************************************************/


  deleteDocumate(documentId: number, title: string) {
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET',
      message: ` Are your sure you want to delete documate "${documentId}"`,
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
          this.documateService.deleteDocumate(documentId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllDocumates(this.page);
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }
  /*********************************************************** Search Documate *******************************************************************/

  searchDocumate(keyword) {
    if (keyword) {
      this.documateService.searchDocumate(keyword).subscribe(res => {
        this.paidDataSource = res.data;
      },
        error => {
          console.log(error);

        })
    } else {
      this.getAllDocumates(this.pageNumber);
    }
  }



  addDocumate() {
    let selectedManufacturer = null;
    this.dataService.changeData(selectedManufacturer);
    this.router.navigate(['/documate/add-documate']);
  }



  ngOnDestroy(): void { }




}
export interface Alert {
  title: string;
  documentType: string;
  description: string;
}
