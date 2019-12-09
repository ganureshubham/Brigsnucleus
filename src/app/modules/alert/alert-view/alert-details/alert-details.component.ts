import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { AppImgDialogComponent } from '../../../../shared/app-img-dialog/app-img-dialog.component';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.css']
})
export class AlertDetailsComponent implements AfterViewInit, OnInit {
  alertData: any = {};
  alertid: any;
  countData: any = {};
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  isNoRecordFound: boolean = true;
  nonzero: boolean = false;



  displayedColumns: string[] = ['userImage', 'userName', 'isRead', 'isDeliver', 'readDate',];
  paidDataSource: MatTableDataSource<AlertTracking> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private dataService: DataSharingService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.alertid = this.route.snapshot.params['alertId'];
    this.alertData.alertImage = '';
    this.viewAlert(this.alertid);
    this.getAllTrackingList(this.alertid, this.pageNumber);
  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }


  /*********************************************************** Alert List *******************************************************************/

  viewAlert(alertId: number) {
    this.alertService.viewAlert(alertId).subscribe(res => {
      this.alertData = res.alert;
      this.countData = res;
    },
      error => {
        console.log(error);

      })

  }

  /*********************************************************** Preview Particular Alert Image  *******************************************************************/

  priviewImage(type, title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: type, imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllTrackingList(this.alertid, this.page);
  }


  /*********************************************************** Alert Tracking List *******************************************************************/

  getAllTrackingList(alertId: number, pageNo: number) {
    this.alertService.getAllTrackingList(alertId, pageNo).subscribe(res => {
      if (res.alertTrack) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.alertTrack;
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

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Search Alerts *******************************************************************/

  searchTrackingAlert(keyword) {

    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.alertService.searchTrackingAlert(this.alertid, keyword).subscribe(res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res && res.data) {
          this.paidDataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.paidDataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }
      }, error => {
        this.spinnerService.setSpinnerVisibility(false);
      })
    }
    else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllTrackingList(this.alertid, this.pageNumber);
      }
    }
  }

  /*********************************************************** Back to Alert Lists *******************************************************************/

  backToList() {
    this.router.navigate(['/alert']);
  }

  alertImg() {
    return this.alertData.alertImage.length == 0 ? 'assets/img/defaultalert.png' : this.alertData.alertImage;
  }


}

export interface AlertTracking {
  userImage: string,
  userName: string,
  isRead: number,
  isDeliver: number,
  readDate: string
}
