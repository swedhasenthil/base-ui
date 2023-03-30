import { TestBed } from '@angular/core/testing';

import { SmeService } from './sme.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SmeService', () => {
  let service: SmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 

    });
    service = TestBed.inject(SmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
