import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsStatusFilterComponent } from './documents-status-filter.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DocumentsStatusFilterComponent', () => {
  let component: DocumentsStatusFilterComponent;
  let fixture: ComponentFixture<DocumentsStatusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsStatusFilterComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have defined selectDocumentStatus', () => {
    expect(component.selectDocumentStatus).toBeDefined();
  });  

  it('should select a different option', () => {
    component.selectDocumentStatus('In Progress');
    expect(component.selectDocumentStatus).toBeDefined( );   
  });
 

  it('should update the selectedStatus property, emit the selected status, and call the setStatus() method', () => {
    const mockDocuemntStatus = { name: 'Mock Status' };
    spyOn(component.sharedService, 'setStatus').and.stub();
    spyOn(component.selectedDocumentStatus, 'emit').and.stub();
  
    component.selectDocumentStatus(mockDocuemntStatus);
  
    expect(component.selectedStatus).toBe('Mock Status');
    expect(component.selectedDocumentStatus.emit).toHaveBeenCalledWith('Mock Status');
    expect(component.sharedService.setStatus).toHaveBeenCalledWith(mockDocuemntStatus);
  });  

});
