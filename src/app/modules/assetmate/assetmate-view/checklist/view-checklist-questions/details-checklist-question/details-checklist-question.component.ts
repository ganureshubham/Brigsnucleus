import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { AssetmateService } from '../../../../service/assetmate.service';
import { MatSnackBar } from '@angular/material';
import { questionDetails } from '../../../../../../model/questionDetails';

@Component({
  selector: 'app-details-checklist-question',
  templateUrl: './details-checklist-question.component.html',
  styleUrls: ['./details-checklist-question.component.css']
})
export class DetailsChecklistQuestionComponent implements OnInit {

  checklistId: any;
  categoryId: any;
  questionId: any;
  questionDetails: any = {};

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private assetmateService: AssetmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.checklistId = this.activatedRoute.snapshot.parent.params['checkListId'];
    this.categoryId = this.activatedRoute.snapshot.parent.params['categoryId'];
    this.questionId = this.activatedRoute.snapshot.params['questionId'];
    this.getQuestionDetails();
  }

  getQuestionDetails() {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getQuestionDetails(this.questionId).subscribe((resp: questionDetails) => {
      this.spinnerService.setSpinnerVisibility(false);

      if (resp.Question) {
        this.questionDetails = resp.Question;
      } else {
        this.showSnackBar(resp.message);
      }

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  backToListChecklistQuestionList() {
    this.location.back();
  }

  navigateToLinkQuestion(questioOptionId) {
    this.router.navigate([`assetmate/assetmate-details/${this.categoryId}/checklist/${this.checklistId}/add-question/${questioOptionId}`]);
  }

  areOptionsAvailaableForQuestion() {
    if ('questionOptions' in this.questionDetails) {
      return this.questionDetails.questionOptions.length > 0;
    }
    return false;
  }

  editLinkedQuestion(questionId) {
    this.router.navigate([`assetmate/assetmate-details/${this.categoryId}/checklist/${this.checklistId}/edit-question/${questionId}`]);
  }

}
