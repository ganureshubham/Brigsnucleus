import { TestBed } from '@angular/core/testing';

import { VerifyAssetService } from './verify-asset.service';

describe('VerifyAssetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerifyAssetService = TestBed.get(VerifyAssetService);
    expect(service).toBeTruthy();
  });
});
