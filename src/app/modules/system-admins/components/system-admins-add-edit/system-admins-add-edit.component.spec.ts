import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminsAddEditComponent } from './system-admins-add-edit.component';

describe('SystemAdminsAddEditComponent', () => {
  let component: SystemAdminsAddEditComponent;
  let fixture: ComponentFixture<SystemAdminsAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminsAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
