import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetDocumentComponent } from './view-asset-document.component';

describe('ViewAssetDocumentComponent', () => {
  let component: ViewAssetDocumentComponent;
  let fixture: ComponentFixture<ViewAssetDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssetDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssetDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
