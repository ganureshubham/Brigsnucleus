import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignUserComponent } from './view-assign-user.component';

describe('ViewAssignUserComponent', () => {
  let component: ViewAssignUserComponent;
  let fixture: ComponentFixture<ViewAssignUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssignUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
