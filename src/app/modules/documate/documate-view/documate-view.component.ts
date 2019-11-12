import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumateService } from '../service/documate.service';
import { SpinnerService } from '../../../public service/spinner.service';


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


  // viewAlert(alertId: number) {
  //   this.router.navigate([`/alert/alert-details/${alertId}`]);
  // }


  /*********************************************************** Delete Particular Alert *******************************************************************/

  // deleteAlert(alertId: number) {
  //   alert('are you sure?');
  //   this.alertService.deleteAlert(alertId).subscribe(res => {
  //     console.log(res);
  //     this.toastr.success(res.message);
  //     this.getAlertList(this.page);

  //   },
  //     error => {
  //       console.log(error);
  //       this.toastr.error(error.message);

  //     })
  // }

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



  ngOnDestroy(): void { }




}
export interface Alert {
  title: string;
  documentType: string;
  description: string;
}

