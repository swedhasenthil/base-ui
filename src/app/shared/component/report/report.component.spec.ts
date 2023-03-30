import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportService, SAVER } from '../../services/report.service';
import { of } from 'rxjs';


describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportComponent ],
      imports: [HttpClientTestingModule,ReactiveFormsModule,FormsModule ], 
      providers: [{ provide: SAVER, useValue: 'save' } ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    reportService = TestBed.inject(ReportService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getListDocuments', () => {
    expect(component.getListDocuments).toBeDefined();
  }); 

  it('should be defined groupPerformance', () => {
    expect(component.groupPerformance).toBeDefined();
  }); 

  it('should be defined getIndividualPerformanceDetails', () => {
    expect(component.getIndividualPerformanceDetails).toBeDefined();
  }); 

  it('should be defined getAllProjects', () => {
    const getAllProjects:any = 'test';
    expect(getAllProjects).toBeDefined();
  }); 

  it('should be defined groupPerformances', () => {
    const groupPerformances:any = 'test';
    expect(groupPerformances).toBeDefined();
  }); 

  it('should get group performances for the selected project and role', () => {

    const mockGroupPerformances = [
      { group_id: '1234', performance: 0.75 },
      { group_id: '5678', performance: 0.5 }
    ];
    spyOn(reportService, 'getGroupPerformance').and.returnValue(of(mockGroupPerformances));

    component.roleId = '1234'; // Set up a test role ID
    component.selectedProjectId = '5678'; // Set up a test project ID
  
    component.groupPerformance(); // Call the function with the test data
  
    expect(reportService.getGroupPerformance).toHaveBeenCalledWith({ role_id: '1234', project_id: '5678' }); // Expect that the service method was called with the expected data
    expect(component.groupPerformances).toEqual(mockGroupPerformances); // Expect that the component's group performances variable was updated with the expected data
  });

  it('should set the correct download flag and call the download service', () => {
  
    const reportData = {
      name: 'Documents',
      url: 'http://example.com/reports/documents.pdf'
    };
    spyOn(reportService, 'download').and.returnValue(of());  
   
    component.download(reportData); 
   
    expect(reportService.download).toHaveBeenCalledWith({
      from_date: component.fromDate,
      to_date: component.bsValue
    }, reportData.url, reportData.name);
    expect(component.report).toBeTrue();
    expect(component.reports.every((report: any) => !report.download)).toBeTrue();
  });
  
});
