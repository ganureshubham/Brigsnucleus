import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsNavigationComponent } from './reports-navigation.component';

describe('ReportsNavigationComponent', () => {
  let component: ReportsNavigationComponent;
  let fixture: ComponentFixture<ReportsNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
