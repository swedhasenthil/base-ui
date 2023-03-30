import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrateDocumentsComponent } from './calibrate-documents.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SmeService } from '../sme.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';


describe('CalibrateDocumentsComponent', () => {
  let component: CalibrateDocumentsComponent;
  let fixture: ComponentFixture<CalibrateDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalibrateDocumentsComponent ],
      imports: [HttpClientTestingModule], 
      providers: [ SmeService, ToastrService ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(CalibrateDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should be defined loadDocuments', () => {
  expect(component.loadDocuments).toBeDefined();
  }); 

  it('should be defined calibrateDocumentsList', () => {
  expect(component.calibrateDocumentsList).toBeDefined();
  }); 

  it('should set model attributes based on selected model API', () => {
    const modelApiData = [    
      {    
        _id: 'api1',  
        attributes: ['attribute1', 'attribute2']
      },
      {
        _id: 'api2',
        attributes: ['attribute3', 'attribute4']
      }
    ];
    component.modelApiData = modelApiData;
    component.setModalAtribute('api1');
    expect(component.modelApiAttributeList).toEqual(['attribute1', 'attribute2']);
  });

  it('should set addDocumentForm and other attributes when btnEdit() is called', () => {
    const document = {
      _id: '123',
      document_type: 'Test Document',
      versioned_model_api: {
        _id: '456',
      },
      attributes: [
        { attribute_name: 'attribute1' },
        { attribute_name: 'attribute2' },
      ],
    };
  
    component.btnEdit(document);
  
    expect(component.isEdit).toBe(false);
    expect(component.updateButton).toBe(true);
    expect(component.header).toBe('Edit Document Type');
    expect(component.addDocumentForm.documentName).toBe('Test Document');
    expect(component.addDocumentForm.modelApi).toBe('456');
    expect(component.addDocumentForm.attributesArray.length).toBe(2);
    expect(component.addDocumentForm.attributesArray[0].attribute_name).toBe('attribute1');
    expect(component.addDocumentForm.attributesArray[1].attribute_name).toBe('attribute2');
  });
  
});
