import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from '../manager.service';
import { MomentInput } from 'moment';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
const NON_ASSIGNABLE_STATUSES = ['completed_qc', 'failed', 'in-process', 'pushed_to_target', 'uploaded'];
const PENDING_STATUSES = ['pending_a', 'pending_qc'];
const IN_PROGRESS_STATUSES = ['in_progress_a', 'in_progress_qc'];
const REJECTED_STATUSES = ['rejected_a', 'rejected_qc'];
const COMPLETED_STATUSES = ['completed_qc', 'pushed_to_target'];

const ANALYST_ROLES = ['Analyst L1', 'Analyst L2'];
const QC_ROLES = ['QC L1', 'QC L2'];

const ANALYST_ROLE_IDS: any= [];
const QC_ROLE_IDS:any = [];

const ROLES_FOR_DOCS_WAITING_ANALYST_REVIEW = ['Analyst L1', 'Analyst L2', 'QC L1', 'QC L2'];
const ROLES_FOR_DOCS_WAITING_QC_REVIEW = ['Analyst L1', 'Analyst L2','QC L1', 'QC L2'];
const SUCCESS_CODE = 'success';
const WARNING_CODE = 'warning';
const INPROGRESS_CODE = 'in_progress';
const ERROR_CODE:any = 'failed';

@Component({
  selector: 'app-manager-task',
  templateUrl: './manager-task.component.html',
  styleUrls: ['./manager-task.component.scss']
})
export class ManagerTaskComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  getAllProjects: any[];
  selectedProject: any;
  loggedUser: string | null;
  selectedProjectId: any;
  loggedInUsername: string | null;
  assignUserModalForm: any;
  hasLockedDocuments: boolean;
  overlay: any;
  analystService: any;
  documents: any;
  primaryTaskTable: any;
  docStatusMetaData: any;
  statusFilter:any[];
  selectedStatus: any;
  rolesForDocsWaitingForAnalystReview: any[];
  rolesForDocsWaitingForQcReview: any[];
  ana_roles_id: any;
  qc_roles_id: any;
  roleId: any;
  documentList: any;
  documentTimeline: any;
  selectedProjectName: any;
  documentListFlag: boolean;
  getTaskFlag: boolean;
  displayTimerFlag: boolean;
  sknList: never[];
  displaySelect: string;
  selectedIndex: any;
  selectedDocument: any;
  roles: any[];
  actionTitle: string;
  actionButtonLabel: string;
  allAssignees: any;
  assignees: any[];
  role: any;
  selectedRoleId: any="";
  selectedUserId: any="";
  selectedForce: any;
  isDocLocked: boolean;
  iconInfo: any;
  userId:any;
  constructor(  
    public authService: AuthService,
    private managerService: ManagerService,
    private fb: FormBuilder,
    public toastService:ToasterService,
    public sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.managerMenuChanges();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve:true,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
      scrollX: true, scrollCollapse: true,
            columnDefs:  [ {
				'targets': [6], // column index (start from 0)
				'orderable': false, // set orderable false for selected columns
			 },
      {targets:[3,4],type:'date'}],
    };
    this.roleId = localStorage.getItem("currentUserRoleId")
    this.userId = localStorage.getItem('currentUserId');
    this.managerService.listProjects({role_id:this.roleId})
    .subscribe((data: any) => {
      if (data[0]) {
        this.getAllProjects = data;
        this.getAllProjects = this.getAllProjects.map((project) => {
          let tempProject:any = {};
          tempProject['id'] = project._id;
          tempProject['projectName'] = project.project_name;
          return tempProject;
        });
      }
      this.selectedProject = this.getAllProjects[0];
      this.selectedProjectId = this.selectedProject.id;
      this.selectedProjectName = this.selectedProject.projectName

      this.getDocumentsOfProject();
      this.loggedUser = localStorage.getItem('user');

      this.loggedInUsername = localStorage.getItem('userName')
        ? localStorage.getItem('userName')
        : 'default user';
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

  this.assignUserModalForm = {
    role:'',
    user: '',
    forceReassign: ''
  }
  this.getRoles();
  }
// get document of the specified project
getDocumentsOfProject() {
  this.hasLockedDocuments = false;
  // this.overlay.activateOverlay(true, 'sk-circle');
  const request = {
    project_id: this.selectedProjectId,
  };
  this.managerService.getProjectDocument(request).subscribe(
    (response:any) => {
      var tempStatus = [];
      const projectPerformanceResponse: any = response;
      this.primaryTaskTable = projectPerformanceResponse.data;
      this.dtTrigger.next(null);

      this.documents = this.primaryTaskTable;
      this.docStatusMetaData = projectPerformanceResponse.meta_data;
      this.documentList = true
 

      // this.rerender();
      // filter by status dropdown
      for (let i = 0; i < this.documents.length; i++) {
        this.documents[i].action_label = this.getActionLabel(this.documents[i]);
        if(this.documents[i].is_locked == true) {
          this.hasLockedDocuments = true;
        }
        if (this.documents[i].document_status) {
          const json = {
            status: this.documents[i].document_status,
            name: '',
          };
          tempStatus.push(json);
        }
      }
      tempStatus.forEach((element) => {
        if (element.status == 'in_progress_a' || element.status == 'in_progress_qc') {
          element.name = 'In Progress';
        }
        if (element.status == 'pending_a' || element.status == 'pending_qc') {
          element.name = 'Pending Review';
        }
        if (element.status == 'rejected_a' || element.status == 'rejected_qc') {
          element.name = 'Rejected';
        }
        if (element.status == 'in-process' || element.status == 'uploaded' ||  element.status == 'Pending split' ||
            element.status == 'Splitting completed' ||element.status == 'Failed split' ||
            element.status == 'Pending image conversion' ||element.status == 'Failed image conversion' ||
            element.status == 'Pending ocr classification' || element.status == 'Failed ocr classification' ||
            element.status == 'Pending image classification' ||element.status == 'Failed image classification' ||
            element.status == 'Pending extraction' ||element.status == 'Failed extraction' ||
            element.status == 'Pending contextualization' || element.status == 'Failed contextualization' ) {
            element.name = 'In Queue';
        }
        if (element.status == 'pushed_to_target' ||element.status == 'completed_qc'
        ) {
          element.name = 'Completed';
        }
      });
      let mymap = new Map();
      this.statusFilter = tempStatus.filter((el) => {
        const val = mymap.get(el.name);
        if (val) {
          if (el.status < val) {
            mymap.delete(el.name);
            mymap.set(el.name, el.status);
            return true;
          } else {
            return false;
          }
        }
        mymap.set(el.name, el.status);
        return true;
      });
 
       if( this.selectedStatus = 'All'){
        this.filterStatus(this.selectedStatus);
       }

      if (this.documents.length===0) {
      	this.toastService.add({
          type: 'info',
          message: 'No documents in queue'
        });
      }
    },
    (err) => {
      if (this.authService.isNotAuthenticated(err.status)) {
        this.authService.clearCookiesAndRedirectToLogin();
        return;
      } 
      this.toastService.add({
        type: 'error',
        message: 'Error'
      });
    }
  );
}
unlockThisProjectDocs(): void {
  this.iconInfo = "toast-custom"
  this.managerService.unlockThisProjectDocs(this.selectedProjectId).subscribe((result:any)=>{
    return result?.nModified ? this.toastService.add({
      type: 'success',
      message: "Unlocked all documents of this project"
    }):this.toastService.add({
      type: 'info',
      message: 'No documents of this project is locked'
    });;
  },(error) => {
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
 refreshTable() {
    this.getDocumentsOfProject();
  }
getRoles() {
  this.managerService.getRoles().subscribe((roles:any) => {

 
    this.rolesForDocsWaitingForAnalystReview = [];
    this.rolesForDocsWaitingForQcReview = [];
    roles.forEach((role:any) => {
      if(ROLES_FOR_DOCS_WAITING_ANALYST_REVIEW.includes(role.role_name)) {
        this.rolesForDocsWaitingForAnalystReview.push(role);
      }
      if(ROLES_FOR_DOCS_WAITING_QC_REVIEW.includes(role.role_name)) {
        this.rolesForDocsWaitingForQcReview.push(role);
      }

      if(ANALYST_ROLES.includes(role.role_name)) {
        ANALYST_ROLE_IDS.push(role._id);
      }

      if(QC_ROLES.includes(role.role_name)) {
        QC_ROLE_IDS.push(role._id);
      }
    });
  },
  (error:any) => {
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
  // on change of project
  onProjectChange(event: any) {
    this.selectedProject = event;
    this.selectedProjectId = event.id;
    this.selectedProjectName = this.selectedProject.projectName;
    if (event.taskAssignment == 'Auto') {
      this.documentListFlag = false;
      this.getTaskFlag = true;
    } else {
      this.getTaskFlag = false;
      this.documentListFlag = true;
      this.getDocumentsOfProject();
    }
    if (event.timerDisplay == true) {
      this.displayTimerFlag = true;
    } else {
      this.displayTimerFlag = false;
    }
    localStorage.setItem('currentProjectId', this.selectedProjectId)
    this.authService.setCurrentProjectId(this.selectedProjectId);
    // this.getDocumentTypesFromBackend();
  }
  // filterStatus(val:any) {
  //   this.selectedStatus = val;
  //   if (val == 'All') {
  //     this.documents = this.primaryTaskTable;
  //   } else {
  //     this.documents = [];
  //     let filterStatuses;
  //     if(val.includes('in_progress')){
  //       filterStatuses = IN_PROGRESS_STATUSES
  //     } else if(val.includes('pending')){
  //       filterStatuses = PENDING_STATUSES
  //     } else if(val.includes('rejected')){
  //       filterStatuses = REJECTED_STATUSES
  //     } else if(val.includes('completed') || val.includes('pushed_to_target')){
  //       filterStatuses = COMPLETED_STATUSES
  //     } else {
  //       this.documents = this.primaryTaskTable;
  //       // this.rerender();
  //       return;
  //     }

  //     for (let i = 0; i < this.primaryTaskTable.length; i++) {
  //       if (filterStatuses.includes(this.primaryTaskTable[i].document_status)) {
  //         this.documents.push(this.primaryTaskTable[i]);
  //       }
  //     }
  //   }
  //   // this.rerender();
  // }

  filterStatus(val:any) {
    this.selectedStatus = val;
    this.primaryTaskTable = [];
    if (this.selectedStatus == 'All') {
      this.primaryTaskTable = this.documents;
      this.displaySelect = 'All'
    }else if (this.selectedStatus != 'All') {

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
    if (this.selectedStatus == 'in-process' || this.selectedStatus == 'uploaded' ||  this.selectedStatus == 'Pending split' ||
        this.selectedStatus == 'Splitting completed' ||this.selectedStatus == 'Failed split' ||
        this.selectedStatus == 'Pending image conversion' ||this.selectedStatus == 'Failed image conversion' ||
        this.selectedStatus == 'Pending ocr classification' || this.selectedStatus == 'Failed ocr classification' ||
        this.selectedStatus == 'Pending image classification' ||this.selectedStatus == 'Failed image classification' ||
        this.selectedStatus == 'Pending extraction' ||this.selectedStatus == 'Failed extraction' ||
        this.selectedStatus == 'Pending contextualization' || this.selectedStatus == 'Failed contextualization' ) {
        this.displaySelect = 'In Queue';
    }
    if (this.selectedStatus == 'pending_qc' || this.selectedStatus == 'in_progress_qc' ||this.selectedStatus == 'pushed_to_target' ||this.selectedStatus == 'completed_qc'
    ) {
      this.displaySelect = 'Completed';
    }
      this.dtTrigger.next(null);
    // if (this.selectedStatus === 'All') {
    //   this.displaySelect = 'All';
    // }
    // this.rerender();
  }

getActionLabel(document:any) {
  if(NON_ASSIGNABLE_STATUSES.includes(document.document_status)) {
    return 'NA'
  }
  return document?.user_id? 'reassign' : 'assign';
}

getDocumentTimeline(document: any, index: any) {
  this.managerService.getDocumentTimeline(document._id).subscribe((documentTimeline:any) => {

    this.documentTimeline = this.formatStagebasedDocumentTimeLog(documentTimeline);
 
 

  })
}

formatStagebasedDocumentTimeLog = (res: any) => {
 
  const UPLOADED_STAGE = "uploaded";
  const SKENSE_STAGE = "skense";
  const ANALYST_STAGE = "analyst";
  const QC_STAGE = "qc";
  const COMPLETED_STAGE = "completed";

  let currentStage;
  let currentStatus;
  const statusesMapper:any = {
    "uploaded": 1,
    "in-process": 2,
    "failed": 3,
    "pending_a": 4,
    "pending_a_u": 5,
    "in_progress_a": 6,
    "rejected_a": 7,
    "pending_qc": 8,
    "pending_qc_u": 9,
    "in_progress_qc": 10,
    "rejected_qc": 11,
    "completed_qc": 12,
    "pushed_to_target": 13
  }

  let stages :any= {
    [UPLOADED_STAGE]: null,
    [SKENSE_STAGE]: null,
    [ANALYST_STAGE]: null,
    [QC_STAGE]: null,
    [COMPLETED_STAGE]: null
  }

  if(res.document.document_status.includes('pending') && res.document.user_id) {
    res.document.document_status += '_u';
  }

 

  const splitAnalystAndQCLogs = (docLogs: any[]) => {
    let aLogs: any[] = [];
    let qLogs: any[] = [];
    docLogs.forEach(docLog => {

 

      if(ANALYST_ROLE_IDS.includes(docLog.role_id)){
        aLogs.push(docLog);
      } else if(QC_ROLE_IDS.includes(docLog.role_id)){
        qLogs.push(docLog);
      }
    });
    return {aLogs, qLogs};
  }

  const {aLogs, qLogs} = splitAnalystAndQCLogs(res.logs);

  if(aLogs.length && aLogs[aLogs.length-1].status == 'rejected_a') {
    res.document.document_status = 'rejected_a';
  }

  if(qLogs.length && qLogs[qLogs.length-1].status == 'rejected_qc') {
    res.document.document_status = 'rejected_qc';
  }

  const getSkenseStatusColorCode = (stage: string, docStatus: string | number) => {
    if(stage == SKENSE_STAGE) {
      if(statusesMapper[docStatus] > 3) {
        return SUCCESS_CODE;
      } else if(statusesMapper[docStatus] == 3) {
        return ERROR_CODE;
      } else if(statusesMapper[docStatus] == 2) {
        return INPROGRESS_CODE;
      }
    } else if(stage == ANALYST_STAGE) {
      if(statusesMapper[docStatus] > 7) {
        return SUCCESS_CODE;
      } else if(statusesMapper[docStatus] == 7) {
        return ERROR_CODE;
      } else if(statusesMapper[docStatus] == 6) {
        return INPROGRESS_CODE;
      } else if(statusesMapper[docStatus] == 5) {
        return INPROGRESS_CODE;
      }
    } else if(stage == QC_STAGE) {
      if(statusesMapper[docStatus] > 11) {
        return SUCCESS_CODE;
      } else if(statusesMapper[docStatus] == 11) {
        return ERROR_CODE;
      } else if(statusesMapper[docStatus] == 10) {
        return INPROGRESS_CODE;
      } else if(statusesMapper[docStatus] == 9) {
        return INPROGRESS_CODE;
      }

    } else if(stage == COMPLETED_STAGE) {
      if(statusesMapper[docStatus] >= 12) {
        return SUCCESS_CODE;
      }
    }
    return ''
  }

  const setStage = (doc: { document_status: string; uploaded_timestamp: any; last_modified_timestamp: any; }) => {
    currentStatus = doc.document_status;
    let docStatus = doc.document_status;
    if(statusesMapper[docStatus] >= 1) {
      currentStage = UPLOADED_STAGE;
      stages[UPLOADED_STAGE] = {};
      stages[UPLOADED_STAGE].createdAt = doc.uploaded_timestamp;
      stages[UPLOADED_STAGE].color_code = SUCCESS_CODE;
    }

    if(statusesMapper[docStatus] >= 2) {
      currentStage = SKENSE_STAGE;
      stages[SKENSE_STAGE] = {};
      stages[SKENSE_STAGE].createdAt = doc.uploaded_timestamp;
      stages[SKENSE_STAGE].color_code = getSkenseStatusColorCode(SKENSE_STAGE, docStatus);

      // if this stage was success by default next stage will be in progress
      if (stages[SKENSE_STAGE].color_code == SUCCESS_CODE) {
        stages[ANALYST_STAGE] = {};
        stages[ANALYST_STAGE].color_code = INPROGRESS_CODE;
      }
    }

    if(statusesMapper[docStatus] >= 5) {
      currentStage = ANALYST_STAGE;
      stages[ANALYST_STAGE] = {};
      stages[ANALYST_STAGE].logs = aLogs;
      stages[ANALYST_STAGE].color_code = getSkenseStatusColorCode(ANALYST_STAGE, docStatus);

      // if this stage was success by default next stage will be in progress
      if (stages[ANALYST_STAGE].color_code == SUCCESS_CODE) {
        stages[QC_STAGE] = {};
        stages[QC_STAGE].color_code = INPROGRESS_CODE;
      }
    }

    if(statusesMapper[docStatus] >= 9 || qLogs.length) {
      currentStage = QC_STAGE;
      stages[QC_STAGE] = {};
      stages[QC_STAGE].logs = qLogs;
      stages[QC_STAGE].color_code = getSkenseStatusColorCode(QC_STAGE, docStatus);
    }

    // Just show QC log

    if(statusesMapper[docStatus] >= 12) {
      currentStage = COMPLETED_STAGE;
      stages[COMPLETED_STAGE] = {};
      stages[COMPLETED_STAGE].status = doc.document_status;
      stages[COMPLETED_STAGE].createdAt = doc.last_modified_timestamp;
      stages[COMPLETED_STAGE].color_code = getSkenseStatusColorCode(COMPLETED_STAGE, docStatus);
    }

    // If document status is pushed to target then show last active time stamp with label auto in qc stage
    if(doc.document_status == 'pushed_to_target') {
      const lastAlog = aLogs[aLogs.length - 1];
      stages[QC_STAGE].logs = [
        {
          pickedAt: lastAlog.last_action_timestamp,
          review_time: null,
          user_id: {
            user_name: "auto"
          }
        }
      ];
    }
  }

  setStage(res.document)
  return stages;
}
convertDurationToHMSformat(duration: string) {
  const sec = parseInt(duration, 10); // convert value to number if it's string
  let hours: string | number   = Math.floor(sec / 3600); // get hours
  let minutes: string | number  = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds: string | number  = sec - (hours * 3600) - (minutes * 60); //  get seconds

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}

  return (hours != "00" ? hours + "h " : '') + (minutes != "00" ? minutes + "m " : '') + (seconds != "00" ? seconds + "s" : '');
}

formatDate(dateValue: any) {
  return moment(dateValue).format('MMMM Do YYYY, h:mm:ss a');
}
configureAssignmentLookup(document:any, index:any){
  // this.selectedIndex = index;
  this.selectedDocument = document;
  if(document.document_status.includes('_qc')) {
    this.roles = this.rolesForDocsWaitingForQcReview;
 

  } else {
    this.roles = this.rolesForDocsWaitingForAnalystReview;
 

  }
  this.roles.sort((a,b) => (a.role_name > b.role_name) ? 1 : ((b.role_name > a.role_name) ? -1 : 0));

  if(document?.user_id?._id){
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
      if(doc[0]?.is_locked == true) {
        this.isDocLocked = true;
      }
    },(error:any) => {
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
fetchUserForThisRoleForAProject(value:any){
  const roleId = value.target.value;
  this.selectedRoleId = roleId
 
  this.managerService.fetchUsersOfGivenRoleAndProject(roleId, this.selectedProjectId).subscribe((assignees:any)=>{
    this.allAssignees = assignees;
    this.assignees = this.getFilteredAssignees(assignees);
 
  },(error: { status: any; error: { message: string | undefined; }; }) => {
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





getFilteredAssignees(assignees:any): Array<Object> {
  let filteredAssignees = [];
  const existingAssigneeUserId = this.selectedDocument?.user_id?._id;
  if(existingAssigneeUserId) {
    filteredAssignees = assignees.filter((assignee: { _id: any; }) => assignee._id != existingAssigneeUserId);
  } else {
    filteredAssignees = assignees;
  }
  return filteredAssignees;
}
assignOrReassign():void {
  if(this.selectedDocument?.user_id?._id) {
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
      this.getDocumentsOfProject();
      this.sharedService.getAllNotificationsOfUser(false)

    },(error) => {
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
      if(this.selectedUserId === this.userId){
      this.sharedService.getAllNotificationsOfUser(false)
      }
      else{
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

removeHighlightingTheRow(): void{
  this.selectedIndex = -1;
}
reset(){
  this.selectedRoleId='';
  this.selectedUserId=''
}
}