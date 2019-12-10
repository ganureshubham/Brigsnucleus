import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-shuffle-checklist-questions',
  templateUrl: './shuffle-checklist-questions.component.html',
  styleUrls: ['./shuffle-checklist-questions.component.css']
})
export class ShuffleChecklistQuestionsComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  backToList() {
    this.location.back();
  }
}
