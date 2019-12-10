import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuffleChecklistQuestionsComponent } from './shuffle-checklist-questions.component';

describe('ShuffleChecklistQuestionsComponent', () => {
  let component: ShuffleChecklistQuestionsComponent;
  let fixture: ComponentFixture<ShuffleChecklistQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShuffleChecklistQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuffleChecklistQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
