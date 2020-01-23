import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminChangePasswordComponent } from './superadmin-change-password.component';

describe('SuperadminChangePasswordComponent', () => {
  let component: SuperadminChangePasswordComponent;
  let fixture: ComponentFixture<SuperadminChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
