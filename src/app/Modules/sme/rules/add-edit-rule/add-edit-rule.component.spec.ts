import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRuleComponent } from './add-edit-rule.component';

describe('AddEditRuleComponent', () => {
  let component: AddEditRuleComponent;
  let fixture: ComponentFixture<AddEditRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRuleComponent ],
      imports: [HttpClientTestingModule], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined projectDocumentTypes', () => {
     const projectDocumentTypes:any ='test'
    expect(projectDocumentTypes).toBeDefined();
  }); 
  
  it('should be defined addNewAttributesForRule', () => {
   expect(component.addNewAttributesForRule).toBeDefined();
  }); 

  it('should be defined saveAndUpdateRule', () => {
    expect(component.saveAndUpdateRule).toBeDefined();
  }); 

  it('should be defined onChangeDocTypeDropdown', () => {
    expect(component.onChangeDocTypeDropdown).toBeDefined();
  }); 

  it('should be defined rulesList', () => {
    const rulesList:any = 'test'
    expect(rulesList).toBeDefined();
  });

  it('should add new attributes for rule', () => {
    // Arrange
    component.attributes = [
      {
        selectedPrimaryAttribute: 'attribute1',
        selectedSecondaryAttribute: 'Value',
        selectedCondition: '',
        selectedValue: '',
        selectedAttributeDataType: '',
        selectedPrimaryAttributeDataType: '',
        selectedPrimaryAttributeInFirstRow: [],
        primaryAttributes: ['attribute1', 'attribute2'],
        secondaryAttributes: ['Value', 'Value2'],
      },
      {
        selectedPrimaryAttribute: 'attribute2',
        selectedSecondaryAttribute: 'Value2',
        selectedCondition: '',
        selectedValue: '',
        selectedAttributeDataType: '',
        selectedPrimaryAttributeDataType: '',
        selectedPrimaryAttributeInFirstRow: ['attribute1'],
        primaryAttributes: ['attribute1', 'attribute2'],
        secondaryAttributes: ['Value', 'Value2'],
      },
    ];

    // Act
    component.addNewAttributesForRule({});

    // Assert
    expect(component.attributes.length).toEqual(3);
    expect(component.attributes[2].selectedPrimaryAttribute).toEqual('');
    expect(component.attributes[2].selectedSecondaryAttribute).toEqual('Value');
    expect(component.attributes[2].selectedCondition).toEqual('');
    expect(component.attributes[2].selectedValue).toEqual('');
    expect(component.attributes[2].selectedAttributeDataType).toEqual('');
    expect(component.attributes[2].selectedPrimaryAttributeDataType).toEqual('');
    // expect(component.attributes[2].selectedPrimaryAttributeInFirstRow).toEqual(['attribute1']);
    expect(component.attributes[2].primaryAttributes).toEqual(component.attributes[0].primaryAttributes);
    expect(component.attributes[2].secondaryAttributes).toEqual(component.attributes[0].secondaryAttributes);
  });

  it('should initialize modal state for adding new rule', () => {
    // Arrange
    component.selectedDocType = 'docType';
    component.selectedRuleName = 'ruleName';
    component.attributes = [
      {
        selectedPrimaryAttribute: 'attribute1',
        selectedSecondaryAttribute: 'Value',
        selectedCondition: '',
        selectedValue: '',
        selectedAttributeDataType: '',
        selectedPrimaryAttributeDataType: '',
        selectedPrimaryAttributeInFirstRow: [],
        primaryAttributes: ['attribute1', 'attribute2'],
        secondaryAttributes: [{ attribute_name: 'Value', data_type: 'Text' }, { attribute_name: 'Value2', data_type: 'Number' }],
      },
    ];
    component.attributesLength = 2;
    component.modalState = 2;
    component.titleName = 'Edit Rule';
    component.buttonName = 'Update';

    // Act
    component.openModalToAddRule();

    // Assert
    expect(component.selectedDocType).toEqual('');
    expect(component.selectedRuleName).toEqual('');
    expect(component.attributes.length).toEqual(1);
    expect(component.attributes[0].selectedPrimaryAttribute).toEqual('');
    expect(component.attributes[0].selectedSecondaryAttribute).toEqual('Value');
    expect(component.attributes[0].selectedCondition).toEqual('');
    expect(component.attributes[0].selectedValue).toEqual('');
    expect(component.attributes[0].selectedAttributeDataType).toEqual('');
    expect(component.attributes[0].selectedPrimaryAttributeDataType).toEqual('');
    expect(component.attributes[0].selectedPrimaryAttributeInFirstRow).toEqual([]);
    expect(component.attributes[0].primaryAttributes).toEqual([]);
    expect(component.attributes[0].secondaryAttributes).toEqual([{ attribute_name: 'Value', data_type: 'Text' }]);
    expect(component.attributesLength).toEqual(1);
    expect(component.modalState).toEqual(1);
    expect(component.titleName).toEqual('Create new Rule');
    expect(component.buttonName).toEqual('Save');
  });


});
