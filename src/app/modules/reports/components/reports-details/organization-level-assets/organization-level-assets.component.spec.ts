import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLevelAssetsComponent } from './organization-level-assets.component';

describe('OrganizationLevelAssetsComponent', () => {
  let component: OrganizationLevelAssetsComponent;
  let fixture: ComponentFixture<OrganizationLevelAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationLevelAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationLevelAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
