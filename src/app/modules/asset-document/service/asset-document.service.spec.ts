import { TestBed } from '@angular/core/testing';

import { AssetDocumentService } from './asset-document.service';

describe('AssetDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetDocumentService = TestBed.get(AssetDocumentService);
    expect(service).toBeTruthy();
  });
});
