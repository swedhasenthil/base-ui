import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CalibrateDocumentsTrainingComponent } from './calibrate-documents-training.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';


describe('CalibrateDocumentsTrainingComponent', () => {
  let component: CalibrateDocumentsTrainingComponent;
  let fixture: ComponentFixture<CalibrateDocumentsTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalibrateDocumentsTrainingComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(CalibrateDocumentsTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
  
  it('should be defined uploadDocumentListData', () => {
    const deleteDocumentStatusResponse:any= 'test';
    expect(deleteDocumentStatusResponse).toBeDefined();
  }); 

  it('should call onDeleteButtonClick when delete confirm button clicked', fakeAsync(() => {
    spyOn(component, 'onDeleteButtonClick');  
    let button = fixture.debugElement.nativeElement.querySelector('.skn-filled-btn');
    button.click();  
    tick();  
    expect(component.onDeleteButtonClick).toHaveBeenCalled();
  }));


});
