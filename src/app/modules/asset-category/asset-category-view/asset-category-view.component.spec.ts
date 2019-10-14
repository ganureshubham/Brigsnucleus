import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryViewComponent } from './asset-category-view.component';

describe('AssetCategoryViewComponent', () => {
  let component: AssetCategoryViewComponent;
  let fixture: ComponentFixture<AssetCategoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCategoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
