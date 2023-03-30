import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SmeService } from '../../sme.service';

import { AddNewAndEditDocumentComponent } from './add-new-and-edit-document.component';

describe('AddNewAndEditDocumentComponent', () => {
  let component: AddNewAndEditDocumentComponent;
  let fixture: ComponentFixture<AddNewAndEditDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAndEditDocumentComponent ],
      imports: [HttpClientTestingModule], 
      providers:[SmeService,]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewAndEditDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined loadModelApi', () => {
    expect(component.loadModelApi).toBeDefined();
  }); 

  it('should be defined getReferenceData', () => {
   expect(component.getReferenceData).toBeDefined();
  });
  
  it('should be defined onDeleteDocument', () => {
   expect(component.onDeleteDocument).toBeDefined();
  }); 

  it('should be defined onDataTypeChange', () => {
    expect(component.onDataTypeChange).toBeDefined();
  }); 

   it('should load model API data', () => {
    const modelApiData = [    {      modelApi: {        name: 'API 1'      }    },    {      modelApi: {        name: 'API 2'      }    }  ];
    spyOn(component.smeService, 'getListOfModelApi').and.returnValue(of(modelApiData));
    component.loadModelApi();
    expect(component.modelApiData).toEqual(modelApiData);
    expect(component.selectedModelApis).toEqual('API 1');
  });

  it('should get reference data and set refrenceDataList property', () => {
    const referenceData = [{ id: 1, name: 'Reference 1' }, { id: 2, name: 'Reference 2' }];
    spyOn(component.smeService, 'getReferenceData').and.returnValue(of(referenceData));
    component.getReferenceData();
    expect(component.refrenceDataList).toEqual(referenceData);
  });

  it('should enable or disable select element based on selected data type', () => {
    // Arrange
    const index = 0;
    const seletedDataType = 'Reference Data';
    const inputElement = document.createElement('input');
    inputElement.id = `select_${index}`;
    document.body.appendChild(inputElement);
    spyOn(document, 'getElementById').and.returnValue(inputElement);
  
    const attribute = {
      attribute_name: 'Name',
      data_type: 'Reference Data',
      reference_data_id: 123,
    };
  
    component.addDocumentForm.attributesArray[index] = attribute;
  
    // Act
    component.onDataTypeChange(seletedDataType, index);
  
    // Assert
    expect(inputElement.disabled).toBe(false);
    expect(component.addDocumentForm.attributesArray[index].reference_data_id).toBe(123);
  
    // Cleanup
    document.body.removeChild(inputElement);
  });

  

});
