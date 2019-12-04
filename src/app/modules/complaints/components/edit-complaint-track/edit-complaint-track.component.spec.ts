import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComplaintTrackComponent } from './edit-complaint-track.component';

describe('EditComplaintTrackComponent', () => {
  let component: EditComplaintTrackComponent;
  let fixture: ComponentFixture<EditComplaintTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditComplaintTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComplaintTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
