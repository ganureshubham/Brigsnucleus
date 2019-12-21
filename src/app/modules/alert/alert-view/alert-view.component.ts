import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../service/alert.service';
import { DialogService } from '../../../public service/dialog.service';
import { AppDialogData } from '../../../model/appDialogData';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppImgDialogComponent } from '../../../shared/app-img-dialog/app-img-dialog.component';

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
  totalAlertsCount: any;
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
  nonzero: boolean = false;

  dialogServiceSubscription: Subscription = null;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,

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
      if (res.alert) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message);
        } else {
          this.isNoRecordFound = false;
        }
        this.totalAlertsCount = res.totalAlerts;
        this.paidDataSource = res.alert;
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

  /*********************************************************** Preview Particular Alert Image  *******************************************************************/

  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'Alert', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
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
      title: 'DELETE ALERT',
      message: ` Are your sure you want to delete alert "${title}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "alert"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == 'alert') {
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
        }
      })
    }
  }


  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Search Alerts *******************************************************************/

  searchAlert(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.alertService.searchAlert(keyword).subscribe(res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res && res.data) {
          this.paidDataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.paidDataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }

      },
        error => {
          this.spinnerService.setSpinnerVisibility(false);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAlertList(this.pageNumber);
      }
    }
  }

  getAlertImagePath(imageUrl) {
    if (imageUrl != null && imageUrl.length > 0) {
      return imageUrl;
    }
    return 'assets/img/defaultImage.png';
  }

  ngOnDestroy() {
    if (this.dialogServiceSubscription) {
      this.dialogServiceSubscription.unsubscribe();
    }
  }



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

