import { TestBed } from '@angular/core/testing';
import { InjectionToken } from "@angular/core"
import { AnalystService } from './analyst.service';

describe('AnalystService', () => {
  let service: AnalystService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ InjectionToken ]});
    service = TestBed.inject(AnalystService);
  
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
