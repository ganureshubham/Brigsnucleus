import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskmateTransferComponent } from './view-taskmate-transfer.component';

describe('ViewTaskmateTransferComponent', () => {
  let component: ViewTaskmateTransferComponent;
  let fixture: ComponentFixture<ViewTaskmateTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTaskmateTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskmateTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
