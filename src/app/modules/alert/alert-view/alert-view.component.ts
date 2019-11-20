import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../service/alert.service';
import { DialogService } from '../../../public service/dialog.service';
import { AppDialogData } from '../../../model/appDialogData';
import { SpinnerService } from '../../../public service/spinner.service';

@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.css']
})
export class AlertViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  manufacturerData: any = {};
  totalAlerts: any;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = true;



  displayedColumns: string[] = ['alertName', 'title', 'alertImage', 'isRead', 'isDeliver', 'message', 'Actions'];
  paidDataSource: MatTableDataSource<Alert> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  alertid: any;
  alertId: number;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private spinnerService: SpinnerService,

  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAlertList(this.pageNumber);

  }


  /*********************************************************** Get all Alerts *******************************************************************/
  getAlertList(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.alertService.getAlertList(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.totalAlerts) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.totalAlerts = res.totalAlerts;
        this.paidDataSource = res.alert;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAlertList(this.page);
  }

  /*********************************************************** View Particular Alert  *******************************************************************/


  viewAlert(alertId: number) {
    //this.dataService.changeData(alertId);
    this.router.navigate([`/alert/alert-details/${alertId}`]);
  }


  /*********************************************************** Delete Particular Alert *******************************************************************/

  deleteAlert(alertId: number, title: string) {
    this.alertId = alertId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET',
      message: ` Are your sure you want to delete alert "${alertId}"`,
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
          this.alertService.deleteAlert(this.alertId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAlertList(this.page);
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

  /*********************************************************** Search Alerts *******************************************************************/
  searchAlert(keyword) {

    if (keyword) {
      this.alertService.searchAlert(keyword).subscribe(res => {
        this.paidDataSource = res.data;
      }, error => {
        console.log(error);
      })

    } else {
      this.getAlertList(this.pageNumber);
    }
  }




  ngOnDestroy(): void { }




}
export interface Alert {
  alertId: number;
  alertName: string;
  title: string;
  alertImage: string;
  isRead: string;
  isDeliver: string;
  message: string;
}

