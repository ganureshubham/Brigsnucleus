import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComplaintTrackComponent } from './view-complaint-track.component';

describe('ViewComplaintTrackComponent', () => {
  let component: ViewComplaintTrackComponent;
  let fixture: ComponentFixture<ViewComplaintTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewComplaintTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComplaintTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
