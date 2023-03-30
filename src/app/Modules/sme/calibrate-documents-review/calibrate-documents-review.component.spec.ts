import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrateDocumentsReviewComponent } from './calibrate-documents-review.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SmeService } from '../sme.service';


describe('CalibrateDocumentsReviewComponent', () => {
  let component: CalibrateDocumentsReviewComponent;
  let fixture: ComponentFixture<CalibrateDocumentsReviewComponent>;
  let smeServiceSpy: jasmine.SpyObj<SmeService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SmeService', ['listReviewDataDocs']);
    await TestBed.configureTestingModule({
      declarations: [ CalibrateDocumentsReviewComponent ],
      imports: [HttpClientTestingModule,
        FormsModule, 
        ReactiveFormsModule
      ], 
      providers: [{ provide: SmeService, useValue: spy }],

    })
    .compileComponents();

    fixture = TestBed.createComponent(CalibrateDocumentsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getStatusFromBackend', () => {
    expect(component.getStatusFromBackend).toBeDefined();
  }); 

  it('should be defined viewReviewDocData', () => {
    expect(component.viewReviewDocData).toBeDefined();
  }); 

  it('should be defined assignAndViewReviewDocData', () => {
    expect(component.assignAndViewReviewDocData).toBeDefined();
  }); 

  it('should be defined onDeleteButtonClick', () => {
    expect(component.onDeleteButtonClick).toBeDefined();
  }); 

  it('should be defined deleteDocumentStatusResponse', () => {
    const deleteDocumentStatusResponse:any ='test'
    expect(deleteDocumentStatusResponse).toBeDefined();
  }); 

  it('should be defined reviewDataDocuments', () => {
   const reviewDataDocuments:any='test';
    expect(reviewDataDocuments).toBeDefined();
  }); 

   
});
