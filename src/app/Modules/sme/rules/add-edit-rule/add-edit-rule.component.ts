import { getLocaleExtraDayPeriodRules } from '@angular/common';
import {Component,ElementRef,OnInit,Output,QueryList,ViewChild,ViewChildren} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from '../../../../core/toaster/toaster.service';
import { Subject, Subscription } from 'rxjs';
import { SmeService } from '../../sme.service';
import { SharedService } from 'src/app/shared/shared.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-add-edit-rule',
  templateUrl: './add-edit-rule.component.html',
  styleUrls: ['./add-edit-rule.component.scss']
})
export class AddEditRuleComponent implements OnInit {
  [x: string]: any;
  projectType_id: any;
  rulesList: any = [];
  conditions = ['<', '>', '<=', '>=', '=='];
  documentTypeList: any = [];
  addRule: any = {
    documentType: '',
    ruleName: '',
    primaryAttribute: '',
    condition: '',
    secondaryAtribute: '',
    value: '',
    id: null,
  };
  attributes: any = [
    {
      selectedPrimaryAttribute: '',
      selectedSecondaryAttribute: '',
      selectedCondition: '',
      selectedValue: '',
      selectedAttributeDataType: '',
      selectedPrimaryAttributeDataType: '',
      selectedPrimaryAttributeInFirstRow: [],
      primaryAttributes: [],
      secondaryAttributes: [{ attribute_name: 'Value', data_type: 'Text' }],
    },
  ];
  ruleDocumentData1: any;
  selectedProjectName: any;
  attributesLength: any;
  selectedAdd: string;
  selectedName: any;
  modalState: number;
  projectDocumentTypes: any;
  selectedDocType: any;
  subcriptionRules: Subscription;
  constructor(
    private smeService: SmeService,
    private toastr: ToasterService,
    private router: Router,
    private sharedService: SharedService
  ) {


  }
  ngOnInit(): void {
    this.sharedService.smeMenuChanges();
    this.subcriptionRules = this.smeService.addEditRuleSubject.subscribe((param) => {
      if (param.action == 'Add') {
        this.openModalToAddRule();
      }
      if (param.action == 'Edit') {
        this.openModalToEditRule(param.editRuleData)
      }
      if (param.action == 'Save') {
        this.saveAndUpdateRule();
      }
    });
    if (this.smeService.metaDataConfigureDoc) {
      this.projectType_id = this.smeService.metaDataConfigureDoc?.docType_id;
    } else {
      this.router.navigate(['sme/configure']);
    }
    this.projectType_id = localStorage.getItem("docTypeId")
    this.selectedProjectName = localStorage.getItem("configerProjectName")
    if (this.smeService.projectDetails) {
      
      this.selectedProjectName =
        this.smeService.projectDetails.projectDetails['projectName'];
    }
    if (this.projectType_id) {
      //get document-type dropdown data
      this.smeService.getDocTypeUnderProject(this.projectType_id).subscribe(
        (data) => {
          if (data) {
            this.projectDocumentTypes = data;
            //filling out doc-type dropdown inside modal !
            for (let i of this.projectDocumentTypes) {
              this.documentType.push(i.document_type_id['document_type']);
            }
          }
        },
        (error) => {
          this.toastr.add({
            type: 'error',
            message: error?.error?.message || 'Could not process the request',
          });
        }
      );
    }
  }

  selectedPrimaryAttributeDataType: any;
  lastSelectedPA: any;
/**
@desc on change Primary attribute
 */
  onChangePrimateAttributeDropdown(e: any, obj: any) {
    for (let i of obj.primaryAttributes) {
      if (i.attribute_name == e.target.value) {
        obj.selectedAttributeDataType = i.data_type;
      }
    }
    obj.selectedPrimaryAttributeDataType = obj.selectedAttributeDataType;
  }
/**
@desc on change secondary attribute
 */
  onChangeSecondaryAttributeDropdown(e: any, obj: any) {
    if (e != 'Value') {
      obj.selectedValue = '';
    }
  }
/**
@desc add new Rule
 */
  addNewAttributesForRule(obj: any) {
    let disabledAttributesForLastRow = [];
    for (let i of this.attributes) {
      disabledAttributesForLastRow.push(i.selectedPrimaryAttribute);
    }

    this.attributes.push({
      selectedPrimaryAttribute: '',
      selectedSecondaryAttribute: 'Value',
      selectedCondition: '',
      selectedValue: '',
      selectedAttributeDataType: '',
      selectedPrimaryAttributeDataType: '',
      selectedPrimaryAttributeInFirstRow: disabledAttributesForLastRow,
      primaryAttributes: this.attributes[0].primaryAttributes,
      secondaryAttributes: this.attributes[0].secondaryAttributes,
    });

    this.attributesLength = this.attributes.length;
  }

  /**
   * @description To remove the added rule
   * @param attrIndex 
   * @returns true
   */
  removeAttributeRow(attrIndex: any) {
    if (this.attributesLength == 1) {
      return;
    }
    this.attributes.splice(attrIndex, 1);
  }
/**
@desc open model and save rule
 */
  openModalToAddRule() {
    this.selectedDocType = '';
    this.selectedRuleName = '';
    this.attributes = [
      {
        selectedPrimaryAttribute: '',
        selectedSecondaryAttribute: 'Value',
        selectedCondition: '',
        selectedValue: '',
        selectedAttributeDataType: '',
        selectedPrimaryAttributeDataType: '',
        selectedPrimaryAttributeInFirstRow: [],
        primaryAttributes: [],
        secondaryAttributes: [{ attribute_name: 'Value', data_type: 'Text' }],
      },
    ];
    this.attributesLength = 1;
    this.modalState = 1; //1 for add (used when calling api saveAndUpdateRule())
    this.titleName = 'Create new Rule';
    this.buttonName = 'Save';
  }

  /**
   * @desc edit rule 
   * @param rowData @
   */
  openModalToEditRule(rowData: any) {
    rowData.primaryAttributes = [];
    rowData.secondaryAttributes = [
      { attribute_name: 'Value', data_type: 'Text' },
    ];
    for (let i of this.projectDocumentTypes) {
      if (i.document_type_id._id == rowData.document_type_id._id) {
        for (let x of i.document_type_id.attributes) {
          rowData.primaryAttributes.push({
            attribute_name: x.attribute_name,
            data_type: x.data_type,
          });
          rowData.secondaryAttributes.push({
            attribute_name: x.attribute_name,
            data_type: x.data_type,
          });
        }
      }
    }

    //binding the selected inputs
    this.attributes = [];
    rowData.rule_conditions.forEach((item: any, index: any) => {
      this.attributes.push({
        selectedPrimaryAttribute: item.primary_attribute,
        selectedSecondaryAttribute: item.secondary_attribute
          ? item.secondary_attribute
          : 'Value',
        selectedCondition: item.operator,
        selectedValue: item.value,
        selectedAttributeDataType: item.data_type,
        selectedPrimaryAttributeDataType: item.data_type, //data-type of the selected primary att.
        selectedPrimaryAttributeInFirstRow: [],
        primaryAttributes: rowData.primaryAttributes,
        secondaryAttributes: rowData.secondaryAttributes,
      });
    });

    //binding primaryAttributeDataType for the selected primaryAttributes.
    for (let i of this.attributes) {
      for (let j of rowData.primaryAttributes) {
        if (i.selectedPrimaryAttribute == j.attribute_name) {
          i.selectedPrimaryAttributeDataType = j.data_type;
        }
      }
    }

    this.selectedDocType = rowData.document_type_id._id;
    this.selectedRuleName = rowData.rule_name;
    this._idForEdit = rowData._id;
    this.docTypeIdForApi = rowData.document_type_id._id; //used for api calls
    this.attributesLength = this.attributes.length;
    this.modalState = 2; //2 for edit (used when calling api saveAndUpdateRule())
    this.titleName = 'Update Rule';
    this.buttonName = 'Update';
  }
  //on changing doc-type dropdown in modal.
  onChangeDocTypeDropdown(selected: any, e: any) {
    let selectedDocType;
    for (let i of this.projectDocumentTypes) {
      if (i.document_type_id._id == e) {
        selectedDocType = i;
      }
    }
    this.docTypeIdForApi = selectedDocType.document_type_id?._id; //used for api call
    this.attributes[0].primaryAttributes = [];
    this.attributes[0].secondaryAttributes = [
      { attribute_name: 'Value', data_type: 'Text' },
    ];
    let primaryAttributeDataType;
    for (let i of this.projectDocumentTypes) {
      if (i._id == selectedDocType._id) {
        primaryAttributeDataType = i.document_type_id.attributes?.[0].data_type;
        for (let x of i.document_type_id.attributes) {
          this.attributes[0].primaryAttributes.push({
            attribute_name: x.attribute_name,
            data_type: x.data_type,
          });
          this.attributes[0].secondaryAttributes.push({
            attribute_name: x.attribute_name,
            data_type: x.data_type,
          });
        }
      }
    }

    this.attributes = [
      {
        selectedPrimaryAttribute:
          this.attributes[0].primaryAttributes?.[0].attribute_name,
        selectedSecondaryAttribute: 'Value',
        selectedCondition: '',
        selectedValue: '',
        selectedAttributeDataType: primaryAttributeDataType,
        selectedPrimaryAttributeDataType:
          this.attributes[0].primaryAttributes?.[0].data_type,
        selectedPrimaryAttributeInFirstRow: [],
        primaryAttributes: this.attributes[0].primaryAttributes,
        secondaryAttributes: this.attributes[0].secondaryAttributes,
      },
    ];
  }
/**
 * @desc save & update rule api call 
*/
  saveAndUpdateRule() {
    //rule name validation
    if (this.selectedRuleName?.trim()) {
      let ruleNameRegex = new RegExp(/^\S*$/); //regex for no space in-between of text.
      let ruleNameTest = ruleNameRegex.test(this.selectedRuleName?.trim());
      if (!ruleNameTest) {
        this.toastr.add({
          type: 'warning',
          message: "Rule Name mustn't contain any space",
        });
        return;
      }
    }

    //Valodating all the fields have some value.
    for (let i of this.attributes) {
      if (i.selectedSecondaryAttribute == 'Value') {
        if (
          !i.selectedPrimaryAttribute ||
          !i.selectedCondition ||
          !i.selectedValue ||
          !i.selectedSecondaryAttribute ||
          !this.selectedRuleName?.trim()
        ) {
          this.toastr.add({
            type: 'warning',
            message: 'Please fill all the fields to proceed',
          });
          return;
        }
      } else {
        if (
          !i.selectedPrimaryAttribute ||
          !i.selectedCondition ||
          !i.selectedSecondaryAttribute ||
          !this.selectedRuleName?.trim()
        ) {
          this.toastr.add({
            type: 'warning',
            message: 'Please fill all the fields to proceed',
          });
          return;
        }
      }
    }

    //validating data-type.
    for (let i of this.attributes) {
      if (
        i.selectedPrimaryAttribute != '' &&
        i.selectedSecondaryAttribute == 'Value' &&
        (i.selectedAttributeDataType == 'Numeric' ||
          i.selectedAttributeDataType == 'Numeric (Integer)' ||
          i.selectedAttributeDataType == 'numeric')
      ) {
        let regex = new RegExp(/^\d+$/);
        let reTest = regex.test(i.selectedValue);
        if (!reTest) {
          this.toastr.add({
            type: 'warning',
            message:
              'Please enter a valid value for ' + i.selectedPrimaryAttribute,
          });
          return;
        }
      } else if (
        i.selectedPrimaryAttribute != '' &&
        i.selectedSecondaryAttribute == 'Value' &&
        i.selectedAttributeDataType == 'Alpha'
      ) {
        let regex = new RegExp(/^[a-zA-Z\s]*$/);
        let reTest = regex.test(i.selectedValue);
        if (!reTest) {
          this.toastr.add({
            type: 'warning',
            message:
              'Please enter a valid value for ' + i.selectedPrimaryAttribute,
          });
          return;
        }
      } else if (
        i.selectedPrimaryAttribute != '' &&
        i.selectedSecondaryAttribute == 'Value' &&
        i.selectedAttributeDataType == 'Alphanumeric'
      ) {
        let regex = new RegExp(/^[a-zA-Z0-9]+$/);
        let reTest = regex.test(i.selectedValue);
        if (!reTest) {
          this.toastr.add({
            type: 'warning',
            message:
              'Please enter a valid value for ' + i.selectedPrimaryAttribute,
          });
          return;
        }
      } else if (
        i.selectedPrimaryAttribute != '' &&
        i.selectedSecondaryAttribute == 'Value' &&
        i.selectedAttributeDataType == 'Amount'
      ) {
        let regex = new RegExp(/^[1-9]\d{1,9}(?:\.\d{1,2})?$/);
        let reTest = regex.test(i.selectedValue);
        if (!reTest) {
          this.toastr.add({
            type: 'warning',
            message:
              'Please enter a valid value for ' + i.selectedPrimaryAttribute,
          });
          return;
        }
      }
    }

    let ruleCondition = [];
    for (let i of this.attributes) {
      ruleCondition.push({
        primary_attribute: i.selectedPrimaryAttribute,
        value: i.selectedValue,
        operator: i.selectedCondition,
        secondary_attribute: i.selectedSecondaryAttribute,
        data_type: i.selectedAttributeDataType,
      });
    }

    if (this.modalState == 1) {
      let saveRuleReqBody = {
        document_type_id: this.docTypeIdForApi,
        project_id: this.projectType_id,
        rule_name: this.selectedRuleName?.trim(),
        rule_conditions: ruleCondition,
      };
      
      this.smeService
        .createRuleDataApi(this.projectType_id, saveRuleReqBody)
        .subscribe(
          (data: any) => {
            this.toastr.add({
              type: 'success',
              message: 'Rule added successfully',
            });
            this.smeService.refreshRulesList();
          },
          (error: any) => {
            this.toastr.add({
              type: 'error',
              message: error?.error?.message || 'Could not process the request',
            });
          }
        );
    } else if (this.modalState == 2) {
      let editRuleReqBody = {
        _id: this._idForEdit,
        document_type_id: this.docTypeIdForApi,
        project_id: this.projectType_id,
        rule_name: this.selectedRuleName.trim(),
        rule_conditions: ruleCondition,
      };

      this.smeService
        .updateRuleDataApi(this.projectType_id, editRuleReqBody)
        .subscribe(
          (data: any) => {
            this.toastr.add({
              type: 'success',
              message: 'Rule updated successfully',
            });
            this.smeService.refreshRulesList();
          },
          (error: any) => {
            this.toastr.add({
              type: 'error',
              message: error?.error?.message || 'Could not process the request',
            });
          }
        );
    }
  }
/**
 * @desc unsubcribe the subcriptions 
 * */
  ngOnDestroy() {
    this.subcriptionRules.unsubscribe();
  }
}
