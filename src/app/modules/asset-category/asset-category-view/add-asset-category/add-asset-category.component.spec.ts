import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetCategoryComponent } from './add-asset-category.component';

describe('AddAssetCategoryComponent', () => {
  let component: AddAssetCategoryComponent;
  let fixture: ComponentFixture<AddAssetCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssetCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
