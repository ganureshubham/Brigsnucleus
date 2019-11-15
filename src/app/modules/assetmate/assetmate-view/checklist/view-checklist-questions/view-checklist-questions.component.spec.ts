import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChecklistQuestionsComponent } from './view-checklist-questions.component';

describe('ViewChecklistQuestionsComponent', () => {
  let component: ViewChecklistQuestionsComponent;
  let fixture: ComponentFixture<ViewChecklistQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChecklistQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChecklistQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
