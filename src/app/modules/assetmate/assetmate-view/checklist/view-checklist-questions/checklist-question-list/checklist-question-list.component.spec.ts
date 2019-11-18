import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistQuestionListComponent } from './checklist-question-list.component';

describe('ChecklistQuestionListComponent', () => {
  let component: ChecklistQuestionListComponent;
  let fixture: ComponentFixture<ChecklistQuestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistQuestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
