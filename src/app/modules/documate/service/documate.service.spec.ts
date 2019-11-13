import { TestBed } from '@angular/core/testing';

import { DocumateService } from './documate.service';

describe('DocumateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumateService = TestBed.get(DocumateService);
    expect(service).toBeTruthy();
  });
});
