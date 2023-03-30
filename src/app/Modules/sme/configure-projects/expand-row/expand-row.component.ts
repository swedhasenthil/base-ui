import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { values } from 'lodash';
import { AuthService } from 'src/app/core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SmeService } from '../../sme.service';

@Component({
  selector: 'app-expand-row',
  templateUrl: './expand-row.component.html',
  styleUrls: ['./expand-row.component.scss']
})
export class ExpandRowComponent implements OnInit {
  @Input() masterJsonArr: any;
  @Input() masterIndex: any;
  @Input() field: any;
  @Input() index: any;
  @Input() types: any;
  @Input() listsOfProject: any;
  @Input() fetchedData: any;
  @Input() docTypeUnderProject: any;
  docTypedesc: any;
  projectId: any;
  selectedMasterIndex: any;
  modalAttrName: any;
  attributes: any[];
  selectedAttibutes: any[];
  docId: any;
  isEdit: any;
  isDoumentChanged: boolean;
  target: any[];

  projectDocumentList: any = []
  dataType: any;
  isDeleteFromNew: boolean;
  uniqueDocTypeSelection: any;
  isData: any = true;
  showFieldArrayAdd: boolean;
  editableMmasterIndex: string | number;
  editableNewAttrIndex: string | number;
  UniqueTypeArr: any = [];
  uniqueDocTypeSelectionOnEdit: any;
  isClicked: boolean;
  rowClicked: string | number;
  editstatus: string;
  masterIndexDelete: any;
  indexDelete: any;
  docNameFromDelete: any;
  documentId: any;
  selectedField: any;
  leftAllCheckBox: any;
  rightAllCheckBox: any;
  isDefineRules: boolean;
  updatedDocId: any = []
  selectedProjectId: any;
  documentName: any;
  disableButton: boolean;
  constructor(private api: SmeService,
    private toastr: ToasterService,
    private authService: AuthService,
  ) { }
  /**
     * @desc expand row list
     */
  ngOnInit(): void {
    this.selectedProjectId = this.listsOfProject.projectUid;
    this.projectDocumentList.length = 0;
    this.api
      .getProjectDocumentType(this.listsOfProject.projectUid)
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          var newRow = {
            documentType: element.document_type_id._id,
            documentDescription: '',
            selectedAttributes: element.attributes,
            attributeList: element.document_type_id.attributes,
            attributesLength: element.attributes.length,
            documentName: element.document_type_id.document_type,
            status: 'Done',
          };
          newRow.selectedAttributes.forEach((element: any) => {
            element.threshold = element.threshold * 100;
            element.threshold = element.threshold.toFixed()

          })
          this.projectDocumentList.push(newRow);
        });

      });
    this.uniqueDocTypeSelection = this.types;

  }
  /**
     * @desc open attribute modal
    */
  openDualListModal(value: any, blockName: any, masterIndex: any, i: any) {
    this.disableButton = false
    this.api.setEditStatus(this.disableButton)
    this.leftAttributeList = [];
    this.rightAttributeList = [];
    this.projectId = i.projectUid
    this.selectedMasterIndex = masterIndex;
    this.modalAttrName = value.documentName;
    this.attributes = [];
    this.dataType = [];
    this.fetchedData.forEach((element: { document_type: any; attributes: any[]; _id: any; }) => {
      if (element.document_type === value.documentName) {
        this.docId = element._id;

        element.attributes.forEach((index: { attribute_name: any; data_type: any; threshold: any; upper_limit: any; lower_limit: any; _id: any; }) => {
          this.attributes.push(index.attribute_name);
          const dTypes = {
            attribute_name: index.attribute_name,
            data_type: index.data_type,
            threshold: index.threshold == undefined ? 0 : index.threshold,
            upperlimit: index.upper_limit,
            lowerlimit: index.lower_limit,
            _id: index._id,
          };
          this.dataType.push(dTypes);
        });
      }
    });
    this.leftAttributeList = this.dataType;
    this.selectedAttibutes = [];
    const finalArr = {
      document_type_id: this.docId,
      project_id: this.projectId,
      document_type: this.modalAttrName,
      document_type_description: this.docTypedesc,
    };
    this.api.documentSubmitValue(this.updatedDocId, finalArr)
    this.api.setAttributes(this.leftAttributeList, this.rightAttributeList)
    this.api.setSelectedAttributes(this.selectedAttibutes,)
  }

  newValueOnDocumentChange(data: any) {
    this.fetchedData.forEach((element: { document_type: any; _id: any; }) => {
      if (element.document_type === data) {
        this.updatedDocId = element._id;
        var finalArr;
        this.api.documentSubmitValue(this.updatedDocId, finalArr)
      }
    });
  }
  /**
     * @desc display document type dropdown value
     */
  docType(data: any, index_value: any, masterIndex: any, masterJsonArr: any) {
    this.dataType = [];
    this.dataType.length = 0;
    this.leftAttributeList = [];
    this.rightAttributeList = [];
    this.projectId = masterJsonArr.project_id
    this.newValueOnDocumentChange(data);
    if (this.isEdit) {
      this.isDoumentChanged = true;
      this.masterJsonArr[masterIndex].attributesArr[index_value].attrArray = [];
      this.target = [];
    }
    this.attributes = [];
    this.fetchedData.forEach((element: { document_type: any; _id: any; attributes: any[]; }) => {
      if (element.document_type === data) {
        this.docId = element._id;
        this.documentName = data
        if (index_value >= 0) {
          this.masterJsonArr[masterIndex].attributesArr[
            index_value
          ].attrLength = element.attributes.length;
        } else if (index_value == -1) {
          this.masterJsonArr[masterIndex].newAttribute.attrLength =
            element.attributes.length;
          if (this.masterJsonArr[masterIndex].newAttribute.attrLength == 0) {
            const saveDocument = {
              document_type_id: this.docId,
              project_id: this.projectId,
              document_type: data,
              document_type_description: this.docTypedesc,
            };
            this.api.submit(saveDocument).subscribe(
              (submitted: any) => { },
              (err: { status: any; error: { message: string | undefined; }; }) => {
                if (this.authService.isNotAuthenticated(err.status)) {
                  this.authService.clearCookiesAndRedirectToLogin();
                  return;
                }
              }
            );
          }
        }
        element.attributes.forEach((index: { attribute_name: any; data_type: any; threshold: any; upper_limit: any; lower_limit: any; _id: any; }) => {
          this.attributes.push(index.attribute_name);
          const dTypes = {
            attribute_name: index.attribute_name,
            data_type: index.data_type,
            threshold: index.threshold == undefined ? 0 : index.threshold,
            upperlimit: index.upper_limit,
            lowerlimit: index.lower_limit,
            doctypeid: index._id,
          };
          this.dataType.push(dTypes);
        });
      }

    });
    this.setAttributeList() 
  }

  /**
     * @desc document descripiton
     */
  docTypeDescChange(dTypeDesc: any, masterIndex: any) {
    this.docTypedesc = dTypeDesc;
  }
  /**
     * @desc selcted document attributes list with editing button
     */
  setAttributeList() {
    this.disableButton = false
    this.api.setEditStatus(this.disableButton)
    this.leftAttributeList = this.dataType;
    this.selectedAttibutes = [];
    this.rightAttributeList = [];
    const finalArr = {
      document_type_id: this.docId,
      project_id: this.projectId,
      document_type: this.documentName,
      document_type_description: this.docTypedesc,
    };
    this.api.documentSubmitValue(this.updatedDocId, finalArr)
    this.leftAttributeList = this.dataType;
    this.selectedAttibutes = [];
    this.api.setSelectedAttributes(this.selectedAttibutes)
    this.api.setAttributes(this.leftAttributeList, this.rightAttributeList)
  }
  /**
     * @desc  add row on the last index of attributr array
  */
  addRow(masterIndex: string | number, field: { add: boolean; }, data: string) {
    this.isDeleteFromNew = false;
    this.masterJsonArr[masterIndex].newAttribute['documentName'] =
      this.uniqueDocTypeSelection[0];
    if (data === 'fromFieldArray') {
      this.isData = false;
      field.add = false;
    } else {
      this.showFieldArrayAdd = true;
    }
  }
  /**
     * @desc edit row on the last index of attribute array
  */
  editRow(masterIndex: string | number, index: string | number, field: any) {
    this.editableMmasterIndex = masterIndex;
    this.editableNewAttrIndex = index;
    this.masterJsonArr[masterIndex].attributesArr[index]['edit'] = 'true';
    this.isEdit = true;
    for (let j = 0; j < this.docTypeUnderProject.length; j++) {
      const uniqueTypes =
        this.docTypeUnderProject[j].document_type_id.document_type;
      if (uniqueTypes) {
        this.UniqueTypeArr.push(uniqueTypes);
        this.uniqueDocTypeSelectionOnEdit = this.types;
        this.uniqueDocTypeSelectionOnEdit = this.uniqueDocTypeSelection.filter(
          (el: any) => !this.UniqueTypeArr.includes(el)
        );
        this.uniqueDocTypeSelectionOnEdit.push(
          this.masterJsonArr[this.editableMmasterIndex].attributesArr[
            this.editableNewAttrIndex
          ].documentName
        );
      }
    }
    this.isClicked = !this.isClicked;
    if (this.rowClicked === index) {
      this.editstatus = 'Pending';
      this.rowClicked = index;
    } else {
      this.editstatus = 'Pending';
      this.rowClicked = index;
    }
  }

   /**
   * @desc   update Doc type submit button
   */
   updateDocument(docType:any) {

    const updateJson = {
      id: docType._id,
      document_type_id: docType.document_type_id,
      project_id: docType.project_id,
      document_type: docType.documentName,
      document_type_description: docType.description,
    };

 /**
   * @desc   api call to edit document type
   */
    this.api.editDocType(updateJson).subscribe(
      (updateResponse: any) => {
        if (updateResponse) {

          this.toastr.add({
            type: 'success',
            message: 'Updated Successfully',
          });

        }
      },
      (err: { status: any; error: { message: string | undefined; }; }) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: err.error.message ? err.error.message : 'Error',
        });
      }
    );
  }

  /**
     * @desc on click of delete icon
  */
  deleteDoumentType(masterIndex: any, index: any, docName: any, selectedValue: any) {
    this.masterIndexDelete = masterIndex;
    this.indexDelete = index;
    this.docNameFromDelete = docName;
    this.projectId = selectedValue.project_id;
  }
  /**
     * @desc delete  if no document type available under a project
  */
  deleteFromNewAttribute(masterindex: string | number) {
    const delIndex = this.masterJsonArr[masterindex].attributesArr.length;
    this.masterJsonArr[masterindex].attributesArr[delIndex - 1]['add'] = true;
    this.isDeleteFromNew = true;
    this.masterJsonArr[masterindex].newAttribute.description = '';
  }

  /**
     * @desc selcted document attributes list without editing button
     */
  leftAttributeList: any = [];
  rightAttributeList: any = [];
  attibutesSelection(attibutes: any, field: any, value: any) {

    if (field?.edit) {
      this.disableButton = false
      this.api.setEditStatus(this.disableButton)
    }
    else {
      this.disableButton = true
      this.api.setEditStatus(this.disableButton)

    }
    this.ngOnInit()
    this.selectedAttibutes = attibutes.selectedAttributes;
    this.selectedField = field;
    this.api.setSlectedFieldType(this.selectedField, value)
    this.leftAttributeList = [];
    this.rightAttributeList = [];
    if (this.leftAllCheckBox && this.rightAllCheckBox) {
      this.leftAllCheckBox.nativeElement.checked = false;
      this.rightAllCheckBox.nativeElement.checked = false;
    }
    //  this.leftAttributeList = attibutes.attributeList;
    attibutes.attributeList.forEach((index: { attribute_name: any; data_type: any; threshold: any; upper_limit: any; lower_limit: any; _id: any; }) => {
      const dTypes = {
        attribute_name: index.attribute_name,
        data_type: index.data_type,
        threshold: index.threshold == undefined ? 0 : index.threshold,
        upperlimit: index.upper_limit,
        lowerlimit: index.lower_limit,
        doctypeid: index._id,
      }
      this.leftAttributeList.push(dTypes);
    })
    this.rightAttributeList = attibutes.selectedAttributes;
    attibutes.status == 'Done'
      ? (this.isDefineRules = true)
      : (this.isDefineRules = false);
    for (var i = this.leftAttributeList?.length - 1; i >= 0; i--) {
      for (var j = 0; j < this.rightAttributeList?.length; j++) {
        if (
          this.leftAttributeList[i] &&
          this.leftAttributeList[i].attribute_name ===
          this.rightAttributeList[j].attribute_name
        ) {
          this.leftAttributeList.splice(i, 1);
        }
      }
    }
    this.api.setAttributes(this.leftAttributeList, this.rightAttributeList)
    this.api.setSelectedAttributes(this.selectedAttibutes)  
  }
  /**
     * @desc delete if document type is available under a project
     */
  deleteFieldValue(masterindex: string | number, index: any, docName: any) {
    this.fetchedData.forEach((element: { document_type: any; _id: any; }) => {
      if (docName === element.document_type) {
        this.documentId = element._id;
      }
    });
    this.api.deleteDocType(this.documentId, this.projectId).subscribe(
      (del: any) => {
        const delMessage: any = del;
        location.reload()
        if (
          delMessage.message ===
          'Project document type mapping has been deleted'
        ) {
          this.uniqueDocTypeSelection.push(docName);
          this.toastr.add({
            type: 'success',
            message: 'Deleted Succesfully',
          });
        }
      },
    );
  }
}