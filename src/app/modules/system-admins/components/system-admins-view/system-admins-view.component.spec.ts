import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminsViewComponent } from './system-admins-view.component';

describe('SystemAdminsViewComponent', () => {
  let component: SystemAdminsViewComponent;
  let fixture: ComponentFixture<SystemAdminsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
