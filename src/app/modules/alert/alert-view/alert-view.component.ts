import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../service/alert.service';

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

  displayedColumns: string[] = ['alertId', 'alertType','title','alertImage','message', 'Actions'];
  paidDataSource: MatTableDataSource<Alert> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    public dataService: DataSharingService, 
    private toastr: ToastrService
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
getAlertList(pageNo:number){
  this.loading=true;
  this.alertService.getAlertList(pageNo).subscribe(res=>{
    console.log(res);
    this.paidDataSource=res.alert;
    this.pageNumber=res.currentPage;
    this.totalCount=res.totalCount;
    this.loading=false;
    
  },
  error=>{
    this.loading=false;
    console.log(error);
    
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
  this.dataService.changeData(alertId);
  this.router.navigate(['/alert/alert-details']);
}


/*********************************************************** Delete Particular Alert *******************************************************************/

  deleteAlert(alertId:number){
    alert('are you sure?');
    this.alertService.deleteAlert(alertId).subscribe(res=>{
      console.log(res);
      this.toastr.success(res.message);
      this.getAlertList(this.page);
      
    },
    error=>{
      console.log(error);
      this.toastr.error(error.message);
      
    })
  }


  ngOnDestroy(): void { }

 


}
export interface Alert {
  alertId: number;
  alertType: string;
  title: string;
  alertImage: string;
  message: string;
}

