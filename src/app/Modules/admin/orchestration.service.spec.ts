import { TestBed } from '@angular/core/testing';

import { OrchestrationService } from './orchestration.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('OrchestrationService', () => {
  let service: OrchestrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 

    });
    service = TestBed.inject(OrchestrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
