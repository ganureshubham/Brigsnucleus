import { TestBed } from '@angular/core/testing';

import { CronLogService } from './cron-log.service';

describe('CronLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CronLogService = TestBed.get(CronLogService);
    expect(service).toBeTruthy();
  });
});
