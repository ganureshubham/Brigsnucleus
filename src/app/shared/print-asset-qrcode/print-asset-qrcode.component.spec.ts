import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAssetQrcodeComponent } from './print-asset-qrcode.component';

describe('PrintAssetQrcodeComponent', () => {
  let component: PrintAssetQrcodeComponent;
  let fixture: ComponentFixture<PrintAssetQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAssetQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAssetQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
