import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAssignUserComponent } from './asset-assign-user.component';

describe('AssetAssignUserComponent', () => {
  let component: AssetAssignUserComponent;
  let fixture: ComponentFixture<AssetAssignUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetAssignUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAssignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
