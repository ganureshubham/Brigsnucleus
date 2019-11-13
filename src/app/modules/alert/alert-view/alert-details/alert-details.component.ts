import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { DataSharingService } from '../../../../public service/data-sharing.service';

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
    private dataService: DataSharingService
  ) { }

  ngOnInit() {
    this.alertid = this.route.snapshot.params['alertId'];
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
      console.log('view Function', res);
      this.alertData = res.alert;
      this.countData = res;
    },
      error => {
        console.log(error);

      })

  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllTrackingList(this.alertid, this.page);
  }


  /*********************************************************** Alert Tracking List *******************************************************************/

  getAllTrackingList(alertId: number, pageNo: number) {
    this.alertService.getAllTrackingList(alertId, pageNo).subscribe(res => {
      this.paidDataSource = res.alertTrack;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;

    })
  }

  /*********************************************************** Search Alerts *******************************************************************/

  searchTrackingAlert(keyword) {

    if (keyword) {
      this.alertService.searchTrackingAlert(this.alertid, keyword).subscribe(res => {
        this.paidDataSource = res.data;
      }, error => {
        console.log(error);
      })
    } else {
      this.getAllTrackingList(this.alertid, this.pageNumber);
    }
  }

  /*********************************************************** Back to Alert Lists *******************************************************************/

  backToList() {
    this.router.navigate(['/alert']);
  }


}

export interface AlertTracking {
  userImage: string,
  userName: string,
  isRead: number,
  isDeliver: number,
  readDate: string
}
