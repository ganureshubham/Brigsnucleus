import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAssetComponent } from './details-asset.component';

describe('DetailsAssetComponent', () => {
  let component: DetailsAssetComponent;
  let fixture: ComponentFixture<DetailsAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
