import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  ComponentFactoryResolver,
  ViewContainerRef,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { UntypedFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-configure-projects',
  templateUrl: './configure-projects.component.html',
  styleUrls: ['./configure-projects.component.scss'],
})
export class ConfigureProjectsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isClicked: boolean = false;
  roleId: any;
  projects: any;
  masterJsonArr: any = [];
  selectedDocType: any;
  selectedMasterIndex: number;
  fetchedData: any = [];
  types: any = [];
  docArray: any = [];
  docId: any;
  attributeLength: any;
  requestPayload: any;
  typeText: any;
  projectId: any;
  docTypeUnderProject: any = [];
  dataIndex: number;
  isData: boolean;
  UniqueTypeArr: any = [];
  uniqueDocTypeSelection: any = [];
  fetchedStatus: string;
  editArray: any = [];
  attrIndex: any;
  attributes: any = [];
  constructor(
    private api: SmeService,
    private toastr: ToasterService,
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
  ) {
  }
  progressBar = document.querySelector('.progress-bar');

  ngOnInit(): void {
    this.sharedService.smeMenuChanges();
    this.roleId = localStorage.getItem('currentUserRoleId');
    this.loadDocType();
    this.loadProjects();
  }
  /**
    * @desc load all projects onload
    */
  loadProjects() {
    this.dtOptions = {
      order: [[0, 'desc']],
      pagingType: 'full_numbers',
      pageLength: 5,
      destroy: true,
      lengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, 'All'],
      ],
    };
    this.api.getProjectList({ role_id: this.roleId }).subscribe(
      (result) => {
        const list: any = result;
        this.projects = list;
        this.masterJsonArr = [];
        if (this.projects.length) {
          list.forEach((element: any) => {
            const master = {
              projectUid: element._id,
              projectName: element.project_name,
              projectDesc: element.project_description,
              destinationArr: '',
              isExpanded: '',
              startDate: element.start_date,
              status: element.status,
              user_group_status: element.user_group_status,
              edit: 'false',
              submit_docs_for_review: element.submit_docs_for_review,
              analyst_bypass: element.analyst_bypass,
              preview_image: element.preview_image,
              qc_percent: element.qc_percent,
              state: element.state,
              processedDoc: element.number_of_documents,
              attributesArr: [],
              newAttribute: {},
            };
            this.masterJsonArr.push(master);
          });
          for (let index = 0; index < this.projects.length; index++) {
            this.masterJsonArr[index].newAttribute['docTypes'] = [];
            this.masterJsonArr[index].newAttribute['documentName'] =
              this.selectedDocType;
            this.masterJsonArr[index].newAttribute['description'] = '';
            this.masterJsonArr[index].newAttribute['status'] = 'Pending';
            this.masterJsonArr[index]['isExpanded'] = 'false';
            this.masterJsonArr[index].newAttribute['attrLength'] = '';
          }
          if (this.selectedMasterIndex >= 0) {
            setTimeout(() => {
              this.masterJsonArr[this.selectedMasterIndex]['isExpanded'] =
                'true';
            }, 1500);
          }
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }
  /**
    * @desc load all doctype under a project
    */
  loadDocType() {
    this.api.getDocumentType().subscribe(
      (type) => {
        const data: any = type;
        this.fetchedData = data;
        if (this.fetchedData.length) {
          data.forEach((element: any) => {
            this.types.push(element.document_type);
            const documentselectedjson = {
              docType: element.document_type,
              docId: element._id,
            };
            this.docArray.push(documentselectedjson);
          });
          this.docId = this.docArray[0].docId;
          this.selectedDocType = this.types[0];
          this.attributeLength = this.fetchedData[0].attributes.length;
        }
      }
    );
  }
  /**
    * @desc  expand table
    */
  expand(masterIndex: any, value: any) {
    if (this.masterJsonArr[masterIndex]['isExpanded'] === 'true') {
      this.masterJsonArr[masterIndex]['isExpanded'] = 'false';
    } else {
      for (let index = 0; index < this.masterJsonArr.length; index++) {
        if (index === masterIndex) {
          this.masterJsonArr[masterIndex]['isExpanded'] = 'true';
        } else {
          this.masterJsonArr[index]['isExpanded'] = 'false';
        }
      }
    }
  }
  /**
    * @desc document type decription under a project 
    */
  descChange(desc: any, masterIndex: any) {
    const request = {
      id: this.masterJsonArr[masterIndex].projectUid,
      project_description: desc,
    };
    this.api.updatedProjectDocument(request, "Description")
  }
  /**
    * @desc on change of toggle button in analyst bypass
    */
  analystBypassChange(inputElement: any, masterIndex: any) {
    const request: any = {
      id: this.masterJsonArr[masterIndex].projectUid,
    };
    let value = 'analyst_bypass';
    if (inputElement.checked) {
      request[value] = 'true';
    } else {
      request[value] = 'false';
    }
    this.api.updatedProjectDocument(request, "Bypass Analyst")
  }
  /**
    * @desc on change of toggle button in Review Status 
    */
  reviewStatusChange(inputElement: any, masterIndex: any) {
    const request: any = {
      id: this.masterJsonArr[masterIndex].projectUid,
    };
    if (inputElement.checked) {
      request['submit_docs_for_review'] = true;
    } else {
      request['submit_docs_for_review'] = false;
    }
    this.api.updatedProjectDocument(request, "Review Status")
  }
  /**
  * @desc  on change of toggle button in preview image
  */
  previewImageChange(inputElement: any, masterIndex: string | number) {
    const request = {
      id: this.masterJsonArr[masterIndex].projectUid,
      preview_image: inputElement.value,
    };
    this.api.updatedProjectDocument(request, "Preview Image")
  }
  /**
    * @desc  on change of toggle button in qc percent
    */
  qcPercentChange(inputElement: any, masterIndex: string | number) {
    const request = {
      id: this.masterJsonArr[masterIndex].projectUid,
      qc_percent: inputElement,
    };
    this.api.updatedProjectDocument(request, "Qc Percent")
  }
  /**
  * @desc  on click of action button start/pause
  */
  onActionButtonClick(state: string, masterIndex: string | number) {
    if (state == 'Start') {
      this.requestPayload = {
        id: this.masterJsonArr[masterIndex].projectUid,
        state: 'Pause',
      };
    }
    if (state == 'Pause') {
      this.requestPayload = {
        id: this.masterJsonArr[masterIndex].projectUid,
        state: 'Start',
      };
    }
    this.api.updatedProjectDocument(this.requestPayload, "On Action");
  }
  /**
   * @desc     lists all document type on click
   */
  projectClicked(data: any, masterIndex: string | number, value: any) {
    if (value) {
      this.typeText = value;
    } else {
      this.typeText = data.target.text;
    }
    this.masterJsonArr[masterIndex].attributesArr.length = 0;
    this.projects.forEach((element: any) => {
      if (this.typeText === element.project_name) {
        this.projectId = element.projectUid;
      }
    });
    this.api.getDocTypeUnderProject(value.projectUid).subscribe(
      (reslt: any) => {
        this.docTypeUnderProject = reslt;

        for (let index = 0; index < this.masterJsonArr.length; index++) {
          if (this.masterJsonArr[index].projectUid === value.projectUid) {
            this.dataIndex = index;
          }
        }

        this.masterJsonArr[this.dataIndex].attributesArr = [];
        if (this.docTypeUnderProject.length) {
          this.isData = true;
          this.UniqueTypeArr.length = 0;
          this.selectedDocType = [];
          this.docId = [];
          for (let j = 0; j < this.docTypeUnderProject.length; j++) {
            const uniqueTypes =
              this.docTypeUnderProject[j].document_type_id.document_type;
            if (uniqueTypes) {
              this.UniqueTypeArr.push(uniqueTypes);
              this.uniqueDocTypeSelection = this.types;
              this.uniqueDocTypeSelection = this.uniqueDocTypeSelection.filter(
                (el: any) => !this.UniqueTypeArr.includes(el)
              );
              this.masterJsonArr[this.dataIndex].newAttribute['docTypes'] =
                this.uniqueDocTypeSelection;
              this.fetchedData.forEach((element: { document_type: any; _id: any; documentName: any; attributes: string | any[]; }) => {
                if (this.uniqueDocTypeSelection[0] === element.document_type) {
                  this.docId = element._id;
                  this.selectedDocType = element.documentName;
                  this.attributeLength = element.attributes.length;
                  this.masterJsonArr[this.dataIndex].newAttribute[
                    'attrLength'
                  ] = this.attributeLength;
                }
              });
              this.masterJsonArr[masterIndex].newAttribute['documentName'] =
                this.uniqueDocTypeSelection[0];
            }
            if (this.docTypeUnderProject[j].attributes) {
              this.fetchedStatus = 'Done';
            } else {
              this.fetchedStatus = 'Pending';
            }
            const json: any = {
              documentName: this.docTypeUnderProject[j].document_type_id.document_type,
              status: this.fetchedStatus,
              _id: this.docTypeUnderProject[j]._id,
              document_type_id: this.docTypeUnderProject[j].document_type_id._id,
              project_id: this.docTypeUnderProject[j].project_id,
              action: 'true',
              progress: 'false',
              completed: '',
              attrLength: this.docTypeUnderProject[j].attributes.length,
              description: this.docTypeUnderProject[j].document_type_description,
              attributeList: this.docTypeUnderProject[j].document_type_id.attributes,

            };
            this.editArray = [];
            for (let x = 0; x < this.docTypeUnderProject[j].attributes.length; x++) {
              const attrTempArray = {
                attribute_name: this.docTypeUnderProject[j].attributes[x].attribute_name,
                data_type: this.docTypeUnderProject[j].attributes[x].data_type,
                threshold: (this.docTypeUnderProject[j].attributes[x].threshold * 100).toFixed(0),
                upper_limit: this.docTypeUnderProject[j].attributes[x].upper_limit,
                lower_limit: this.docTypeUnderProject[j].attributes[x].lower_limit,
                length: this.docTypeUnderProject[j].attributes[x].length,
                reference_data_id: this.docTypeUnderProject[j].attributes[x].reference_data_id
              };
              this.editArray.push(attrTempArray);
            }
            json['attrArray'] = this.editArray;
            this.masterJsonArr[this.dataIndex].attributesArr.push(json);
            this.attrIndex =
              this.masterJsonArr[this.dataIndex].attributesArr.length;
          }
          this.masterJsonArr[this.dataIndex].attributesArr[this.attrIndex - 1][
            'add'
          ] = true;
          this.masterJsonArr[this.dataIndex].attributesArr[this.attrIndex - 1][
            'delete'
          ] = true;
        } else {
          this.isData = false;
          this.uniqueDocTypeSelection = this.types;
          this.selectedDocType = this.types[0];
          this.fetchedData.forEach((element: { document_type: any; attributes: never[]; }) => {
            if (this.selectedDocType === element.document_type) {
              this.attributes = element.attributes;
            }
          });
          this.masterJsonArr[this.dataIndex].newAttribute['docTypes'] =
            this.uniqueDocTypeSelection;
          this.masterJsonArr[this.dataIndex].newAttribute['attrLength'] =
            this.fetchedData[0].attributes.length;
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }
  /**
   * @desc  naviagte to workflow page
   */
  onActionWorkflow(lists: any) {
    this.api.metaDataConfigureDoc = {
      docType_id: lists?.projectUid,
    }
    localStorage.setItem("configerProjectName", lists.projectName)
    localStorage.setItem("docTypeId", lists.projectUid)
    this.router.navigate(['sme/workflow']);
  }
}
