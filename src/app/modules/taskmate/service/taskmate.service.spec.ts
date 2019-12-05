import { TestBed } from '@angular/core/testing';

import { TaskmateService } from './taskmate.service';

describe('TaskmateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskmateService = TestBed.get(TaskmateService);
    expect(service).toBeTruthy();
  });
});
