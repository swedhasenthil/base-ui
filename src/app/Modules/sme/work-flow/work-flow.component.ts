import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
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
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss'],
})
export class WorkFlowComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  listWorkflowConfigData: any = [];
  docType_id: any;
  deleteDocumentName: any;

  @Output() editEmiter1 = new EventEmitter();
  @ViewChild('deleteModel') deleteModel: ElementRef;
  addWorkflow: any = {};
  documentTypeList: any = [];
  projectId: any;
  closeModel: any;
  selectedProjectName: any;
  destinationList: any;
  dropdownLists: any;
  selectedAdd: string;
  selectedName: any;
  document_type: any;
  workflowRules: any;
  boolean_workflow: any;
  allWorkflowRules: any = [];
  destination: any;
  workflow_name: any;
  document_type_avilable_in_rule: any = [];
  document_types: any = [];
  editButton: any;
  commonService: any;
  allProjects: any;
  constructor(
    public smeService: SmeService,
    public toastr: ToasterService,
    private router: Router,
    private sharedService: SharedService
  ) {

    this.docType_id = localStorage.getItem('docTypeId');
    this.selectedProjectName = localStorage.getItem('configerProjectName');
  }

  ngOnInit(): void {
    this.smeService.WorkflowObservable.subscribe((res) => {
      this.getWorkflowConfigurationsOfThisProject();
    });
    this.sharedService.smeMenuChanges();
    this.dtOptions = {
      order: [[0, 'desc']],
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, -1],
        [10, 20, 30, 'All'],
      ],
      retrieve: true,
      scrollX: true,
      scrollCollapse: true,
      columnDefs: [
        {
          targets: [5], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
    if (this.smeService.metaDataConfigureDoc) {
      this.docType_id = this.smeService.metaDataConfigureDoc?.docType_id;
      this.projectId = this.smeService.metaDataConfigureDoc?.docType_id;
    } else {
      this.router.navigate(['sme/workflow']);
    }
    if (this.smeService.projectDetails) {
      this.selectedProjectName =
        this.smeService.projectDetails.projectDetails['projectName'];
    }

    this.loadDestinationList();
    this.loadDocumentType();
    this.getWorkflowConfigurationsOfThisProject();
    this.getDropdownWorkflowList();
  }
  getDropdownWorkflowList() {
    this.smeService
      .getListWorkflowDropdownConfigData(this.docType_id)
      .subscribe((data: any) => {
        if (data) {
          this.dropdownLists = data;
        }
      });
  }
  loadDestinationList() {
    this.projectId = this.docType_id;

    this.smeService
      .getDestinationList(this.projectId)
      .subscribe((data: any) => {
        this.destinationList = data;
      });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getWorkflowConfigurationsOfThisProject() {
    this.smeService.getListWorkflowConfigData(this.docType_id).subscribe(
      (data: any) => {
        if (data) {
          this.listWorkflowConfigData = data;

          this.getWorkflowRules(data);

          this.projectId = data[0].project_id;
          this.rerender();
        }
      },
      (err: any) => {
      }
    );
  }
  getWorkflowRules(projectRules: any) {
    if (projectRules) {
      projectRules.forEach((rule: any) => {
        if (
          this.document_type_avilable_in_rule?.indexOf(
            rule?.document_type_id._id
          ) == -1
        ) {
          this.document_type_avilable_in_rule.push(rule?.document_type_id._id);
          this.document_types.push({
            id: rule?.document_type_id._id,
            document_type: rule?.document_type_id.document_type,
          });
        }

        this.allWorkflowRules.push(rule);
      });
    }
  }
  workflow_configuration_id: number;
  project_id: number;
  deleteWorkflowConfig(doc: any) {
    this.workflow_configuration_id = doc?._id;
    this.selectedName = doc.boolean_workflow;
    if (this.smeService.metaDataConfigureDoc) {
      this.project_id = this.smeService.metaDataConfigureDoc?.docType_id;
    } else {
      this.router.navigate(['sme/configure-projects']);
    }
  }

  onDeleteButtonClick() {
    this.smeService
      .deleteWorkflowConfigDocument(
        this.project_id,
        this.workflow_configuration_id
      )
      .subscribe(
        (data) => {
          if (data) {
            this.listWorkflowConfigData = data;
          }
          this.toastr.add({
            type: 'success',
            message: 'Workflow deleted successfully',
          });
          this.getWorkflowConfigurationsOfThisProject();
          this.deleteModel.nativeElement.click();
        },
        (err) => {

          this.toastr.add({
            type: 'error',
            message: 'Document type cannot be deleted',
          });

        }
      );
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

  onCheckboxStatusChange(index: any, wfc: any, e: any) {
    if (e.target.checked) {
      this.listWorkflowConfigData[index].is_active = true;
    } else {
      this.listWorkflowConfigData[index].is_active = false;
    }
    const workflowConfigData = {
      _id: wfc._id,
      is_active: e.target.checked,
    };

    this.smeService
      .editWorkflowDataApi(this.docType_id, wfc._id, workflowConfigData)
      .subscribe(
        (data: any) => {
          if (data) {
            this.listWorkflowConfigData = data;
          }
          this.getWorkflowConfigurationsOfThisProject();
          this.toastr.add({
            type: 'success',
            message: data?.message,
          });
        },
        (err) => {
          this.toastr.add({
            type: 'error',
            message:
              err?.error?.message || 'Could not create workflow configuration',
          });
          this.listWorkflowConfigData[index].is_active =
            !this.listWorkflowConfigData[index].is_active;
        }
      );
  }

  editWorkflow(doc: any) {
    this.addWorkflow.documentType = doc.document_type_id._id;
    this.addWorkflow.destination = doc.destination;
    this.addWorkflow.booleanWorkflow = doc.boolean_workflow;
    this.addWorkflow.workflowName = doc.workflow_name;
    this.addWorkflow.id = doc._id;
    this.document_type = doc?.document_type_id?._id;
    this.workflow_configuration_id = doc?._id;

    this.filterRules(this.document_type);

    this.workflow_configuration_id = doc?._id;
    this.destination = doc?.destination;
    this.workflow_name = doc?.workflow_name;
    this.boolean_workflow = doc?.boolean_workflow;
  }
  reset() {
    this.addWorkflow = {};
  }
  filterRules(event: any) {
    this.document_type = event;
    this.boolean_workflow = '';
    this.workflowRules = [];
    this.allWorkflowRules.forEach((rule: any) => {
      if (rule.document_type_id._id == this.document_type) {
        this.workflowRules.push({
          rule: rule.rule_name,
          document_type: rule.document_type_id.document_type,
          document_type_rule:
            rule.document_type_id.document_type + '.' + rule.rule_name,
        });
      }
    });
  }

  addNewWorkflow(): any {
    if (
      !this.addWorkflow.documentType ||
      !this.addWorkflow.destination ||
      !this.addWorkflow.booleanWorkflow ||
      !this.addWorkflow.workflowName
    ) {
      this.toastr.add({
        type: 'warning',
        message: 'Enter values',
      });
      return;
    }
    const bw = this.smeService.getFormattedBooleanWorkflowInputForValidation(
      this.addWorkflow.booleanWorkflow
    );
    if (!this.smeService.isValidBooleanWorkflow(bw)) {
      this.toastr.add({
        type: 'error',
        message: 'Please enter valid workflow',
      });
      return false;
    }
    const newWorkflow: any = {
      _id: this.addWorkflow.id ? this.addWorkflow.id : null,
      project_id: this.projectId,
      is_active: true,
      workflow_name: this.addWorkflow.workflowName,
      boolean_workflow: this.addWorkflow.booleanWorkflow,
      boolean_workflow_rules: null,
      destination: this.addWorkflow.destination,
      document_type_id: this.addWorkflow.documentType,
    };

    this.smeService.addNewWorkflow(this.projectId, newWorkflow).subscribe(
      (res: any) => {
        this.toastr.add({
          type: 'success',
          message: 'Workflow added successfully',
        });
        setTimeout(() => {
          this.getWorkflowConfigurationsOfThisProject();
        }, 500);
      },
      (err) => {
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
      }
    );
  }
  editedWorkflow(): any {
    if (
      !this.addWorkflow.documentType ||
      !this.addWorkflow.destination ||
      !this.addWorkflow.booleanWorkflow ||
      !this.addWorkflow.workflowName
    ) {
      this.toastr.add({
        type: 'warning',
        message: 'Enter values',
      });
      return;
    }
    const bw = this.smeService.getFormattedBooleanWorkflowInputForValidation(
      this.addWorkflow.booleanWorkflow
    );
    if (!this.smeService.isValidBooleanWorkflow(bw)) {
      this.toastr.add({
        type: 'error',
        message: 'Please enter valid workflow',
      });
      return false;
    }
    const newWorkflow: any = {
      _id: this.addWorkflow.id ? this.addWorkflow.id : null,
      project_id: this.projectId,
      is_active: true,
      workflow_name: this.addWorkflow.workflowName,
      boolean_workflow: this.addWorkflow.booleanWorkflow,
      boolean_workflow_rules: null,
      destination: this.addWorkflow.destination,
      document_type_id: this.addWorkflow.documentType,
    };

    this.smeService
      .editWorkflowDataApi(this.projectId, this.addWorkflow.id, newWorkflow)
      .subscribe(
        (res: any) => {
          location.reload();
          this.router.navigate(['sme/configure-projects']);
          this.toastr.add({
            type: 'success',
            message: 'Workflow updated successfully',
          });
        },
        (err: any) => {
          this.toastr.add({
            type: 'error',
            message: err.error.message,
          });
        }
      );
  }
  loadDocumentType() {
    this.smeService.getDocumentType().subscribe((res) => {
      this.documentTypeList = res;
    });
  }
  flowEdit(flow: any) {}
  addOrEdit(value: any) {
    if (value === 'Add') {
      this.selectedAdd = 'Add new';
      this.editButton = true;
    } else {
      this.selectedAdd = 'Edit';
      this.editButton = false;
    }
  }
}
