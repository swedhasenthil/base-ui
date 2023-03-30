import { TestBed } from '@angular/core/testing';

import { ReportService, SAVER } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InjectionToken } from '@angular/core';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,BrowserModule,HttpClientModule,
                ReactiveFormsModule,
                FormsModule, 
               ], 
      providers:[
        { provide: SAVER, useValue: 'save' } 
      ],   

    });
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
