import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ViewEncapsulation} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
// import { OverlayService } from 'src/app/services/overlay.service'; 
import { AdminService } from '../admin.service';
import { AuthService } from 'src/app/core/auth.service';                       
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { OrchestrationService } from '../orchestration.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import * as console from 'console';
import { SharedService } from 'src/app/shared/shared.service';




@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  // encapsulation : ViewEncapsulation.None

})
export class ProjectsComponent implements AfterViewInit, OnDestroy, OnInit {


 
  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();
  projects: any;
  createProjectForm: UntypedFormGroup;
  editProjectForm: UntypedFormGroup;
  submitted = false;
  deleteProjectId = '';
  deleteProjectName = '';
  editProjectObject:any = [];
  groupsObjectById:any = [];
  groupsObjectByName:any = [];
  userGroupsData: any;
  projectPerformanceObject = {
    failed: 'NA',
    in_process: 'NA',
    processed: 'NA',
  };
  projectDetailedView = {
    name: 'NA',
  };
  rejectFolderResultFalse: boolean = false;
  rejectFolderResultTrue: boolean = false;
  projectResultFalse: boolean = false;
  projectResultTrue: boolean = false;
  projectResultLoad: boolean = false;
  sourcePathLoad: boolean = false;
  destinationPathLoad: boolean = false;
  rejectPathLoad: boolean = false;
  sourceResultFalse: boolean = false;
  sourceResultTrue: boolean = false;
  destinationResultFalse: boolean = false;
  destinationResultTrue: boolean = false;
  result: any;
  p_id: any;
  failedDocuments:any = [];
  message: any[];
  selectedFailedDocumentsArr = [];
  projectDocumentDetailsObject:any = [];
  projectDocumentMetadataObject:any = [];
  projectSubmitSuccesful = false;
  duplicateProjectSubmit = false;
  loggedUser: any;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  clickedEditedProjectId: any;
  isCheckAlls: any = false;
  @ViewChildren('checkboxRight') checkboxRight: any;


  constructor(
    // private overlay: OverlayService,
    private titleService: Title,
    private fb: UntypedFormBuilder,
    private adminService: AdminService,
    public router: Router,
    private authService: AuthService,
    private orchestrationService: OrchestrationService,
    public toastService:ToasterService,
    public sharedService:SharedService
  ) { 
    this.titleService.setTitle('Skense - Admin');
  }



  ngOnInit(): void {
    this.sharedService.adminMenuChanges();
    this.dtOptions[0] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [ 10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      order: [[4, 'desc']],
      columnDefs:  [ {
        'targets': [9], // column index (start from 0)
        'orderable': false,
     // set orderable false for selected columns
     },{targets:[1],type:'date'}],
    //  scrollY: '43vh', /// This is resulting in an error. Appears to be a DataTables bug
     scrollX: true, scrollCollapse: true,
    };
    this.getProjectsFromBackend();
    this.loggedUser = localStorage.getItem('user');
    this.getUserGroupsFromBackend();
    this.createProjectForm = new UntypedFormGroup({
      projectName: new UntypedFormControl(null, [Validators.required]),
      sourcePath: new UntypedFormControl(null, [Validators.required]),
      destinationPath: new UntypedFormControl(null, [Validators.required]),
      rejectfolderPath: new UntypedFormControl(null, [Validators.required]),
      groupDropdown: new UntypedFormControl(null, [Validators.required]),
    });
    this.editProjectForm = this.fb.group({
      editProjectName: [null, [Validators.required]],
      editSourcePathInput: [null, [Validators.required]],
      editDestinationPathInput: [null, [Validators.required]],
      editRejectfolderPathInput: [null, [Validators.required]],
      editAssignGroup: [null, [Validators.required]],
    });
  }

   // Get user-groups
   getUserGroupsFromBackend() {
    this.adminService.getUserGroups().subscribe(
      (data) => {
        this.userGroupsData = data;
        const userGroupDataArray: any = data;
        userGroupDataArray.forEach((element:any) => {
          this.groupsObjectById[element._id] = element.user_group_name;
        });
        Object.keys(this.groupsObjectById).forEach((id) => {
          this.groupsObjectByName[this.groupsObjectById[id]] = id;
        });
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }        
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });	
      }
    );
  }

  // Get User groupId
  getGroupIdForGroupName(groupName:any) {
    for (const groupId of Object.keys(this.groupsObjectById)) {
      if (groupName === this.groupsObjectById[groupId]) {
        return groupId;
      }
    }
    return 'Not Found';
  }

  // Get User groupId
  getGroupNameForGroupId(groupId:any) {
    if (this.groupsObjectById[groupId]) {
      return this.groupsObjectById[groupId];
    }
    return 'Not Found';
  }

  // Get Projects
  getProjectsFromBackend() {
    // this.overlay.activateOverlay(true, 'sk-circle');
    
    this.adminService.getProject().subscribe(
      (data) => {
        this.projects = data;
        this.rerender();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });	
      }
    );
  }

  // Create Projects
  onCreateFormSubmit() {
    const httpRequestBody = {
      project_name: this.createProjectForm.value.projectName,
      start_date: new Date(),
      project_description: this.createProjectForm.value.projectName,
      document_source: this.createProjectForm.value.sourcePath,
      destination: this.createProjectForm.value.destinationPath,
      reject_folder_path: this.createProjectForm.value.rejectfolderPath,
      user_group_id:
        this.groupsObjectByName[this.createProjectForm.value.groupDropdown],
      status: 'active',
    };

    this.adminService.saveProject(httpRequestBody).subscribe(
      (data) => {
        const project: any = data;
        if (project.error) {          
          this.toastService.add({
            type: 'error',
            message: 'Project Name already exists. Try with a different name!'
          });	
          this.duplicateProjectSubmit = true;
        } else {
          this.projectSubmitSuccesful = true;        
          this.toastService.add({
            type: 'success',
            message: " Project Created Successfully!"
          })
        }
        this.ngOnInit();
        this.rejectFolderResultFalse = false;
        this.rejectFolderResultTrue = false;
        this.projectResultFalse = false;
        this.projectResultTrue = false;
        this.projectResultLoad = false;
        this.sourcePathLoad = false;
        this.destinationPathLoad = false;
        this.rejectPathLoad = false;
        this.sourceResultFalse = false;
        this.sourceResultTrue = false;
        this.destinationResultFalse = false;
        this.destinationResultTrue = false;
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });	
      }
    );
  }

  projectSubmitValuesClear() {
    this.projectSubmitSuccesful = false;
    this.duplicateProjectSubmit = false;
  }

  // on click of cancel button on create project form
  onCreateFormCancelClick() {
    this.createProjectForm.reset();
    this.rejectFolderResultFalse = false;
    this.rejectFolderResultTrue = false;
    this.projectResultFalse = false;
    this.projectResultTrue = false;
    this.projectResultLoad = false;
    this.sourcePathLoad = false;
    this.destinationPathLoad = false;
    this.rejectPathLoad = false;
    this.sourceResultFalse = false;
    this.sourceResultTrue = false;
    this.destinationResultFalse = false;
    this.destinationResultTrue = false;
  }

  // on click of delete icon
  onDeleteButtonClick(inputElement:any, project:any) {
    this.deleteProjectName = project.project_name;
    this.deleteProjectId = project._id;
  }

  onDeleteProjectClick(id: any) {
    const request = {
      id,
    };

    this.adminService.deleteProject(request).subscribe(
      (data) => {       
        this.toastService.add({
          type: 'success',
          message: "Deleted Succesfully"
        })
        this.ngOnInit();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
        this.ngOnInit();
      }
    );
    this.deleteProjectId = '';
    this.deleteProjectName = '';
  }

  // on click of submit button on edit project form
  onEditFormSubmit() {
    // this.overlay.activateOverlay(true, 'sk-circle');
    // Edit Call
    const request = {
      id: this.editProjectObject['_id'],
      project_name: this.editProjectForm.value.editProjectName,
      document_source: this.editProjectForm.value.editSourcePathInput,
      destination: this.editProjectForm.value.editDestinationPathInput,
      reject_folder_path: this.editProjectForm.value.editRejectfolderPathInput,
      user_group_id: this.getGroupIdForGroupName(this.editProjectForm.value.editAssignGroup),
    };
    this.adminService.editProject(request).subscribe(
      (data) => {
        this.ngOnInit();
        this.rejectFolderResultFalse = false;
        this.rejectFolderResultTrue = false;
        this.projectResultFalse = false;
        this.projectResultTrue = false;
        this.projectResultLoad = false;
        this.sourcePathLoad = false;
        this.destinationPathLoad = false;
        this.rejectPathLoad = false;
        this.sourceResultFalse = false;
        this.sourceResultTrue = false;
        this.destinationResultFalse = false;
        this.destinationResultTrue = false;      
        this.toastService.add({
          type: 'success',
          message: "Project Edited Successfully!"
        })
        setTimeout(() => {
          // this.overlay.activateOverlay(false, '');
        }, 500);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }      
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
        this.ngOnInit();
      }
    );
  }

  // on click of edit icon
  onEditButtonClick(inputValue:any, project:any) {
    this.editProjectObject = project;
    this.clickedEditedProjectId = project._id;
    this.editProjectForm.patchValue({ editProjectName: project.project_name });
    this.editProjectForm.patchValue({
      editSourcePathInput: project.document_source,
    });
    this.editProjectForm.patchValue({
      editDestinationPathInput: project.destination,
    });
    this.editProjectForm.patchValue({
      editRejectfolderPathInput: project.reject_folder_path,
    });
    this.editProjectForm.patchValue({
      editAssignGroup: this.getGroupNameForGroupId(project.user_group_id),
    });
  }

  viewProjectSteps(project:any) { 
    this.orchestrationService.projectName = project.project_name;
    this.orchestrationService.projectId = project._id;
    this.router.navigate(['./admin/projects/orchestration']);
  }

  // on click of project name
  viewProjectDetails(inputElement:any, project:any) {
    // this.overlay.activateOverlay(true, 'sk-circle');
    this.dtOptions[1] = {
      order: [[1, 'asc']],
      pagingType: 'full_numbers',
      retrieve:true,
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      
     scrollY: '40vh', /// This is resulting in an error. Appears to be a DataTables bug
     scrollX: true, 
     scrollCollapse: true,
      columnDefs:  [ {
				'targets': [0], // column index (start from 0)
				'orderable': false,
       // set orderable false for selected columns
			 }],
     
    };
    this.projectDetailedView['name'] = project.project_name;
    this.p_id = project._id;
    const request = {
      project_id: project._id,
    };

    this.adminService.projectPerformance(request).subscribe(
      (data) => {
        const projectPerformanceResponse: any = data;
        this.projectPerformanceObject.failed =
          projectPerformanceResponse.failed;
        this.projectPerformanceObject.in_process =
          projectPerformanceResponse.in_process;
        this.projectPerformanceObject.processed =
          projectPerformanceResponse.processed;
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
      }
    );
    this.adminService.projectDocument(request).subscribe(
      (data) => {
        const projectDocumentsResponse: any = data;
        this.rerender();
        this.projectDocumentDetailsObject = new Array(...projectDocumentsResponse.data);
        this.projectDocumentMetadataObject = projectDocumentsResponse.meta_data;
        this.projectDocumentDetailsObject.forEach((element:any) => {
          if (element.document_status.includes('progress' || 'process')) {
            element['isAnchor'] = false;
          } else {
            element['isAnchor'] = true;
          }
        });
        setTimeout(() => {
          // this.overlay.activateOverlay(false, '');
        }, 500);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }        
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
      }
    );
  }

  // on click of document status
  getDocumentStatus(docStatus:any) {
    localStorage.removeItem('ExtractedData');
    localStorage.setItem('ExtractedData', JSON.stringify(docStatus));
    // this.adminService.passformdata(ducStatus);
  }

  getMetadataValue(key:any, returnDisplayName:any) {
    if(!this.projectDocumentMetadataObject[key])
    return key;
    else if (returnDisplayName) {
      return this.projectDocumentMetadataObject[key].display_name;
    } else {
      return this.projectDocumentMetadataObject[key].result;
    }
  }

  // called on where this.rerender() called
  rerender(): void {    
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      }
    });
    this.dtTrigger.next(null);
    this.dtTrigger1.next(null);
  }

  // on click of select all checkbox
  selectAllFailedDocuments(ev:any) {
 
    this.failedDocuments = [];
    this.projectDocumentDetailsObject.forEach((x:any) => {
      if (ev.checked) {
        this.isCheckAlls = true;
        // this.checkboxRight = true;

      } 
      if (x.document_status == 'failed') {
        x.state = ev.target.checked;
      }
      if (x.document_status == 'failed' && ev.target.checked == true) {
        this.failedDocuments.push(x._id);
        this.checkboxRight._results.forEach((element: any) => {
          element.nativeElement.checked = true;
        });
      }
      if (ev.target.checked == false) {
        this.failedDocuments = [];

      }
    });
    // if (this.isCheckAlls) {
    //   this.rightAttributeList.forEach((item: any) =>
    //     this.rightChekedAttributes.push(item)
    //   );
 
    //   this.checkboxRight._results.forEach((element: any) => {
    //     element.nativeElement.checked = true;
    //   });
    // } else {
    //   this.disableRight = false;
    //   this.rightChekedAttributes = [];
    //   this.checkboxRight._results.forEach((element: any) => {
    //     element.nativeElement.checked = false;
    //   });
    // }
  }

  // on click of checkbox respected to document
  updateFailedDocsSelectedForReprocess(id:any, ev:any) {
    if (ev.target.checked == true) {
      this.failedDocuments.push(id);
    }
    if (ev.target.checked == false) {
      const index = this.failedDocuments.indexOf(id);
      this.failedDocuments.splice(index, 1);
    }
  }

  // on click of reprocess failed documents button
  reprocessFailedDocuments() {
    const body = {
      project_id: this.p_id,
      doc_ids: this.failedDocuments,
    };
    this.adminService.submitFailedDocuments(body).subscribe(
      (data) => {
        const project: any = data;
        if (!project.error) {          
          this.toastService.add({
            type: 'success',
            message: "Documents submitted for reprocessing"
          })
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }        
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });	
      }
    );
  }

  // on blur of project name field
  onLostFocusFormProjectName(p_name:any) {  
    this.projectResultLoad = true;
    const body = {
      name: p_name.value,
      project_id: this.clickedEditedProjectId,
    };
    this.adminService.projectValidation(body).subscribe(
      (data) => {
        this.result = data;
        if (this.result.is_valid == true) {
          this.projectResultLoad = false;
          this.projectResultFalse = false;
          this.projectResultTrue = true;
        } else {
          this.projectResultLoad = false;
          this.projectResultFalse = true;
          this.projectResultTrue = false;
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });	
      }
    );
  }

  // on blur of source path field
  onLostFocusFormSourcePath(s_path:any) {
    // this.sourcePathLoad = true;
    this.sourceResultTrue = true;
    const body = {
      input_docs_path: s_path.value,
    };
    
  }

  // on blur of destination path field
  onLostFocusFormDestinationPath(d_path:any) {
    // this.destinationPathLoad = true;
    this.destinationResultTrue = true;
    const body = {
      output_docs_path: d_path.value,
    };
    
  }

  // on blur of reject folder path field
  onLostFocusFormRejectFolderPath(rejectpath:any) {
    // this.rejectPathLoad = true;
    this.rejectFolderResultTrue = true;
    const body = {
      reject_docs_path: rejectpath.value,
    };
  }

  // on change of assign task option
  assignTaskChange(ev:any, project:any) {
    const request = {
      id: project._id,
      task_assignment: ev.value,
    };
    this.adminService.editProject(request).subscribe(
      (dataResult) => {
        const updateAssignTaskInProjectResponse: any = dataResult;
        if (!updateAssignTaskInProjectResponse.error) {          
          this.toastService.add({
            type: 'success',
            message: "Task assignment updated Succesfully!"
          })
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Task assignment cannot update'
        });	
      }
    );
  }

  // on change of project status toggle button
  changeProjectStatus(inputElement:any, project:any) {
    const request = {
      id: project._id,
      status: ''
    };
    if (inputElement.checked) {
      request['status'] = 'active';
    } else {
      request['status'] = 'inactive';
    }
    this.adminService.editProject(request).subscribe(
      (dataResult) => {
        const updateProjectStatusInProjectResponse: any = dataResult;
        if (!updateProjectStatusInProjectResponse.error) {        
          this.toastService.add({
            type: 'success',
            message: "Project status updated Succesfully!"
          })
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }       
        this.toastService.add({
          type: 'error',
          message: 'Project status cannot update'
        });	
      }
    );
  }

  // on change of display timer toggle button
  changeDisplayTimer(inputElement:any, project:any) {
    const request = {
      id: project._id,
      timer_display: ''
    };
    if (inputElement.checked) {
      request['timer_display'] = 'true';
    } else {
      request['timer_display'] = 'false';
    }
    this.adminService.editProject(request).subscribe(
      (dataResult) => {
        const updateDisplayTimerInProjectResponse: any = dataResult;
        if (!updateDisplayTimerInProjectResponse.error) {        
          this.toastService.add({
            type: 'success',
            message: "Display timer updated Succesfully!"
          })
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }      
        this.toastService.add({
          type: 'error',
          message: 'Display timer cannot update'
        });	
      }
    );
  }

  cannotSelectForReprocess(projectDoc:any) {
    if (projectDoc.document_status == 'failed') {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
   /// throw new Error('Method not implemented.');
   this.dtTrigger.unsubscribe();
   this.dtTrigger1.unsubscribe();
  }
  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    this.dtTrigger.next(null);
    this.dtTrigger1.next(null);    
  }

  orchestration(project:any){
    this.orchestrationService.projectName = project.project_name;
    this.orchestrationService.projectId = project._id;
    localStorage.setItem('projectName',project.project_name);
    localStorage.setItem('projectId',project._id)
    this.router.navigate(['./admin/projects/orchestration']);
  }
}
