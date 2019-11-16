import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-checklist-question',
  templateUrl: './add-checklist-question.component.html',
  styleUrls: ['./add-checklist-question.component.css']
})
export class AddChecklistQuestionComponent implements OnInit {

  constructor(
    private location: Location,
  ) { }

  ngOnInit() {
    console.log('navigaetToAddQuestion1');
  }

  backToListChecklistQuestionList() {
    this.location.back();
  }

}
