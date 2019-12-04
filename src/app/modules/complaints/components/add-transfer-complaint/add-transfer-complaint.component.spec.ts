import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferComplaintComponent } from './add-transfer-complaint.component';

describe('AddTransferComplaintComponent', () => {
  let component: AddTransferComplaintComponent;
  let fixture: ComponentFixture<AddTransferComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransferComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransferComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
