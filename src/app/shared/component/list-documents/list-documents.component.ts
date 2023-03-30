import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { CommonService } from '../../services/common.service';
import { ScrollService } from '../../services/scroll.service';
import { SharedService } from '../../../shared/shared.service';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { DatePipe } from '@angular/common';
import { timeStamp } from 'console';
import { stat } from 'fs/promises';
@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.scss'],
})
export class ListDocumentsComponent implements OnInit {
  @Input() displayList: any = true;
  isTaskAssignmentManual: boolean = true;
  document: any;
  documentTypeId: any;
  // Check from which module we are calling this component
  calledBy: any;
  documentAttributes: any;
  updatedDocumentAttributes: any;
  updatedWithDocumentTypes: any;
  originDocumentAttributes: any;
  // list of document Types
  projectDocumentTypes: any;
  // Current document Type settings
  documentTypeSettings: any;
  projectDocumentTypesObject: any = {};
  subscriptionParentComponent: Subscription;
  subscriptionProject: Subscription;
  subscriptionAssignee: Subscription;
  subscriptionStatus: Subscription;
  subscriptionRefresh: Subscription;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  listOfDocuments: any = [];
  orginalListOfDocuments: any = [];
  @Input() statusOptions: any;
  selectedProject: any;
  assigneeType: any;
  selectedDocumentStatus: any;
  refreshStatus: any = false;
  // Auto Task variable
  getTaskIsDisabled: any = false;
  assgin: any;
  status: any;
  updateStatus: any;
  userName: any;
  assginFilter: any;
  documentEmpty: any = false;
  loadedDocuments: boolean = false;
  constructor(
    private scrollService: ScrollService,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    public sharedService: SharedService,
    public toastService: ToasterService,
    private datepipe: DatePipe
  ) {
    this.userName = localStorage.getItem('user_name');
    /**
@desc Auto task observer from attributes-buttons component
**/
    if (this.commonService.assignTaskTypeAutoSub == undefined) {
      this.commonService.assignTaskTypeAutoSub =
        this.commonService.assignTaskTypeAuto.subscribe((name: string) => {
          if (this.selectedProject) {
            this.getTask(false);
          }
        });
    }

  }
  ngOnInit(): void {
    this.subscriptionParentComponent =
      this.commonService.parentComponent.subscribe((flag) => {
        this.calledBy = flag;
      });
    this.subscriptionProject = this.sharedService.currentProject.subscribe(
      (project) => {
        if (project?.taskAssignment) {
          project.taskAssignment == 'Manual'
            ? (this.isTaskAssignmentManual = true)
            : (this.isTaskAssignmentManual = false);
          this.selectedProject = project.id;
          this.loadProjectDocuments();
          this.loadProjectDocumentTypes();
        }
      }
    );
    this.subscriptionStatus = this.sharedService.currentStatus.subscribe(
      (status) => {
        this.filterStatus(status);
        this.status = status;
      }
    );
    this.subscriptionAssignee = this.sharedService.currentAssignee.subscribe(
      (assgin: any) => {
        this.assginFilter = assgin;
        this.filterStatus(this.status);
      }
    );
    this.subscriptionRefresh = this.commonService.refreshTableSubject.subscribe(
      (data) => {
        this.loadProjectDocuments();
      }
    );
    this.sharedService.currentStatus.subscribe(
      (res) => (this.updateStatus = res)
    );
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true,
      scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
      scrollX: true,
      scrollCollapse: true,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      columnDefs: [{ targets: [4, 5, 6], type: 'date' }],
      responsive: true,
    };
    this.loadProjectDocumentTypes();
    this.loadProjectDocuments();
  }
  ngDoCheck(): void {
    if (this.statusOptions != null && this.statusOptions != undefined) {
      this.assigneeType = this.statusOptions.assignee;
      this.selectedDocumentStatus = this.statusOptions.document_status;
    }
  }

  /**
   *@desc load project documents from backend
   **/
  loadProjectDocuments() {
    if (this.isTaskAssignmentManual && this.selectedProject) {
      let payload = {
        project_id: this.selectedProject,
      };
      this.commonService
        .getDocumentsList(payload)
        .subscribe((response: any) => {
          if (response.data.length) {
            response.data.forEach((document: any) => {
              document = this.documentStatus(document, this.calledBy);
            });
          }
          this.orginalListOfDocuments = response.data;
          this.commonService.setListDocument(response.data);
          this.createStatusList(this.calledBy);
        });
    }
  }
  copyDocId(id: any) {
    navigator.clipboard.writeText(id);
  }
  /**
  *@desc filter the status based assigned to me or my teams
  **/
  filterStatus(selectedDocuemntStatus: any) {
    let user_id = localStorage.getItem('currentUserId');
    if (this.assginFilter == 'Assigned to me') {
      if (selectedDocuemntStatus.status == 'All') {
        this.listOfDocuments = this.orginalListOfDocuments.filter(
          (document: any) => {
            return document.user_id?._id == user_id;
          }
        );
      } else {
        this.listOfDocuments = this.orginalListOfDocuments.filter(
          (document: any) => {
            return (
              document.document_status == selectedDocuemntStatus.status &&
              document.user_id?._id == user_id
            );
          }
        );
      }
    } else if (this.assginFilter === 'Assigned to my team') {
      if (selectedDocuemntStatus.status == 'All') {
        this.listOfDocuments = this.orginalListOfDocuments;
      } else {
        this.listOfDocuments = this.orginalListOfDocuments.filter(
          (document: any) => {
            return document.document_status == selectedDocuemntStatus.status;
          }
        );
      }
    }
    this.rerender(); // Once data filtered re-render the data table
  }
  /**
  *@desc data table rerender 
  **/
  rerender(): void {
    if (this.dtElements) {
      this.dtElements.forEach((dtElement: DataTableDirective) => {
        if (dtElement.dtInstance) {
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
        }
      });
      this.dtTrigger.next(null);
    }
  }
  /**
   *@desc getting project document types from backend
   **/
  loadProjectDocumentTypes() {
    if (this.selectedProject) {
      const payload = {
        project_id: this.selectedProject,
      };
      this.commonService.getDocumentTypes(payload).subscribe(
        (data) => {
          this.projectDocumentTypes = data;
          this.projectDocumentTypes.forEach((document: any) => {
            this.projectDocumentTypesObject[document.document_type_id._id] =
              document.document_type_id.document_type;
          });
        },
        (error) => { }
      );
    }
  }
  /**
   *@desc 1. If Assign task type manual - send document as a parameter to this function
   *@desc 2. If Assign task type Auto -  send boolean false as a parameter to this function
   */
  getTask(document: any) {
    let payload: any = {
      role_id: localStorage.getItem('currentUserRoleId'),
      user_id: localStorage.getItem('currentUserId'),
      project_id: this.selectedProject,
    };
    if (document._id) {
      payload.document_id = document._id;
    }
    this.commonService.getTaskFromBackend(payload).subscribe(
      (response: any) => {
        let document = response[0];
        if (!document) {
          this.documentEmpty = true;
          this.toastService.add({
            type: 'warning',
            message: 'No documents available for review',
          });
        } else {
          this.documentTypeId = document.document_type_id;

          this.documentAttributes = document.extracted_details;
          this.originDocumentAttributes = JSON.parse(
            JSON.stringify(this.documentAttributes)
          );
          // Get edited details based on role analyst or QC using calledBy variable
          let editedDetailsLabel: any;
          let editedDocumentTypeLabel: any;
          if (this.calledBy == 'analyst') {
            editedDetailsLabel = 'edited_details_a';
            editedDocumentTypeLabel = 'edited_document_type_id_a';
          } else if (this.calledBy == 'qc') {
            editedDetailsLabel = 'edited_details_qc';
            editedDocumentTypeLabel = 'edited_document_type_id_qc';
          }
          // Check document type changed by analyst
          if (document?.edited_details_a?.length) {
            // If there is change, assign analyst updated data to document attributes
            if (document?.edited_document_type_id_a) {
              this.documentTypeId = document.edited_document_type_id_a;
              this.originDocumentAttributes = JSON.parse(
                JSON.stringify(document.edited_details_a)
              );
            }
            this.documentAttributes = document.edited_details_a;
          }
          // Check document type changed by QC
          if (document?.edited_details_qc?.length) {
            // If there is change, assign qc updated data to document attributes
            if (document?.edited_document_type_id_qc) {
              this.documentTypeId = document.edited_document_type_id_qc;
              this.originDocumentAttributes = JSON.parse(
                JSON.stringify(document.edited_details_qc)
              );
            }
            this.documentAttributes = document.edited_details_qc;
          }
          /**
           * Get current document type setting from listOfDocumentTypes
           */
          this.documentTypeSettings = this.projectDocumentTypes.filter(
            (document: any) =>
              document.document_type_id._id === this.documentTypeId
          );
          /**
           * Check current document type is available within list of available document types or not
           * If Available - push document with "current document type name" as a property
           * If Not available - push document with documnt type name "Others" as a property
           */
          let documentTypeName =
            this.projectDocumentTypesObject[this.documentTypeId];
          if (!documentTypeName) {
            documentTypeName = 'Others';
            this.projectDocumentTypesObject[this.documentTypeId] =
              documentTypeName;
          }
          document.projectDocumentTypes = this.projectDocumentTypes;
          // Add this document type name within document object
          document.documentTypeName = documentTypeName;
          // Add list of Document types object
          document.projectDocumentTypesObject = this.projectDocumentTypesObject;
          // Creating documentAttibute Object for attribute component
          this.documentAttributes[documentTypeName] =
            this.updatedDocumentAttributes;
          // if analyst or qc updated some values, update documentAttribute Object based on updates
          this.updatedDocumentAttributes =
            this.checkOriginWithUpdatedDocumentAttributes(
              this.documentAttributes,
              document[editedDetailsLabel],
              this.calledBy
            );
          this.updatedDocumentAttributes = this.applySMEsettings(
            this.updatedDocumentAttributes,
            this.documentTypeSettings
          );
          // Based on documentType settings, update documentAttribute Object
          this.updatedDocumentAttributes =
          this.sharedService.applyDocumentTypeSettings(
            this.updatedDocumentAttributes,
            this.documentTypeSettings
          );
          document.updatedAttributes = this.updatedDocumentAttributes;
          this.originDocumentAttributes = this.updateOriginAttributes(
            this.originDocumentAttributes,
            this.updatedDocumentAttributes
          );
          // Add refreshed attributes into document to use in attributes-component
          document.originAttributes = this.originDocumentAttributes;
          this.commonService.setReviewDocument = document;
          this.commonService.setDocument(document);
          this.sharedService.setHeaderDocumentType = true;
          this.router.navigate([`/${this.calledBy}/review-document`]);
        }
      },
      (errorResponse) => {
        this.toastService.add({
          type: 'warning',
          message: 'No documents available for review',
        });
      }
    );
  }
  /**
   * @desc Returns the originDocumentAttributes.
   * @param  updatedDocumentAttributes
   * @param documentAttributes
   * @param role
   */
  checkOriginWithUpdatedDocumentAttributes(
    documentAttributes: any,
    updatedDocumentAttributes: any,
    role: any
  ) {
    // Role based showing editrole
    let editedBy: any;
    if (role == 'analyst') {
      editedBy = 'editedByAnalyst';
    } else if (role == 'qc') {
      editedBy = 'editedByQc';
    }
    if (updatedDocumentAttributes.length > 0) {
      updatedDocumentAttributes.forEach((editedField: any) => {
        if (editedField.category) {
          documentAttributes.map((element: any) => {
            if (
              element.category === editedField.category &&
              (editedField['edited'] == true || editedField[editedBy] == true)
            ) {
              element[editedBy] = true;
            }
          });
        }
      });
    }
    return documentAttributes;
  }
  /**
   * @desc Returns the updatedDocumentAttributes.
   * @param  -documentAttributes
   * @param  - documentTypeSettings
   */
  applyDocumentTypeSettings(
    documentAttributes: any,
    documentTypeSettings: any
  ) {
    if (documentTypeSettings.length > 0) {
      // Get document Type Attribute settings
      let documentTypeAttributesSettings = documentTypeSettings[0].attributes;
      documentTypeAttributesSettings.forEach((attributeSettings: any) => {
        const thresholdValue: any = attributeSettings.threshold;
        let confidenceScoreValue: any;
        // Apply document attribute settings to all matched attributes
        documentAttributes.forEach((attribute: any) => {
          if (attributeSettings.attribute_name === attribute.category) {
            attribute = this.attributeInputTypeSettingsValidator(
              attribute,
              attributeSettings
            );
            confidenceScoreValue =
              attribute.category_details[0].confidence_score;
            if (confidenceScoreValue >= thresholdValue) {
              attribute.category_details[0]['isColor'] = 'true';
            } else {
              attribute.category_details[0]['isColor'] = 'false';
            }
          }
        });
      });
    }
    return documentAttributes;
  }
  /**
@desc attributes field checked for upper and lower cases
**/
  attributeInputTypeUpperAndLowerLimitValidator(
    attribute: any,
    attributeSettings: any
  ) {
    attribute.category_details[0]['isNumber'] = 'true';

    if (attributeSettings.lower_limit && !attributeSettings.upper_limit) {
      if (attribute.category_details[0].value < attributeSettings.lower_limit) {
        delete attribute.category_details[0]['upper_limit'];
        attribute.category_details[0]['lower_limit'] =
          attributeSettings.lower_limit;
      } else {
        delete attribute.category_details[0]['lower_limit'];
      }
    } else if (
      !attributeSettings.lower_limit &&
      attributeSettings.upper_limit
    ) {
      delete attribute.category_details[0]['lower_limit'];
      if (attribute.category_details[0].value > attributeSettings.upper_limit) {
        attribute.category_details[0]['upper_limit'] =
          attributeSettings.upper_limit;
      } else {
        delete attribute.category_details[0]['upper_limit'];
      }
    } else if (attributeSettings.lower_limit && attributeSettings.upper_limit) {
      if (
        attribute.category_details[0].value < attributeSettings.lower_limit ||
        attribute.category_details[0].value > attributeSettings.upper_limit
      ) {
        attribute.category_details[0]['lower_limit'] =
          attributeSettings.lower_limit;
        attribute.category_details[0]['upper_limit'] =
          attributeSettings.upper_limit;
      } else {
        delete attribute.category_details[0]['upper_limit'];
        delete attribute.category_details[0]['lower_limit'];
      }
    }
    return attribute;
  }
  /**
@desc set the attributes input field validator for radio ,date and dropdown list
@param attribute
@param attributeSettings
**/
  attributeInputTypeSettingsValidator(attribute: any, attributeSettings: any) {
    if (attribute.category && attributeSettings._id) {
      switch (attributeSettings.data_type) {
        case 'Reference Data':
          if (attributeSettings.reference_data_id) {
            /* Input Type radio starts here */
            if (attributeSettings.reference_data_id.values.length <= 3) {
              attribute.category_details[0]['radioLists'] =
                attributeSettings.reference_data_id.values;
              //if values exists bind it, if it doesn't then making it blank
              var radiocount = 0;
              attribute.category_details[0]['radioLists'].forEach(
                (element: any) => {
                  if (element.key == attribute.category_details[0].value) {
                    radiocount++;
                  }
                }
              );
              if (radiocount < 1) {
                attribute.category_details[0].value = '';
              }
            } else if (attributeSettings.reference_data_id.values.length > 3) {
              /* Input Type radio ends here */
              /** Input Type dropdown starts here
               *
               *  if length is <=3 it's a dropdown
               */
              attribute.category_details[0]['dropdownlists'] =
                attributeSettings.reference_data_id.values;
              //if values exists bind it, if it doesn't then making it blank
              var dropdowncount = 0;
              attribute.category_details[0]['dropdownlists'].forEach(
                (element: any) => {
                  if (element.key == attribute.category_details[0].value) {
                    dropdowncount++;
                  }
                }
              );
              if (dropdowncount < 1) {
                attribute.category_details[0].value = '';
              }
            }
          }
          break;
        case 'Date':
          attribute.category_details[0]['isDate'] = 'true';
          var timestamp = Date.parse(attribute.category_details[0].value);
          if (isNaN(timestamp) == false) {
            try {
              attribute.category_details[0].value = this.datepipe.transform(
                attribute.category_details[0].value,
                'dd-MMM-yyyy'
              );
            } catch (error) { }
          }
          break;
        case 'Numeric':
          attribute = this.attributeInputTypeUpperAndLowerLimitValidator(
            attribute,
            attributeSettings
          );
          break;
        case 'Amount':
          attribute = this.attributeInputTypeUpperAndLowerLimitValidator(
            attribute,
            attributeSettings
          );
          break;
        default:
          attribute = attribute;
          break;
      }
    }
    return attribute;
  }
  /**
@desc Get SME categoried attributes from document type settings
**/
  applySMEsettings(documentAttributes: any, documentTypeSettings: any) {
    let filteredDocumentAttributes: any = [];
    if (documentTypeSettings.length > 0) {
      let documentTypeAttributes = documentTypeSettings[0].attributes;
      documentTypeAttributes.forEach((docTypeAttribute: any) => {
        let attribute = documentAttributes.find((attribute:any) => attribute.category==docTypeAttribute.attribute_name);
        if(!attribute)
         attribute =    {
          category_details: [
            {
              location: [],
              confidence_score: 0,
              page_no: 1,
              value: "",
            }
          ],
          category: docTypeAttribute.attribute_name,
          edited: false,
        }
        filteredDocumentAttributes.push(attribute);
      });
    }

    return filteredDocumentAttributes;
  }

  updateOriginAttributes(originAttibutesData: any, updatedAttributesData: any) {
    let attributes: any = [];
    let revisedOriginData: any = [];
    updatedAttributesData.forEach((attribute: any) => {
      if (attribute.category) {
        attributes.push(attribute.category);
      }
    });
    originAttibutesData.forEach((attribute: any, index: any) => {
      if (attributes.indexOf(attribute.category) != -1) {
        revisedOriginData.push(attribute);
      }
    });
    return revisedOriginData;
  }
  /**
@desc create uniqe status from project list
**/
  documentStatus(document: any, role: any) {
    let documentLabel: any;
    let badgeClass: any;
    if (role == 'analyst') {
      switch (true) {
        case document.document_status == 'rejected_a':
          badgeClass = 'skn-status-badge-rejected';
          documentLabel = 'Rejected';
          break;
        case document.document_status == 'failed':
          badgeClass = 'skn-status-badge-failed';
          documentLabel = 'Failed';
          break;
        case document.document_status == 'pending_qc' ||
          document.document_status == 'in_progress_qc' ||
          document.document_status == 'completed_qc' ||
          document.document_status == 'pushed_to_target':
          badgeClass = 'skn-status-badge-completed';
          documentLabel = 'Completed';
          break;
        case document.document_status == 'in-process' ||
          document.document_status == 'uploaded' ||
          document.document_status == 'Pending split' ||
          document.document_status == 'Splitting completed' ||
          document.document_status == 'Failed split' ||
          document.document_status == 'Pending image conversion' ||
          document.document_status == 'Failed image conversion' ||
          document.document_status == 'Pending ocr classification' ||
          document.document_status == 'Failed ocr classification' ||
          document.document_status == 'Pending image classification' ||
          document.document_status == 'Failed image classification' ||
          document.document_status == 'Pending extraction' ||
          document.document_status == 'Failed extraction' ||
          document.document_status == 'Pending contextualization' ||
          document.document_status == 'Failed contextualization':
          badgeClass = 'skn-status-badge-inqueue';
          documentLabel = 'In Queue';
          break;
        case document.document_status == 'pending_a':
          badgeClass = 'skn-status-badge-inqueue';
          documentLabel = 'Pending Review';
          break;
        case document.document_status == 'in_progress_a':
          badgeClass = 'skn-status-badge-inprogress';
          documentLabel = 'In Progress';
          break;
        case document.document_status == 'pending_a':
          badgeClass = 'skn-status-badge-inqueue';
          documentLabel = 'Pending Review';
          break;
        default:
          break;
      }
    } else if (role == 'qc') {
      switch (true) {
        case document.document_status == 'in_progress_a' ||
          document.document_status == 'pending_a':
          badgeClass = 'skn-status-badge-inprogress';
          documentLabel = 'Analyst Queue';
          break;
        case document.document_status == 'in_progress_qc':
          badgeClass = 'skn-status-badge-inprogress';
          documentLabel = 'In Progress';
          break;
        case document.document_status == 'pending_qc':
          badgeClass = 'skn-status-badge-inqueue';
          documentLabel = 'Pending Review';
          break;
        case document.document_status == 'pending_qc':
          badgeClass = 'skn-status-badge-inqueue';
          documentLabel = 'Pending Review';
          break;
        case document.document_status == 'in-process' ||
          document.document_status == 'uploaded' ||
          document.document_status == 'Pending split' ||
          document.document_status == 'Splitting completed' ||
          document.document_status == 'Failed split' ||
          document.document_status == 'Pending image conversion' ||
          document.document_status == 'Failed image conversion' ||
          document.document_status == 'Pending ocr classification' ||
          document.document_status == 'Failed ocr classification' ||
          document.document_status == 'Pending image classification' ||
          document.document_status == 'Failed image classification' ||
          document.document_status == 'Pending extraction' ||
          document.document_status == 'Failed extraction' ||
          document.document_status == 'Pending contextualization' ||
          document.document_status == 'Failed contextualization':
          badgeClass = 'skn-status-badge-inqueue';
          documentLabel = 'In Queue';
          break;
        case document.document_status == 'failed':
          badgeClass = 'skn-status-badge-failed';
          documentLabel = 'Failed';
          break;
        case document.document_status == 'rejected_a' ||
          document.document_status == 'rejected_qc':
          badgeClass = 'skn-status-badge-rejected';
          documentLabel = 'Rejected';
          break;
        case document.document_status == 'completed_qc' ||
          document.document_status == 'pushed_to_target':
          badgeClass = 'skn-status-badge-completed';
          documentLabel = 'Completed';
          break;
        default:
          break;
      }
    }
    document.badgeClass = badgeClass;
    document.documentLabel = documentLabel;
    return document;
  }
  /**
 @desc create uniqe status from project list
 **/
  createStatusList(role: any) {
    let statusList: any = [];
    let tempStatusList = ['All'];
    let tempStatus: any = [];
    let defaultStatus: any = false;
    let userId = localStorage.getItem('currentUserId');
    this.orginalListOfDocuments.forEach((document: any) => {
      if (tempStatusList.indexOf(document.document_status) == -1) {
        tempStatusList.push(document.document_status);
      }
      // Also check users current document status
      /* 
        1. Check user have any in-progress document
        2. Check user have any documents assigned to them & status should be pending_a or _qc
        3. If we found qc status also check user have in-progress document or not 
        Note:-
        1. Default priority:
            a) in_progress
            b) pending            
      */
      if (
        !defaultStatus ||
        defaultStatus == 'pending_a' ||
        defaultStatus == 'pending_qc'
      ) {
        if (role == 'analyst') {
          if (
            document.document_status == 'in_progress_a' &&
            document.user_id?._id == userId
          ) {
            defaultStatus = 'in_progress_a';
          } else if (
            document.document_status == 'pending_a' &&
            document.user_id?._id == userId
          ) {
            defaultStatus = 'pending_a';
          }
        } else if (role == 'qc') {
          if (
            document.document_status == 'in_progress_qc' &&
            document.user_id?._id == userId
          ) {
            defaultStatus = 'in_progress_qc';
          } else if (
            document.document_status == 'pending_qc' &&
            document.user_id?._id == userId
          ) {
            defaultStatus = 'pending_qc';
          }
        }
      }
    });
    for (let i = 0; i < tempStatusList.length; i++) {
      let status: any = false;
      if (tempStatusList[i]) {
        // Common Status
        switch (tempStatusList[i]) {
          case 'All':
            status = { status: tempStatusList[i], name: 'All' };
            break;
          case 'in-process':
          case 'uploaded':
          case 'Pending split':
          case 'Splitting completed':
          case 'Failed split':
          case 'Pending image conversion':
          case 'Failed image conversion':
          case 'Pending ocr classification':
          case 'Failed ocr classification':
          case 'Pending image classification':
          case 'Failed image classification':
          case 'Pending extraction':
          case 'Failed extraction':
          case 'Pending contextualization':
          case 'Failed contextualization':
          case 'Failedcontextualization':
          case 'pushed_to_target':
          case 'push_to_target':
          case 'completed_qc':
            status = { status: 'in-process', name: 'In Process' };
            break;
          case 'rejected_a':
            status = { status: tempStatusList[i], name: 'Rejected By Analyst' };
            break;
          case 'in_progress_qc':
            status = { status: tempStatusList[i], name: 'In Progress' };
            break;
          case 'rejected_qc':
            status = { status: tempStatusList[i], name: 'Rejected By QC' };
            break;
          case 'failed':
            status = { status: tempStatusList[i], name: 'Failed' };
            break;
          case 'completed_qc':
          case 'pushed_to_target':
            status = { status: tempStatusList[i], name: 'Completed' };
            break;
          default:
            break;
        }
        // If status not in common status then check with in role specific status
        if (!status) {
          if (role == 'analyst') {
            // Analyst Specific status
            switch (tempStatusList[i]) {
              case 'in_progress_a':
                status = { status: tempStatusList[i], name: 'In Progress' };
                break;
              case 'pending_a':
                status = { status: tempStatusList[i], name: 'Pending Review' };
                break;

              case 'pending_qc':
                status = { status: tempStatusList[i], name: 'Completed' };
                break;

              default:
                break;
            }
          } else if (role == 'qc') {
            // QC Specific status
            switch (tempStatusList[i]) {
              case 'in_progress_a':
                status = {
                  status: tempStatusList[i],
                  name: 'Analyst In-Progress',
                };
                break;
              case 'pending_a':
                status = { status: tempStatusList[i], name: 'Analyst Queue' };
                break;
              case 'in_progress_qc':
                status = { status: tempStatusList[i], name: 'In Progress' };
                break;
              case 'pending_qc':
                status = { status: tempStatusList[i], name: 'Pending Review' };
                break;
              default:
                break;
            }
          }
        }
        // If user have document in in_progress or pending status make select document status filter status
        if (defaultStatus == tempStatusList[i]) {
          status.default = true;
        }
        if (tempStatus.indexOf(status?.status) === -1) {
          tempStatus.push(status?.status);
          statusList.push(status);
        }
      }
    }
    // Check atleast one document in any one of the following status based on role
    /* 
    1. in_progress_a OR in_progress_q
    2. pending_a OR pending_q
    */
    if (role == 'analyst') {
      if (
        tempStatusList.indexOf('in_progress_a') == -1 &&
        tempStatusList.indexOf('pending_a') == -1
      ) {
        statusList[0].default = true;
        this.toastService.add({
          type: 'warning',
          message: 'No documents in Analyst queue',
        });
      }
    } else if (role == 'qc') {
      if (
        tempStatusList.indexOf('in_progress_qc') == -1 &&
        tempStatusList.indexOf('pending_qc') == -1
      ) {
        statusList[0].default = true;
        this.toastService.add({
          type: 'warning',
          message: 'No documents in QC queue',
        });
      }
    }
    this.commonService.setStausList(statusList);
  }
  ngOnDestroy(): void {
    this.subscriptionParentComponent.unsubscribe();
    this.subscriptionAssignee.unsubscribe();
    this.subscriptionProject.unsubscribe();
    this.subscriptionStatus.unsubscribe();
    this.subscriptionRefresh.unsubscribe();
  }
}
