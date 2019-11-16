import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChecklistQuestionComponent } from './add-checklist-question.component';

describe('AddChecklistQuestionComponent', () => {
  let component: AddChecklistQuestionComponent;
  let fixture: ComponentFixture<AddChecklistQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChecklistQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChecklistQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
