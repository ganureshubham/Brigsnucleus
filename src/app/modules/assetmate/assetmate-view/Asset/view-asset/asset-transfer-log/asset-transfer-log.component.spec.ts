import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferLogComponent } from './asset-transfer-log.component';

describe('AssetTransferLogComponent', () => {
  let component: AssetTransferLogComponent;
  let fixture: ComponentFixture<AssetTransferLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
