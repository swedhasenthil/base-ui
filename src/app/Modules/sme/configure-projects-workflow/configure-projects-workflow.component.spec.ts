import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ConfigureProjectsWorkflowComponent } from './configure-projects-workflow.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConfigureProjectsWorkflowComponent', () => {
  let component: ConfigureProjectsWorkflowComponent;
  let fixture: ComponentFixture<ConfigureProjectsWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureProjectsWorkflowComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureProjectsWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined loadDestinationList', () => {
    expect(component.loadDestinationList).toBeDefined();
  }); 

  it('should be defined loadDocumentType', () => {
    expect(component.loadDocumentType).toBeDefined();
  }); 

  it('should be defined addNewWorkflow', () => {
    expect(component.addNewWorkflow).toBeDefined();
  }); 

  it('should call addNewWorkflow function when submit button clicked', fakeAsync(() => {
    spyOn(component, 'addNewWorkflow');  
    let checkbox = fixture.debugElement.nativeElement.querySelector('.skn-filled-btn');
    checkbox.click();  
    tick();  
    expect(component.addNewWorkflow).toHaveBeenCalled();
  }));

  it('should be defined documentTypeList', () => {
    expect(component.documentTypeList).toBeDefined();
  }); 

  it('should be defined destinationList', () => {
    expect(component.destinationList).toBeDefined();
  }); 
 

});
