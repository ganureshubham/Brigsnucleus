import { TestBed } from '@angular/core/testing';

import { AssetCategoryService } from './asset-category.service';

describe('AssetCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetCategoryService = TestBed.get(AssetCategoryService);
    expect(service).toBeTruthy();
  });
});
