import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignUserComponent } from './add-assign-user.component';

describe('AddAssignUserComponent', () => {
  let component: AddAssignUserComponent;
  let fixture: ComponentFixture<AddAssignUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
