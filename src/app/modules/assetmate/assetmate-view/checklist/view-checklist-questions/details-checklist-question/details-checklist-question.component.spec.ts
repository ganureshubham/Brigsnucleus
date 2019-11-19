import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsChecklistQuestionComponent } from './details-checklist-question.component';

describe('DetailsChecklistQuestionComponent', () => {
  let component: DetailsChecklistQuestionComponent;
  let fixture: ComponentFixture<DetailsChecklistQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsChecklistQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsChecklistQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
