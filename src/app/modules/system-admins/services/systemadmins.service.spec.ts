import { TestBed } from '@angular/core/testing';

import { SystemadminsService } from './systemadmins.service';

describe('SystemadminsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemadminsService = TestBed.get(SystemadminsService);
    expect(service).toBeTruthy();
  });
});
