import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowComponent } from './work-flow.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('WorkFlowComponent', () => {
  let component: WorkFlowComponent;
  let fixture: ComponentFixture<WorkFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowComponent);
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

  it('should be defined getWorkflowConfigurationsOfThisProject', () => {
    expect(component.getWorkflowConfigurationsOfThisProject).toBeDefined();
  }); 

  it('should be defined getDropdownWorkflowList', () => {
    expect(component.getDropdownWorkflowList).toBeDefined();
  }); 

  it('should be defined dropdownLists', () => {
    const dropdownLists:any='test'
    expect(dropdownLists).toBeDefined();
  }); 

  it('should be defined destinationList', () => {
    const destinationList:any='test'
    expect(destinationList).toBeDefined();
  }); 

  it('should be defined listWorkflowConfigData', () => {
    const listWorkflowConfigData:any='test'
    expect(listWorkflowConfigData).toBeDefined();
  });

  it('should delete the workflow configuration document and display success message', () => {
    // Mock the service response
    const mockData = { workflowConfigData: 'Mock Data' };
    spyOn(component.toastr, 'add');
    spyOn(component.smeService, 'deleteWorkflowConfigDocument').and.returnValue(of(mockData));
    spyOn(component, 'getWorkflowConfigurationsOfThisProject');
    spyOn(component.deleteModel.nativeElement, 'click');
  
    // Call the function
    component.onDeleteButtonClick();
  
    // Check if the service method is called with the correct arguments
    expect(component.smeService.deleteWorkflowConfigDocument).toHaveBeenCalledWith(component.project_id, component.workflow_configuration_id);
  
    // Check if the workflow configuration data is updated
    expect(component.listWorkflowConfigData).toEqual(mockData);
  
    // Check if the success message is displayed
    expect(component.toastr.add).toHaveBeenCalledWith({
      type: 'success',
      message: 'Workflow deleted successfully'
    });
  
    // Check if the necessary methods are called
    expect(component.getWorkflowConfigurationsOfThisProject).toHaveBeenCalled();
    expect(component.deleteModel.nativeElement.click).toHaveBeenCalled();
  });

  it('should show an error message if the workflow configuration document cannot be deleted', () => {
    // Mock the service response
    spyOn(component.toastr, 'add');
    spyOn(component.smeService, 'deleteWorkflowConfigDocument').and.returnValue(throwError({}));
  
    // Call the function
    component.onDeleteButtonClick();
  
    // Check if the error message is displayed
    expect(component.toastr.add).toHaveBeenCalledWith({
      type: 'error',
      message: 'Document type cannot be deleted'
    });
  });


});
