import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource, MatSnackBar, MatTable } from '@angular/material';
import { SpinnerService } from 'src/app/public service/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { AssetmateService } from 'src/app/modules/assetmate/service/assetmate.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface ChecklistQuestion {
  checklistId: number,
  questionDescription: string,
  questionId: number,
  questionOptions: {
    questionOptionId: number,
    optionTitle: string
  }[],
  questionType: string,
  sequenceNumber: number
}

interface FinalQuestionToUpdateSeq {
  questionId: number,
  sequenceNo: number
}

@Component({
  selector: 'app-shuffle-checklist-questions',
  templateUrl: './shuffle-checklist-questions.component.html',
  styleUrls: ['./shuffle-checklist-questions.component.css']
})
export class ShuffleChecklistQuestionsComponent implements OnInit {

  checklistId: number;
  categoryId: number;
  checklistQuestions: any = {};
  displayedColumns: string[] = ['actions', 'questionDescription', 'questionType', 'questionOptions'];
  dataSource: MatTableDataSource<ChecklistQuestion[]> = new MatTableDataSource();
  isNoRecordFound: boolean = true;

  @ViewChild('table') table: MatTable<ChecklistQuestion>;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService,
    private assetmateService: AssetmateService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.checklistId = this.activatedRoute.parent.snapshot.params['checkListId'];
    this.getChecklistQuestions(this.checklistId);
  }

  getChecklistQuestions(checklistId: number) {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllChecklistQuestions(checklistId).subscribe((resp: any) => {
      if (resp.question) {
        if (resp.question.length == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.checklistQuestions = [].concat(resp.question);
        this.dataSource = resp.question;
        this.spinnerService.setSpinnerVisibility(false);
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(resp.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    )

  }

  getQuestionOption(questionOptions) {
    let allquestionOptions = "";
    for (let questionOption of questionOptions) {
      allquestionOptions += questionOption.optionTitle + ', ';
    }
    return allquestionOptions;
  }

  dropTable(event: CdkDragDrop<ChecklistQuestion[]>) {
    const prevIndex = (<any>this.dataSource).findIndex((d) => d.questionId == event.item.data.questionId);
    moveItemInArray(<any>this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  saveAndBackToList() {

    this.spinnerService.setSpinnerVisibility(true);

    let sequenceNumber: FinalQuestionToUpdateSeq[] = [];
    for (let i = 0; i < this.checklistQuestions.length; i++) {
      sequenceNumber.push({
        'questionId': this.dataSource[i].questionId,
        'sequenceNo': this.checklistQuestions[i].sequenceNumber
      })
    }

    let updateSequesnceNos = {
      sequenceNumber: sequenceNumber
    }

    this.assetmateService.updateCheckListQuestionSequence(updateSequesnceNos).subscribe(
      resp => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(resp.message);
        if (resp.status) {
          this.location.back();
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );

  }

}
