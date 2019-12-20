import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAssetListComponent } from './verify-asset-list.component';

describe('VerifyAssetListComponent', () => {
  let component: VerifyAssetListComponent;
  let fixture: ComponentFixture<VerifyAssetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyAssetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
