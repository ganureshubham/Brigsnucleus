import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-checklist-question',
  templateUrl: './details-checklist-question.component.html',
  styleUrls: ['./details-checklist-question.component.css']
})
export class DetailsChecklistQuestionComponent implements OnInit {

  checklistId: any;
  categoryId: any;
  questionId: any;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.checklistId = this.activatedRoute.snapshot.parent.params['checkListId'];
    this.categoryId = this.activatedRoute.snapshot.parent.params['categoryId'];
    this.questionId = this.activatedRoute.snapshot.params['questionId'];
  }

  backToListChecklistQuestionList() {
    this.location.back();
  }

  navigateToLinkQuestion() {
    this.router.navigate([`assetmate/assetmate-details/${this.categoryId}/checklist/${this.checklistId}/add-question/${this.questionId}`]);
  }

}
