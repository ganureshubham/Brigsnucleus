import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskmateComponent } from './add-taskmate.component';

describe('AddTaskmateComponent', () => {
  let component: AddTaskmateComponent;
  let fixture: ComponentFixture<AddTaskmateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaskmateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskmateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
