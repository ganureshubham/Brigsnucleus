import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferComplaintComponent } from './view-transfer-complaint.component';

describe('ViewTransferComplaintComponent', () => {
  let component: ViewTransferComplaintComponent;
  let fixture: ComponentFixture<ViewTransferComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransferComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransferComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
