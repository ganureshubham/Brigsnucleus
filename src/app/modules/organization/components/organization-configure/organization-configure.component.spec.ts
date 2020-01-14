import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationConfigureComponent } from './organization-configure.component';

describe('OrganizationConfigureComponent', () => {
  let component: OrganizationConfigureComponent;
  let fixture: ComponentFixture<OrganizationConfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationConfigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
