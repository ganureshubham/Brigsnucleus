import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../../../service/assetmate.service';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.css']
})
export class ViewHistoryComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  roleData: any = {};
  showFirst: boolean = false;


  displayedColumns: string[] = ['checkListTitle', 'doneBy', 'doneOn', 'Actions'];
  // 'doneChecklistId', 
  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  AssetId: any;

  constructor(private http: HttpClient,
    private router: Router,
    private assetmateService: AssetmateService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    // this.dataService.mSaveData.subscribe(res => {
    //   if (res != null && res != "null" && res != "null") { 
    //     this.AssetId=res;
    this.AssetId = this.route.snapshot.params['assetId'];
    this.getAssetHistory(this.AssetId, this.pageNumber);
    //   }
    // })

  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/



  getAssetHistory(assetIdFK: number, pageNo: any) {
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 1000);
    this.assetmateService.doneChecklistLists(assetIdFK, pageNo).subscribe(res => {
      console.log('doneChecklistLists : ');
      console.log(res);
      this.paidDataSource = res.assetHistory;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;


    },
      error => {
        this.toastr.error(error.error.message);
        console.log(error);
      }
    )
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAssetHistory(this.AssetId, this.page);
  }




  /*********************************************************** Edit Particular Asset  *******************************************************************/

  viewQuestion(doneChecklistId: number) {
    this.dataService.saveData(doneChecklistId);
    this.showFirst = !this.showFirst;
    //this.router.navigate(['/assetmate/view-question']); 

  }


}

export interface Role {
  doneChecklistId: number;
  checkListTitle: string;
  doneBy: string;
  doneOn: string;
}
