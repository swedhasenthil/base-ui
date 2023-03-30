import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrchestrationService } from '../../orchestration.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/shared.service';
const MIN_APIS_COUNT=2
@Component({
  selector: 'app-admin-project-orchestration',
  templateUrl: './admin-project-orchestration.component.html',
  styleUrls: ['./admin-project-orchestration.component.scss'],
  encapsulation : ViewEncapsulation.None

})
export class AdminProjectOrchestrationComponent implements OnInit {

  selectedApiCountsucription:Subscription;
  seletedStep:any=1;
  selectedAPICount:any=0;
  allProjects: any = [];
  selectedProjectName: any;
  selectproject: any;
  isDisabled:boolean;
  constructor(private orchestrationService:OrchestrationService,
    public router:Router,public toastService:ToasterService,private sharedService:SharedService) {
   this.selectedApiCountsucription=this.orchestrationService.selectApiCountSubject.subscribe(selectedAPICount=>{
     // if(selectedAPICount){
        this.selectedAPICount=selectedAPICount;
      //}  
    });

    this.router.events.subscribe((currentRoute: any) => {
      if(currentRoute.url=='/admin/projects/orchestration'){
        this.seletedStep=1;
        this.isDisabled=false;
      }
      if(currentRoute.url=='/admin/projects/orchestration/sequence-api'){
        this.seletedStep=2;
        this.isDisabled=true;
      }
      if(currentRoute.url=='/admin/projects/orchestration/workflow'){
        this.seletedStep=3;
         this.isDisabled=true;
      }
    })
   }

  ngOnInit(): void {
    this.selectedAPICount=0;
   // localStorage.removeItem('selectedAPIforSequence');
  let projectName= this.orchestrationService.projectName
  let projectId=  this.orchestrationService.projectId

  //if(projectName){
    this.selectproject=localStorage.getItem('projectId');            //this.orchestrationService.projectId;
    this.selectedProjectName =localStorage.getItem('projectName')   //this.orchestrationService.projectName;
  //}  
  this.projectsList();
  }

  step(step:string){
   
    switch (step) {
      case '1':
       // this.seletedStep=step;
       // this.router.navigate(['admin/projects/orchestration/select-api']);
        break;
      case '2':
        if(this.selectedAPICount>2){
          //this.seletedStep=step;
          //this.router.navigate(['admin/projects/orchestration/sequence-api']);
          }
          break;
      case '3':
        //this.seletedStep=step;
            break;
      default:
        break;
    }
  }

  next(){
    if(!(this.selectedAPICount>= MIN_APIS_COUNT)) {
      this.toastService.add({
        type: 'warning',
        message: `Please select minimum ${MIN_APIS_COUNT} APIs to proceed further`
      });	
      return;
    }
      this.seletedStep=2;
      this.router.navigate(['admin/projects/orchestration/sequence-api']);
  }

  moveToWorkflow(){
    
    this.router.navigate(['admin/projects/orchestration/workflow']);
    this.seletedStep=3; 
  }


  submit(){
    this.orchestrationService.submitWorkFlow();
  
    this.router.navigate(['admin/manage-project']); 

  }

 

  projectsList() {
    this.orchestrationService.getWorkflowOrchestrationProjectsList({ role_id:localStorage.getItem('currentUserRoleId') })
      .subscribe(
        (data) => {
          // this.allProjects=data;
          // if (data) {
             this.allProjects = data;
          //   this.allProjects = this.allProjects.map((project: any) => {
          //     let tempProject: any = {};
          //     tempProject['id'] = project._id;
          //     tempProject['previewImage'] = project.preview_image;
          //     tempProject['projectName'] = project.project_name;
          //     tempProject['taskAssignment'] = project.task_assignment;
          //     tempProject['timerDisplay'] = project.timer_display;
          //     return tempProject;
          //   });
          // }
          // this.selectproject = this.allProjects[0];
          // this.selectedProjectName = this.selectproject.project_name;
        },
        (error) => {}
      );
  }
  onProjectChange(project:any){
    this.selectedProjectName=project.project_name;
    this.sharedService.setOrchestrationProject(project._id);       
  }


  ngOnDestroy(): void {
    this.selectedApiCountsucription.unsubscribe();
  }

}
