import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { AssetmateService } from '../../../../service/assetmate.service';
import { MatSnackBar } from '@angular/material';
import { AppDialogData } from 'src/app/model/appDialogData';
import { DialogService } from '../../../../../../public service/dialog.service';

@Component({
  selector: 'app-checklist-question-list',
  templateUrl: './checklist-question-list.component.html',
  styleUrls: ['./checklist-question-list.component.css']
})
export class ChecklistQuestionListComponent implements OnInit {

  checklistId: number;
  categoryId: number;
  checklistPrimaryInfo: any = {};
  pageNumber = 0;
  totalCount = 0;
  checklistQuestions: any = {};
  displayedColumns: string[] = ['questionType', 'questionDescription', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  deleteQuestionWithId: number;
  isAlreadySubscribedToDialogUserActionService: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private assetmateService: AssetmateService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.checklistId = this.activatedRoute.snapshot.params['checkListId'];
    this.categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.getChecklistTitle(this.checklistId);
    this.getChecklistQuestions(this.checklistId, this.pageNumber);
  }

  getChecklistTitle(checklistId: number) {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getChecklistPrimaryInfoByChecklistId(checklistId).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      if (resp.checklist) {
        this.checklistPrimaryInfo = resp.checklist;
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    )

  }

  getChecklistQuestions(checklistId: number, pageNo: number) {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getChecklistQuestions(checklistId, pageNo).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      console.log(resp)
      if (resp.question) {
        this.checklistQuestions = resp.question;
        this.dataSource = this.checklistQuestions;
        this.pageNumber = resp.currentPage;
        this.totalCount = resp.totalCount;
      } else {
        this.showSnackBar(resp.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    )

  }

  addNewChecklistQuestion() {
    this.router.navigate(['assetmate/assetmate-details/' + this.categoryId + '/checklist/' + this.checklistId + '/add-question']);
  }

  editChecklistQuestion() {
    this.router.navigate(['assetmate/assetmate-details/' + this.categoryId + '/checklist/' + this.checklistId + '/edit-question']);
  }

  deleteChecklistQuestion(questionId, questionDescription) {
    this.deleteQuestionWithId = questionId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE CHECKLIST QUESTION',
      message: `Are your sure you want to delete question "${questionDescription}" ?`,
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
          this.assetmateService.deleteCheckListQuestion(this.deleteQuestionWithId).subscribe((res: any) => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);

            //------------------Update Badge-----------------------
            // this.assetmateService.setBadgeUpdateAction('assetList', true);

            this.getChecklistQuestions(this.checklistId, this.pageNumber);

          }, error => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar("Something went wrong..!!");
            console.log(error);
          });
        }
      })
    }
  }

  pageChange(pageNo: any) {
    this.pageNumber = pageNo.pageIndex;
    this.getChecklistQuestions(this.checklistId, this.pageNumber);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  navigaetToAddQuestion() {
    this.router.navigate(['/assetmate/assetmate-details/1/checklist/1/add-question'], { relativeTo: this.activatedRoute });
  }

}
