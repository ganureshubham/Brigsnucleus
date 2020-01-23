import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCronLogsComponent } from './view-cron-logs.component';

describe('ViewCronLogsComponent', () => {
  let component: ViewCronLogsComponent;
  let fixture: ComponentFixture<ViewCronLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCronLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCronLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
