import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetDocumentComponent } from './add-asset-document.component';

describe('AddAssetDocumentComponent', () => {
  let component: AddAssetDocumentComponent;
  let fixture: ComponentFixture<AddAssetDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssetDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
