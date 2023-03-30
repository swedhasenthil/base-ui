import { TestBed } from '@angular/core/testing';

import { ManagerService } from './manager.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('ManagerService', () => {
  let service: ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 

    });
    service = TestBed.inject(ManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
