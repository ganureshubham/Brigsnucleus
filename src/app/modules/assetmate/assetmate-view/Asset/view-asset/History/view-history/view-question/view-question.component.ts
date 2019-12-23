import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../../../public service/spinner.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  roleData: any = {};
  showFirst: boolean = false;



  displayedColumns: string[] = ['question', 'answer', 'isDanger'];
  // 'questionIdFK', 'questionType'
  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  checklistId: any;
  isNoRecordFound: boolean = true;

  constructor(private http: HttpClient,
    private router: Router,
    private assetmateService: AssetmateService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
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
    this.dataService.mSaveData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        this.checklistId = res;
        this.getQuestAnsList(this.checklistId, this.pageNumber);
      }
    })

  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/

  getQuestAnsList(doneChecklistIdFK: number, pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getQuestAnsList(doneChecklistIdFK, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.questionAnswer) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.questionAnswer;
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
    this.getQuestAnsList(this.checklistId, this.page);
  }




  /*********************************************************** Edit Particular Asset  *******************************************************************/

  viewQuestion(doneChecklistId: number) {
    this.dataService.changeData(doneChecklistId);
    this.router.navigate(['/assetmate/view-question']);

  }

  backToList() {
    this.showFirst = !this.showFirst;
  }

}

export interface Role {
  questionIdFK: number;
  questionType: string;
  answer: string;
  isDanger: string;
}
