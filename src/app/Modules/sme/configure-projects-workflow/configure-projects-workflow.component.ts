import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-configure-projects-workflow',
  templateUrl: './configure-projects-workflow.component.html',
  styleUrls: ['./configure-projects-workflow.component.scss']
})
export class ConfigureProjectsWorkflowComponent implements OnInit {

  header:string="Add New Workflow"

  @ViewChild('cancelModel') closeModel:ElementRef;
  @ViewChild('addWorkflow1') addWorkflow1:ElementRef;

  projectId:number;
  destinationList:any=[];
  selectedProjectName:any;
  documentTypeList:any=[];
  addWorkflow:any={documentType:'',
                      destination:'',
                      booleanWorkflow:'',
                      workflowName:'',
                      id:null}
  constructor(private smeService:SmeService, private toastr: ToasterService, private router: Router,private sharedService:SharedService) {

    if (this.smeService.metaDataConfigureDoc) {
      this.projectId = this.smeService.metaDataConfigureDoc?.docType_id;
    } else {
      this.router.navigate(['/sme/configure-projects']);
    }

  }

  ngOnInit(): void {
    this.sharedService.smeMenuChanges();
    if (this.smeService.metaDataConfigureDoc) {
      this.projectId = this.smeService.metaDataConfigureDoc?.docType_id;
    } else {
      this.router.navigate(['/sme/configure-projects']);
    }
    if (this.smeService.projectDetails) {
 
      this.selectedProjectName = this.smeService.projectDetails.projectDetails['projectName'];
    }

    this.loadDestinationList();
    this.loadDocumentType();
  }

  loadDestinationList() {
    this.smeService.getDestinationList(this.projectId).subscribe((data:any) => {
        this.destinationList = data;
    });
  }

  addNewWorkflow(){
         if(this.addWorkflow.documentType==undefined || this.addWorkflow.destination==undefined || this.addWorkflow.booleanWorkflow==undefined || this.addWorkflow.workflowName==undefined){
            this.toastr.add({
              type: 'warning',
              message: 'Enter values'
            });
            return
         }
          const newWorkflow = {
            "_id": this.addWorkflow.id?this.addWorkflow.id:null,
            "project_id": this.projectId,
            "is_active": true,
            "workflow_name": this.addWorkflow.workflowName,
            "boolean_workflow":  this.addWorkflow.booleanWorkflow,
            "boolean_workflow_rules" : null,
            "destination": this.addWorkflow.destination,
            "document_type_id" : this.addWorkflow.documentType
          }

          this.smeService.addNewWorkflow(this.projectId,newWorkflow).subscribe(res=>{

            this.closeModel.nativeElement.click();
            this.smeService.reloadWorkflowList();
            this.toastr.add({
              type: 'success',
              message: "Workflow added successfully"
            })

          }
          ,((res:any)=>{
            this.toastr.add({
              type: 'error',
              message: res.error.message
            });
      }))
  }

  reset(){
    this.addWorkflow={}
    this.header="Add New Workflow"
  }

  loadDocumentType(){
    this.smeService.getDocumentType().subscribe(res=>{
      this.documentTypeList=res;
    })
  }
  flowEdit(flow:any){
 
    this.header="Edit New Workflow"
    this.addWorkflow.documentType=flow.document_type_id._id;
    this.addWorkflow.destination=flow.destination;
    this.addWorkflow.booleanWorkflow=flow.boolean_workflow;
    this.addWorkflow.workflowName=flow.workflow_name;
    this.addWorkflow.id=flow._id;
    this.addWorkflow1.nativeElement.click();
  }
}
