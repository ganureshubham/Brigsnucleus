import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskmateTrackComponent } from './view-taskmate-track.component';

describe('ViewTaskmateTrackComponent', () => {
  let component: ViewTaskmateTrackComponent;
  let fixture: ComponentFixture<ViewTaskmateTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTaskmateTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskmateTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
