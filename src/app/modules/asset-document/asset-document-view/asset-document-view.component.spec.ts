import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDocumentViewComponent } from './asset-document-view.component';

describe('AssetDocumentViewComponent', () => {
  let component: AssetDocumentViewComponent;
  let fixture: ComponentFixture<AssetDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
