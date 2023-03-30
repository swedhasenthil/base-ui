import { getLocaleExtraDayPeriodRules } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit {  
  [x: string]: any;

  @ViewChild('closeModel') closeModel: ElementRef;
  @ViewChild('btnAddRule') addRuleModel: ElementRef;
  @ViewChild('deleteModel') deleteModel:ElementRef;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject();
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
  constructor(
    private smeService: SmeService,
    private toastr: ToasterService,
    private router: Router,
    private sharedService:SharedService
  ) {
     this.smeService.refreshRulesListSubject.subscribe(()=>{
      this.getTableList();
   });
  }
  ngOnInit(): void {
    this.sharedService.smeMenuChanges();

    if (this.smeService.metaDataConfigureDoc) {
      this.projectType_id = this.smeService.metaDataConfigureDoc?.docType_id;
    } else {
      this.router.navigate(['sme/configure-projects']);
    }
    
    this.projectType_id = localStorage.getItem("docTypeId")
    this.selectedProjectName = localStorage.getItem("configerProjectName")
    if (this.smeService.projectDetails) {
 
      this.selectedProjectName =
        this.smeService.projectDetails.projectDetails['projectName'];
    }

    if (this.projectType_id) {
      this.getTableList();

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

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      }
    });
    this.dtTrigger.next(null);
  }

  //get table data
  getTableList() {
    this.dtOptions[0] = {
      order: [[0, 'desc']],
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [ 10, 20, -1],
        [10, 20, 30, 'All'],
      ],
      retrieve: true,
      scrollX: true,
      scrollCollapse: true,
      columnDefs: [
        {
          targets: [6], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
    if (this.projectType_id) {
      this.smeService.getListWorkflowRuleData(this.projectType_id).subscribe(
        (data) => {
          if (data) {
            this.addWorkflowListRuleData = data;
            this.ruleDocumentData1 = data;
            this.rerender();
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

  deleteRule(data: any) {
    this.selectedName = data && data.rule_name;
    this.selectedRuleId = data && data._id;
  }
  
  onChangePrimateAttributeDropdown(e: any, obj: any) {
    for (let i of obj.primaryAttributes) {
      if (i.attribute_name == e.target.value) {
        obj.selectedAttributeDataType = i.data_type;
      }
    }
    obj.selectedPrimaryAttributeDataType = obj.selectedAttributeDataType;
  }

  onChangeSecondaryAttributeDropdown(e: any, obj: any) {
    if (e != 'Value') {
      obj.selectedValue = '';
    }
  }

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

  removeAttributeRow(attrIndex: any) {
    if (this.attributesLength == 1) {
      return;
    }
    this.attributes.splice(attrIndex, 1);
  }

 /**
 * @desc open edit model popup
 * @param rowData 
 */
 openModalToAddRule() {
  this.smeService.addEditRule('Add')
  this.titleName = 'Create new Rule';
  this.buttonName = 'Save';
}

/**
 * @desc open edit model popup
 * @param rowData 
 */
openModalToEditRule(rowData: any) {
  this.smeService.addEditRule('Edit',rowData)
  this.modalState = 2; //2 for edit (used when calling api saveAndUpdateRule())
  this.titleName = 'Edit Rule';
  this.buttonName = 'Update';
}

  closeRuleModal() {
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
        secondaryAttributes: [],
      },
    ];
    this.selectedDocType = '';
    this.selectedRuleName = '';
  }

  //on changing doc-type dropdown in modal.
  onChangeDocTypeDropdown(selected: any, e: any) {
    let selectedDocType;
    for (let i of this.projectDocumentTypes) {
      if (i.document_type_id._id == e) {
        selectedDocType = i;
      }
    }

    this.docTypeIdForApi = selectedDocType.document_type_id?._id; //used for api calls

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
  *@desc save  update rule api call 
  **/
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
            this.closeRuleModal();
            this.getTableList(); //refreshing the table
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
            this.closeRuleModal();
            this.getTableList(); //refreshing the table
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

  //status change api call
  onCheckboxStatusChange(index: any, rowData: any, e: any) {
    if (e.target.checked) {
      this.ruleDocumentData1[index].is_active = true;
    } else {
      this.ruleDocumentData1[index].is_active = false;
    }

    let ruleStatusUpdateReqBody = {
      _id: rowData._id,
      document_type_id: rowData.document_type_id._id,
      project_id: rowData.project_id,
      rule_name: rowData.rule_name,
      rule_conditions: rowData.rule_conditions,
      is_active: e.target.checked,
    };

    this.smeService
      .updateRuleDataApi(this.projectType_id, ruleStatusUpdateReqBody)
      .subscribe(
        (data: any) => {
          if (data) {
            this.toastr.add({
              type: 'success',
              message: data?.message,
            });
          }
        },
        (error: any) => {
          this.toastr.add({
            type: 'error',
            message: error?.error?.message || 'Could not process the request',
          });
          this.ruleDocumentData1[index].is_active =
            !this.ruleDocumentData1[index].is_active;
        }
      );
  }

  //to  grab id of rule to delete
  setIdToDelete(rowData: any) {
    this.selectedRuleId = rowData._id;
  }

  //delete api call
  onDeleteRule() {
    this.smeService
      .deleteRule(this.projectType_id, this.selectedRuleId)
      .subscribe(
        (data: any) => {
          this.toastr.add({
            type: 'success',
            message: data?.message,
          });
          this.getTableList(); //refreshing the table
          this.deleteModel.nativeElement.click();
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
