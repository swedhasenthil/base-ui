import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsComponent } from './reports.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Chart } from 'highcharts';
import { of } from 'rxjs';
import { ManagerService } from '../manager.service';
import { SharedService } from 'src/app/shared/shared.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let apiService: ManagerService;
  let chartSpy: jasmine.SpyObj<Chart>; 

  beforeEach(async () => {

    chartSpy = jasmine.createSpyObj('Chart', ['constructor']);
    await TestBed.configureTestingModule({
      declarations: [ ReportsComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
        ManagerService,
        { provide: Chart, useValue: chartSpy },
       ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pie chart on init', () => {
    const filters = {
      project_id: [component.selectedprojectId],
      from_upload_date: component.fromDate,
      to_upload_date: component.toDate,
      type: 'pie',
    };
    const mockResult = {};
    const apiServiceSpy = spyOn(apiService, 'reasonsToReject').and.returnValue(of(mockResult));

    component.loadPieChart();

    expect(apiServiceSpy).toHaveBeenCalledWith(filters);
  }); 

  it('should load a pie chart with reasons to reject', () => {
    const mockFilters = {
      project_id: [1],
      from_upload_date: '2022-01-01',
      to_upload_date: '2022-01-31',
      type: 'pie',
    };
    const mockResult = {
      labels: ['Reason 1', 'Reason 2', 'Reason 3'],
      datasets: [{
        data: [10, 20, 30],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };
    spyOn(apiService, 'reasonsToReject').and.returnValue(of(mockResult));
    component.selectedprojectId = 1;
    component.fromDate = new Date();
    component.toDate = '2022-01-31';
    component.loadPieChart();
    expect(component.reasonsToRejectChart).toBeDefined();
  });
  
  it('should call managerMenuChanges on ngOnInit and render correctly', () => {
    const sharedService = TestBed.inject(SharedService);
    spyOn(sharedService, 'managerMenuChanges');
    
    component.ngOnInit();

    expect(sharedService.managerMenuChanges).toHaveBeenCalled();
  });


});
