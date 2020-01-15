import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { AssetmateService } from '../../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../../public service/spinner.service';

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
  isNoRecordFound: boolean = true;


  displayedColumns: string[] = ['checkListTitle', 'doneBy', 'doneOn', 'Actions'];
  // 'doneChecklistId', 
  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  AssetId: any;

  constructor(
    private router: Router,
    private assetmateService: AssetmateService,
    public dataService: DataSharingService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,

  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.AssetId = this.route.snapshot.params['assetId'];
    this.getAssetHistory(this.AssetId, this.pageNumber);
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Roles *******************************************************************/

  getAssetHistory(assetIdFK: number, pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.doneChecklistLists(assetIdFK, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.assetHistory) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.assetHistory;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message)
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
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
