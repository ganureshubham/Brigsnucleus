import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskmateTransferComponent } from './add-taskmate-transfer.component';

describe('AddTaskmateTransferComponent', () => {
  let component: AddTaskmateTransferComponent;
  let fixture: ComponentFixture<AddTaskmateTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaskmateTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskmateTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
