import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAddEditComponent } from './organization-add-edit.component';

describe('OrganizationAddEditComponent', () => {
  let component: OrganizationAddEditComponent;
  let fixture: ComponentFixture<OrganizationAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
