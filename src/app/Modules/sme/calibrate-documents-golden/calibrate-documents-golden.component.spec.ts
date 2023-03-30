import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrateDocumentsGoldenComponent } from './calibrate-documents-golden.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SmeService } from '../sme.service';
import { of } from 'rxjs';


describe('CalibrateDocumentsGoldenComponent', () => {
  let component: CalibrateDocumentsGoldenComponent;
  let fixture: ComponentFixture<CalibrateDocumentsGoldenComponent>;
  let smeServiceSpy: jasmine.SpyObj<SmeService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SmeService', ['getListGoldenDataDocument']);
    await TestBed.configureTestingModule({
      declarations: [ CalibrateDocumentsGoldenComponent ],
      imports: [HttpClientTestingModule], 
      providers: [{ provide: SmeService, useValue: spy }],

    })
    .compileComponents();

    fixture = TestBed.createComponent(CalibrateDocumentsGoldenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    smeServiceSpy = TestBed.inject(SmeService) as jasmine.SpyObj<SmeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined loadUplodDocuments', () => {
    expect(component.loadUplodDocuments).toBeDefined();
  }); 

  it('should be defined uploadDocumentListData', () => {
    expect(component.uploadDocumentListData).toBeDefined();
  }); 

  it('should call loadUplodDocuments() function', () => {
    smeServiceSpy.getListGoldenDataDocument.and.returnValue(of({}));
    component.loadUplodDocuments();
    expect(component.uploadDocumentListData).toBeDefined();
  });

  it('should call getListGoldenDataDocument() function', () => {
    smeServiceSpy.getListGoldenDataDocument.and.returnValue(of({}));
    component.loadUplodDocuments();
    expect(smeServiceSpy.getListGoldenDataDocument).toHaveBeenCalled();
  });

  it('should update the uploadDocumentListData variable', () => {
    const mockData = [{ id: 1, name: 'Document 1' }, { id: 2, name: 'Document 2' }];
    smeServiceSpy.getListGoldenDataDocument.and.returnValue(of(mockData));
    component.loadUplodDocuments();
    expect(component.uploadDocumentListData).toEqual(mockData);
  });

});