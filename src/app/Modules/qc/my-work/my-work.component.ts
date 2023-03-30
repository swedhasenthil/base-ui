import { Component, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.scss'],
})
export class MyWorkComponent implements OnInit {
  displayList: boolean = true;

  /* Subscriptions varables start */
  subscriptionProject: Subscription;
  /* Subscriptions varables end */

  selectedProject: any;
  selectedAssignee: any;
  selectedDocumentStatus: any;
  @Output() statusOptions: any;

  listOfDocumentStatus: any = [
    { status: 'in_progress', name: 'InProgress' },
    { status: 'completed', name: 'Completed Review' },
    { status: 'pending_review', name: 'Pending Review' },
  ];

  // List Document variables
  taskAssignmentType: any = 'Manual';
  isTaskAssignmentManual: Boolean = false;

  constructor(
    private commonService: CommonService,
    private sharedService: SharedService
  ) {

    // After proper routing delete below line
    this.commonService.setParentComponent('qc');

    this.subscriptionProject = this.sharedService.currentProject.subscribe(
      (project) => {
        if (project?.taskAssignment) {
          project.taskAssignment == 'Manual'
            ? (this.isTaskAssignmentManual = true)
            : (this.isTaskAssignmentManual = false);
        }
      }
    );
  }

  ngOnInit(): void {
    if (this.taskAssignmentType == 'Manual') {
      this.isTaskAssignmentManual = true;
    }
  }

  ngDoCheck(): void {
    // Document list payload Object
    this.statusOptions = {
      project: this.selectedProject,
      assignee: this.selectedAssignee,
      document_status: this.selectedDocumentStatus,
    };
  }

  /* Get selected project from shared/component/project-filter component through event Emitter */
  getSelectedProject(project: any) {
    this.selectedProject = project;
  }

  /* Get selected Assign from shared/component/assignee-filter component through event Emitter */
  getSelectedAssignee(assigne: any) {
    this.selectedAssignee = assigne;
  }

  /* Get selected Document Status from shared/component/document-status-filter component through event Emitter */
  getSelectedDocumentStatus(status: any) {
    this.selectedDocumentStatus = status;
  }

  /* Refresh table data based on filter result */
  reloadPage() {
    this.commonService.refreshTable();
  }

  ngOnDestroy(): void {
    this.subscriptionProject.unsubscribe();
  }
}
