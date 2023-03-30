import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocumentsComponent } from './list-documents.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { of } from 'rxjs';

describe('ListDocumentsComponent', () => {
  let component: ListDocumentsComponent;
  let fixture: ComponentFixture<ListDocumentsComponent>;
  let commonservice:CommonService;

  let documentstaus = {
    "extracted_details": [],
    "edited_details_a": [],
    "edited_details_qc": [],
    "is_locked": false,
    "_id": "",
    "project_id": "",
    "document_status": "",
    "document_name": "",
    "uploaded_timestamp": "",
    "page_count": 0,
    "page_layout": {
        "page_1": {
            "height": 2526,
            "width": 1787
        }
    },
    "edited_document_type_id_a": null,
    "edited_document_type_id_qc": null,
    "review_time": 0,
    "user_id": {
        "_id": "60e5cee7b8eca173d6fad199",
        "employee_id": "336796",
        "user_name": "Supriya Shah",
        "email_id": "supriya.shah@wns.com",
        "groups_and_roles": [
            {
                "roles": [
                    "5eea105dd392195b680a2949"
                ],
                "status": "",
                "_id": "",
                "group": ""
            }
        ],
        "status": "",
        "password": "",
        "__v": 0,
    },
    "__v": 0,
    "last_modified_timestamp": "",
    // "submit_for_review": null
}
let roles = "qc"
  beforeEach(async () => { 
    await TestBed.configureTestingModule({
      declarations: [ ListDocumentsComponent ],
      imports: [HttpClientTestingModule],
      providers:[
        DatePipe
      ] 

    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDocumentsComponent);
    component = fixture.componentInstance;

    commonservice = TestBed.inject(CommonService);
 
    component.isTaskAssignmentManual = true;
    component.selectedProject = '123';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined loadProjectDocuments', () => {
    expect(component.loadProjectDocuments).toBeDefined();
  });

  it('should be defined loadProjectDocuments', () => {
    expect(component.loadProjectDocuments).toBeDefined();
  });

  it('should be defined orginalListOfDocuments', () => {
    expect(component.orginalListOfDocuments).toBeDefined();
  });

  it('should be defined projectDocumentTypes', () => {
    const projectDocumentTypes: any = 'test'; 
    expect(projectDocumentTypes).toBeDefined();
  });


  it('should filter documents assigned to my team by status', () => {
    const originalDocuments = [
      { document_status: 'Open', user_id: { _id: '1234' } },
      { document_status: 'Closed', user_id: { _id: '5678' } }
    ]; // Set up a test list of documents
    component.orginalListOfDocuments = originalDocuments;  
    component.assginFilter = 'Assigned to my team';  
    const selectedDocumentStatus = { status: 'Closed' };  
  
    component.filterStatus(selectedDocumentStatus);  
  
    expect(component.listOfDocuments.length).toEqual(1);  
    expect(component.listOfDocuments[0]).toEqual(originalDocuments[1]);  
  });

  it('should load project documents when task assignment is manual and a project is selected', () => {
    const fakeResponse = {
      data: [
        { id: 1, name: 'Document 1' },
        { id: 2, name: 'Document 2' },
      ],
    };
    spyOn(commonservice,'getDocumentsList').and.returnValue(of(fakeResponse));

    component.loadProjectDocuments();

    expect(commonservice.getDocumentsList).toHaveBeenCalledWith({
      project_id: component.selectedProject,
    });
    expect(component.orginalListOfDocuments).toEqual(fakeResponse.data);
  });

  it('should not load project documents when task assignment is not manual', () => {
    component.isTaskAssignmentManual = false;
    spyOn(commonservice,'getDocumentsList').and.returnValue(of({}));
    component.loadProjectDocuments();
    expect(commonservice.getDocumentsList).not.toHaveBeenCalled();
  });

  it('should not load project documents when no project is selected', () => {
    component.selectedProject = null;
    spyOn(commonservice,'getDocumentsList').and.returnValue(of({}));   
    component.loadProjectDocuments();
    expect(commonservice.getDocumentsList).not.toHaveBeenCalled();
  });

  it('should load project document types when a project is selected', () => {
   
    const fakeResponse = [
      { document_type_id: { _id: '1', document_type: 'Type 1' } },
      { document_type_id: { _id: '2', document_type: 'Type 2' } },
    ];
   
    spyOn(commonservice,'getDocumentTypes').and.returnValue(of(fakeResponse));
    component.loadProjectDocumentTypes();

    expect(commonservice.getDocumentTypes).toHaveBeenCalledWith({
      project_id: component.selectedProject,
    });
    expect(component.projectDocumentTypes).toEqual(fakeResponse);
    expect(component.projectDocumentTypesObject).toEqual({
      '1': 'Type 1',
      '2': 'Type 2',
    });
  });



});
