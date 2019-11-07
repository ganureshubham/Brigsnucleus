import { TestBed } from '@angular/core/testing';

import { AssetmateService } from './assetmate.service';

describe('AssetmateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetmateService = TestBed.get(AssetmateService);
    expect(service).toBeTruthy();
  });
});
