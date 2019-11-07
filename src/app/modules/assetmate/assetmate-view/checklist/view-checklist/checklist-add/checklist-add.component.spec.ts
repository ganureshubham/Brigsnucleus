import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistAddComponent } from './checklist-add.component';

describe('ChecklistAddComponent', () => {
  let component: ChecklistAddComponent;
  let fixture: ComponentFixture<ChecklistAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
