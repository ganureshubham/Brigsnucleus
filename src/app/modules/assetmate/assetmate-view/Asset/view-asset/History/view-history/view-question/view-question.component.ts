import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { AssetmateService } from '../../../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../../../public service/spinner.service';
import { AppImgDialogComponent } from '../../../../../../../../shared/app-img-dialog/app-img-dialog.component';

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
  imgurl: any;
  answers: any;

  constructor(private http: HttpClient,
    private router: Router,
    private assetmateService: AssetmateService,
    public dataService: DataSharingService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog
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

  /*********************************************************** Preview Particular Question Image  *******************************************************************/
  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'Checklist Questions', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

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
        for (let i = 0; i < res.questionAnswer.length; i++) {
          let answerlist = res.questionAnswer[i].answer;
          if (answerlist.includes("IMG")) {
            this.answers = answerlist;
          }
        }
        this.assetmateService.getChecklistImage(this.answers).subscribe(res => {
          this.imgurl = res.data.checklistImage;
        })
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
