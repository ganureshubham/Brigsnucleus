import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingMaintainanceAssetsComponent } from './pending-maintainance-assets.component';

describe('PendingMaintainanceAssetsComponent', () => {
  let component: PendingMaintainanceAssetsComponent;
  let fixture: ComponentFixture<PendingMaintainanceAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingMaintainanceAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingMaintainanceAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
