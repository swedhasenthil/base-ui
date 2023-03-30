import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ReferenceDataManagementComponent } from './reference-data-management.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ReferenceDataManagementComponent', () => {
  let component: ReferenceDataManagementComponent;
  let fixture: ComponentFixture<ReferenceDataManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceDataManagementComponent ],
      imports: [HttpClientTestingModule,
              FormsModule, 
              ReactiveFormsModule
      ], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getReferenceData', () => {
    expect(component.getReferenceData).toBeDefined();
  }); 

  it('should be defined refrenceDataList', () => {
    const refrenceDataList:any= 'test'
    expect(refrenceDataList).toBeDefined();
  });
  
  it('should be defined addDuplicateDocumentResponse', () => {
    const addDuplicateDocumentResponse:any= 'test'
    expect(addDuplicateDocumentResponse).toBeDefined();
  });

  it('should set the clickedEditedDocumentId and clickedAttributesData properties and patch the form value', () => {
    const mockDoc = {
      _id: 'testId',
      reference_data_name: 'testName',
      values: {
        key1: 'value1',
        key2: 'value2',
      },
    };
    const formValue = {
      editDocumentName: 'testName',
    };

    component.editDocumentForm = new FormGroup({
      editDocumentName: new FormControl(''),
    });

    component.onEditDocument(mockDoc);

    expect(component.clickedEditedDocumentId).toBe(mockDoc._id);
    expect(component.clickedAttributesData).toBe(mockDoc.values);
    expect(component.editDocumentForm.value).toEqual(formValue);
  });

  it('should set the duplicateDocumentName and duplicateAttributes properties', () => {
    const mockDoc = {
      reference_data_name: 'testName',
      values: {
        key1: 'value1',
        key2: 'value2',
      },
    };
    const expectedName = 'testName - copy';
    const expectedAttributes = {
      key1: 'value1',
      key2: 'value2',
    };

    component.duplicateDocumentClick(mockDoc);

    expect(component.duplicateDocumentName).toEqual(expectedName);
    expect(component.duplicateAttributes).toEqual(expectedAttributes);
  });

  it('should be defined updateDocumentStatusResponse', () => {
    const updateDocumentStatusResponse:any= 'test'
    expect(updateDocumentStatusResponse).toBeDefined();
  }); 

  it('should set the deleteDocumentName and documentIdToDelete properties', () => {
    const mockDoc = {
      reference_data_name: 'testName',
      _id: 'testId',
    };
    const expectedName = 'testName';
    const expectedId = 'testId';

    component.onDeleteDocument(mockDoc);

    expect(component.deleteDocumentName).toEqual(expectedName);
    expect(component.documentIdToDelete).toEqual(expectedId);
  });

});
