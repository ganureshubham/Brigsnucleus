import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAssignNewUsersComponent } from './asset-assign-new-users.component';

describe('AssetAssignNewUsersComponent', () => {
  let component: AssetAssignNewUsersComponent;
  let fixture: ComponentFixture<AssetAssignNewUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetAssignNewUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAssignNewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
