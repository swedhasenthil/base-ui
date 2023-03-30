import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeInputTypesComponent } from './attribute-input-types.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthService } from 'src/app/core/auth.service';
import { of, throwError } from 'rxjs';
import { ScrollService } from 'src/app/shared/services/scroll.service';


describe('AttributeInputTypesComponent', () => {
  let component: AttributeInputTypesComponent;
  let fixture: ComponentFixture<AttributeInputTypesComponent>;
  let service: CommonService;
  let scrollService: ScrollService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['isNotAuthenticated', 'clearCookiesAndRedirectToLogin']);
    await TestBed.configureTestingModule({
      declarations: [ AttributeInputTypesComponent ],
      imports: [HttpClientTestingModule], 
      providers:[CommonService,
        { provide: AuthService, useValue: spy }
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeInputTypesComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(CommonService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    scrollService = TestBed.inject(ScrollService);
    fixture.detectChanges();
  }); 
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should be defined inputTypeChecker', () => {
    expect(component.inputTypeChecker).toBeDefined();
  }); 

  it('should be defined categoryAttribute', () => {
    expect(component.categoryAttribute).toBeDefined();
  });  

  it('should be defined animate', () => {
    expect(component.animate).toBeDefined();
  }); 

  it('should be defined updateAttributeValue', () => {
    expect(component.updateAttributeValue).toBeDefined();
  }); 

  it('should be defined validateInputField', () => {
    expect(component.validateInputField).toBeDefined();
  });
  
  it('should be defined categoryAttribute', () => {
    expect(component.categoryAttribute).toBeDefined();
  }); 

  it('should be defined editableIndexSubscription', () => {
    expect(component.editableIndexSubscription).toBeDefined();
  }); 

  it('should be defined editSubscription', () => {
    expect(component.editSubscription).toBeDefined();
  }); 

  it('should be defined documentSubscription', () => {
    expect(component.documentSubscription).toBeDefined();
  }); 

  it('should be defined ImageIndexSubscription', () => {
    expect(component.ImageIndexSubscription).toBeDefined();
  });   
  
  it('should highlight row', () => {
    const index = 1;
    component.editableIndex = 2;
    component.attributeIndex = 1;   
    expect(component.editableIndex).toBe(2);   
  });
 
  it('should validate document and update attributes', () => {
    const payload = {
      details: [
        {
          category_details: [
            {
              value: 'some value',
              has_error: false
            }
          ],
          editedByAnalyst: false,
          edited: false,
          has_error: false
        }
      ],
      document_id: 1234
    };

    spyOn(service, 'validDocument').and.returnValue(of([
      { has_error: false }
    ]));

    spyOn(service, 'enableSubmitButton');

    service.validDocument(payload.details);

    expect(payload.details[0].has_error).toBe(false);
    expect(authServiceSpy.isNotAuthenticated).not.toHaveBeenCalled();
    expect(authServiceSpy.clearCookiesAndRedirectToLogin).not.toHaveBeenCalled();
  });

  it('should handle error when validating document', () => {
    const payload = {
      details: [
        {
          category_details: [
            {
              value: 'some value',
              has_error: false
            }
          ],
          editedByAnalyst: false,
          edited: false,
          has_error: false
        }
      ],
      document_id: 1234
    };

    spyOn(service, 'validDocument').and.returnValue(
      throwError({ status: 401 })
    );
    spyOn(service, 'enableSubmitButton');

    service.validDocument(payload.details);

    expect(payload.details[0].has_error).toBe(false);
    expect(service.enableSubmitButton).not.toHaveBeenCalled();
  }); 

  it('should clear all previous boundary box when page number is not provided', () => {
    spyOn(service, 'clearBoundIngBox');

    component.animate(0, null, {});

    expect(service.clearBoundIngBox).toHaveBeenCalledWith('hide');
  }); 

  it('should not update dataLocation and dataPage when pageNo is 0', () => {
    const index = 1;
    const pageNo = 0;
   spyOn(localStorage, 'setItem');
    component.updatedDocumentAttributes = [{ category_details: [{ location: '0,0,0,0,0,0,0,0' }, { page_no: 3 }] }, {}];
  
    component.dataLocation = '';
    component.dataPage = '';
    component.animate(index, pageNo, {});

    expect(component.dataLocation).toEqual('');
    expect(component.dataPage).toEqual(''); 
  });

  it('should set the correct input type flags', () => {
    component.attributeCategoryDetails = {
      isDate: true,
      isAmount: false,
      dropdownlists: false,
      radioLists: false
    };
  
    component.inputTypeChecker();
  
    expect(component.isInputDate).toBeTrue();
    expect(component.isInputAmount).toBeFalse();
    expect(component.isInputDropdownlists).toBeFalse();
    expect(component.isInputRadioLists).toBeFalse();
    expect(component.isInputTextarea).toBeFalse();
  
    component.attributeCategoryDetails = {
      isDate: false,
      isAmount: true,
      dropdownlists: false,
      radioLists: false
    };
  
    component.inputTypeChecker();
  
    expect(component.isInputAmount).toBeTrue();
    expect(component.isInputDropdownlists).toBeFalse();
    expect(component.isInputRadioLists).toBeFalse();
    expect(component.isInputTextarea).toBeFalse();
  
    component.attributeCategoryDetails = {
      isDate: false,
      isAmount: false,
      dropdownlists: true,
      radioLists: false
    };
  
    component.inputTypeChecker();  

    expect(component.isInputDropdownlists).toBeTrue();
    expect(component.isInputRadioLists).toBeFalse();
    expect(component.isInputTextarea).toBeFalse();
  
    component.attributeCategoryDetails = {
      isDate: false,
      isAmount: false,
      dropdownlists: false,
      radioLists: true
    };
  
    component.inputTypeChecker(); 

    expect(component.isInputRadioLists).toBeTrue();
    expect(component.isInputTextarea).toBeFalse();
  
    component.attributeCategoryDetails = {
      isDate: false,
      isAmount: false,
      dropdownlists: false,
      radioLists: false
    };
  
    component.inputTypeChecker(); 

    expect(component.isInputTextarea).toBeTrue();
  });


});
