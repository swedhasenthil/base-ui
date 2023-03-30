import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ManagerService } from '../../manager.service';
const NON_ASSIGNABLE_STATUSES = ['completed_qc', 'failed', 'in-process', 'pushed_to_target', 'uploaded'];
const ROLES_FOR_DOCS_WAITING_ANALYST_REVIEW = ['Analyst L1', 'Analyst L2', 'QC L1', 'QC L2'];
const ROLES_FOR_DOCS_WAITING_QC_REVIEW = ['Analyst L1', 'Analyst L2', 'QC L1', 'QC L2'];
const SUCCESS_CODE = 'success';
const WARNING_CODE = 'warning';
const INPROGRESS_CODE = 'in_progress';
const ERROR_CODE: any = 'failed';
const ANALYST_ROLE_IDS: any = [];
const QC_ROLE_IDS: any = [];
const ANALYST_ROLES = ['Analyst L1', 'Analyst L2'];
const QC_ROLES = ['QC L1', 'QC L2'];

@Component({
  selector: 'app-manage-assign-user',
  templateUrl: './manage-assign-user.component.html',
  styleUrls: ['./manage-assign-user.component.scss']
})
export class ManageAssignUserComponent implements OnInit {
  // [x: string]: any;
  selectedDocument: any;
  roles: any[];
  actionTitle: string;
  actionButtonLabel: string;
  allAssignees: any;
  assignees: any[];
  role: any;
  rolesForDocsWaitingForAnalystReview: any[];
  rolesForDocsWaitingForQcReview: any[];
  assignUserModalForm: any;
  hasLockedDocuments: boolean;
  selectedRoleId: any = "";
  selectedUserId: any = "";
  selectedForce: any;
  isDocLocked: boolean;
  doucment: any;
  selectedIndex: any; statusFilter: any[];
  selectedStatus: any;
  userId: any;
  primaryTaskTable: any;
  docStatusMetaData: any;
  loggedUser: string | null;
  selectedProjectId: any;
  loggedInUsername: string | null;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  documents: any;
  documentList: any;
  sknList: never[];
  displaySelect: string;
  roleId: any;
  getAllProjects: any[];
  selectedProject: any;
  selectedProjectName: any;
  constructor(private authService: AuthService,
    public managerService: ManagerService,
    public toastService: ToasterService,
    public sharedService: SharedService) {
}

  ngOnInit(): void {
    this.sharedService.managerMenuChanges();
    this.roleId = localStorage.getItem("currentUserRoleId")
    this.userId = localStorage.getItem('currentUserId');
    this.managerService.listProjects({ role_id: this.roleId })
      .subscribe((data: any) => {
        if (data[0]) {
          this.getAllProjects = data;
          this.getAllProjects = this.getAllProjects.map((project) => {
            let tempProject: any = {};
            tempProject['id'] = project._id;
            tempProject['projectName'] = project.project_name;
            return tempProject;
          });
        }
        this.selectedProject = this.getAllProjects[0];
        this.selectedProjectId = this.selectedProject.id;
        this.selectedProjectName = this.selectedProject.projectName
        },
        (err: { status: any; }) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          this.toastService.add({
            type: 'error',
            message: 'Error occurred while fetching list of projects'
          });
        }
      );
    this.managerService.documentUser.subscribe(res => {
      this.doucment = res;

      this.configureAssignmentLookup(this.doucment)
    })
    this.getRoles();
  }

  /**
   * @desc fetcing the role list information
   */
  getRoles() {
    this.managerService.getRoles().subscribe((roles: any) => {
      this.rolesForDocsWaitingForAnalystReview = [];
      this.rolesForDocsWaitingForQcReview = [];
      roles.forEach((role: any) => {
        if (ROLES_FOR_DOCS_WAITING_ANALYST_REVIEW.includes(role.role_name)) {
          this.rolesForDocsWaitingForAnalystReview.push(role);
        }
        if (ROLES_FOR_DOCS_WAITING_QC_REVIEW.includes(role.role_name)) {
          this.rolesForDocsWaitingForQcReview.push(role);
        }

        if (ANALYST_ROLES.includes(role.role_name)) {
          ANALYST_ROLE_IDS.push(role._id);

          
        }

        if (QC_ROLES.includes(role.role_name)) {
          QC_ROLE_IDS.push(role._id);
        }
      });
    },
      (error: any) => {
        if (this.authService.isNotAuthenticated(error.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });

      })
  }

  /**
   * @desc Assign and Reassing Action title,button
   */
  configureAssignmentLookup(document: any) {
    this.selectedDocument = document;
    if (document.document_status.includes('_qc')) {
      this.roles = this.rolesForDocsWaitingForQcReview;
    } else {
      this.roles = this.rolesForDocsWaitingForAnalystReview;
    }
    this.roles.sort((a, b) => (a.role_name > b.role_name) ? 1 : ((b.role_name > a.role_name) ? -1 : 0));

    if (document?.user_id?._id) {
      this.actionTitle = 'Reassign User';
      this.actionButtonLabel = 'Re-Assign';
    } else {
      this.actionTitle = 'Assign User';
      this.actionButtonLabel = 'Assign';
    }
    this.reset();
    this.assignees = [];
    this.isDocLocked = false;
    this.managerService.fetchADocumentById(document._id).subscribe((doc: any) => {
      if (doc[0]?.is_locked == true) {
        this.isDocLocked = true;
      }
    }, (error: any) => {
      if (this.authService.isNotAuthenticated(error.status)) {
        this.authService.clearCookiesAndRedirectToLogin();
        return;
      }
      this.toastService.add({
        type: 'error',
        message: 'Something went wrong, could not process your request'
      });
    })
  }

  reset() {
    this.selectedRoleId = '';
    this.selectedUserId = ''
  }

  /**
   * @desc assigning and reassing consuming API
   */
  assignOrReassign(): void {
    if (this.selectedDocument?.user_id?._id) {
      // invoke reassign API
      const forceReassign = this.selectedForce
      const payload = {
        'document_id': this.selectedDocument?._id,
        'user_id': this.selectedUserId,
        'role_to_be_assigned': this.selectedRoleId,
        'force_reassign': forceReassign
      }
      this.managerService.reAssignUserToThisDocument(payload)
        .subscribe((updatedDoc: any) => {
          this.toastService.add({
            type: 'success',
            message: "User has been re-assigned to this document"
          });
          this.removeHighlightingTheRow();
          this.sharedService.getAllNotificationsOfUser(false)

        }, (error) => {
          if (this.authService.isNotAuthenticated(error.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          this.toastService.add({
            type: 'error',
            message: 'Something went wrong, could not process your request'
          });
        })
    } else {
      // invoke assign API
      const payload = {
        'document_id': this.selectedDocument?._id,
        'user_id': this.selectedUserId,
        'role_to_be_assigned': this.selectedRoleId
      }
      this.managerService.assignUserToThisDocument(payload)
        .subscribe((updatedDoc: any) => {
          this.toastService.add({
            type: 'success',
            message: "User has been assigned to this document"
          });
          this.removeHighlightingTheRow();
          if (this.selectedUserId === this.userId) {
            this.sharedService.getAllNotificationsOfUser(false)
          }
          else {
            this.sharedService.getAllNotificationsOfUser(true)

          }
        },
          (error) => {
            if (this.authService.isNotAuthenticated(error.status)) {
              this.authService.clearCookiesAndRedirectToLogin();
              return;
            }
            this.toastService.add({
              type: 'error',
              message: 'Something went wrong, could not process your request'
            });
          })
    }
  }

  removeHighlightingTheRow(): void {
    this.selectedIndex = -1;
  }

 /**
   * @desc updating the status to status coloum
   */
  filterStatus(val: any) {
    this.selectedStatus = val;
    this.primaryTaskTable = [];
    if (this.selectedStatus == 'All') {
      this.primaryTaskTable = this.documents;
      this.displaySelect = 'All'
    } else if (this.selectedStatus != 'All') {

      for (let i = 0; i < this.documents.length; i++) {
        if (this.documents[i].document_status == this.selectedStatus) {
          this.primaryTaskTable.push(this.documents[i]);
        }
      }
    }
    if (this.selectedStatus == 'in_progress_a') {
      this.displaySelect = 'In Progress';
    }
    if (this.selectedStatus == 'pending_a') {
      this.displaySelect = 'Pending Review';
    }
    if (this.selectedStatus == 'failed') {
      this.displaySelect = 'failed';
    }
    if (this.selectedStatus == 'rejected_a') {
      this.displaySelect = 'Rejected';
    }
    if (this.selectedStatus == 'in-process' || this.selectedStatus == 'uploaded' || this.selectedStatus == 'Pending split' ||
      this.selectedStatus == 'Splitting completed' || this.selectedStatus == 'Failed split' ||
      this.selectedStatus == 'Pending image conversion' || this.selectedStatus == 'Failed image conversion' ||
      this.selectedStatus == 'Pending ocr classification' || this.selectedStatus == 'Failed ocr classification' ||
      this.selectedStatus == 'Pending image classification' || this.selectedStatus == 'Failed image classification' ||
      this.selectedStatus == 'Pending extraction' || this.selectedStatus == 'Failed extraction' ||
      this.selectedStatus == 'Pending contextualization' || this.selectedStatus == 'Failed contextualization') {
      this.displaySelect = 'In Queue';
    }
    if (this.selectedStatus == 'pending_qc' || this.selectedStatus == 'in_progress_qc' || this.selectedStatus == 'pushed_to_target' || this.selectedStatus == 'completed_qc'
    ) {
      this.displaySelect = 'Completed';
    }
  }

  /**
   * @desc updating assign or non assign status
   */
  getActionLabel(document: any) {
    if (NON_ASSIGNABLE_STATUSES.includes(document.document_status)) {
      return 'NA'
    }
    return document?.user_id ? 'reassign' : 'assign';
  }

  /**
   * @desc fetch user role for project 
   */
  fetchUserForThisRoleForAProject(value: any) {
    const roleId = value.target.value;
    this.selectedRoleId = roleId
    this.managerService.fetchUsersOfGivenRoleAndProject(roleId, this.selectedProjectId).subscribe((assignees: any) => {
      this.allAssignees = assignees;
      this.assignees = this.getFilteredAssignees(assignees);
    }, (error: { status: any; error: { message: string | undefined; }; }) => {
      if (this.authService.isNotAuthenticated(error.status)) {
        this.authService.clearCookiesAndRedirectToLogin();
        return;
      }
      this.toastService.add({
        type: 'error',
        message: 'Something went wrong, could not process your request'
      });
    });
  }

  /**
   * @desc assinee user
   */
  getFilteredAssignees(assignees: any): Array<Object> {
    let filteredAssignees = [];
    const existingAssigneeUserId = this.selectedDocument?.user_id?._id;
    if (existingAssigneeUserId) {
      filteredAssignees = assignees.filter((assignee: { _id: any; }) => assignee._id != existingAssigneeUserId);
    } else {
      filteredAssignees = assignees;
    }
    return filteredAssignees;
  }


}

