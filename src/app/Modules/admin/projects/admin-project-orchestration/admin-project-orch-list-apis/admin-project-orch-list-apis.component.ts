import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { OrchestrationService } from '../../../orchestration.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
const MIN_APIS_COUNT = 2;
@Component({
  selector: 'app-admin-project-orch-list-apis',
  templateUrl: './admin-project-orch-list-apis.component.html',
  styleUrls: ['./admin-project-orch-list-apis.component.scss'],
  // encapsulation : ViewEncapsulation.Emulated

})
export class AdminProjectOrchListApisComponent implements OnInit {

  orchestrationApis:any = [];
  private selectedApis:any = [];
  private projectId:any = "";
  isSelectedAllApis = false;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();   
  inputLength: any = "";
  outputLength: any = "";
  projectSubcription:Subscription;

  constructor(  private orchestrationService: OrchestrationService,   
    private changeDetectorRefs: ChangeDetectorRef,
    public toastService:ToasterService,private sharedService:SharedService) {
         this.projectSubcription=sharedService.OrchestrationProject.subscribe((projectId:any)=>{
              if(projectId){
                this.fetchProjectOrchestrationConfigurationAndLookupData(projectId)
              }
              
         })
     }




  ngOnInit(): void {
    this.dtOptions = {
      // "paging": false,
      // "info": false,
      "order": [[1, 'asc']],
      scrollY: '70vh', /// This is resulting in an error. Appears to be a DataTables bug
      scrollX: true, 
      scrollCollapse: true,
      pageLength: 10,
    lengthMenu: [
      [10, 20, 30, -1],
      [10, 20, 30, 'All'],
    ],
      columnDefs:  [ {
        'targets': [0], // column index (start from 0)
        'orderable': false, // set orderable false for selected columns
     }],
    };
    
    this.projectId = this.orchestrationService.projectId;
    //localStorage.removeItem('selectedAPIforSequence');
    this.projectId =localStorage.getItem('projectId'); 
    this.fetchProjectOrchestrationConfigurationAndLookupData(this.projectId);
  }

  fetchProjectOrchestrationConfigurationAndLookupData(projectId:any) {
   // this.overlay.activateOverlay(true, 'sk-circle');
    forkJoin([
      this.orchestrationService.listOrchestrationApis(),
      this.orchestrationService.fetchProjectOrchestrationDetails(projectId)
    ]).subscribe((result:any)=>{
      this.orchestrationApis = [];
      this.selectedApis=[];
      this.rerender(); 
      let selectedOrchestrationApisMapper:any = {};
      this.orchestrationService.workflow = result[1]?.workflow;
      result[1]?.apis?.forEach((element:any) => {
        selectedOrchestrationApisMapper[element.orchestration_api]=element.sequence;
      });
      const hasWorkflow = (result[1]?.workflow)? true : false;
      
      result[0]?.forEach((element:any) => {
        let api = {...element};
        if(selectedOrchestrationApisMapper[element._id]) {
          api.isSelected = true;
          let temp = {...api};
          temp.position = selectedOrchestrationApisMapper[element._id];
          this.selectedApis.push(temp)
        } else {
          api.isSelected = false;
        }
        this.orchestrationApis.push(api);
      });

      this.orchestrationService.informApisSelectionUpdated(this.selectedApis, false, hasWorkflow);
      this.rerender(); 
      this.updateAllApisSelectedFlag();
      this.selectedApis.sort((a:any,b:any) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
      if(this.selectedApis.length>0){
        this.orchestrationService.setSelectedApi=this.selectedApis;
      } 
      //this.overlay.activateOverlay(false, '');
    }, error => {
      //this.overlay.activateOverlay(false, '');
    })
  }

  selectOrDeselectApi(api:any, event:any) {
    let tempSelectedApis = [...this.selectedApis];
    this.selectedApis = [];
    let existingApiIndex:any;
    const existingApi = tempSelectedApis.find((e,i)=> {
        if(e._id == api._id) {
          existingApiIndex = i;
          return;
        }
      }
    )
    if(existingApiIndex >= 0) {
      // remove deselected item
      tempSelectedApis.splice(existingApiIndex,1);
      // update position numbers
      tempSelectedApis.forEach((api,index)=>{
        api.position = index+1;
      })
    } else {
      let temp = {...api};
      temp.position = tempSelectedApis.length+1;
      tempSelectedApis.push(temp)
    }
    this.selectedApis = [...tempSelectedApis];
    this.orchestrationService.informApisSelectionUpdated(this.selectedApis, true, null);
    this.orchestrationService.setSelectedApi=this.selectedApis;
    localStorage.setItem("selectedAPIforSequence", JSON.stringify(this.selectedApis));
    this.updateAllApisSelectedFlag();
    this.orchestrationService.moveToSequinceApi(this.selectedApis.length);
  }

  selectOrDeselectAllApis(event:any){

    this.selectedApis = [];
    if(event.target.checked) {
      this.orchestrationApis.forEach((orchestrationApi:any) => {
        orchestrationApi.isSelected = true;
        let temp = {...orchestrationApi};
        temp.position = this.selectedApis.length+1;
        this.selectedApis.push(temp)
      });
    } else {
      this.orchestrationApis.forEach((orchestrationApi:any) => {
        orchestrationApi.isSelected = false;
      })
    }
    this.orchestrationService.informApisSelectionUpdated(this.selectedApis, true, null);
    this.orchestrationService.setSelectedApi=this.selectedApis;
    localStorage.setItem("selectedAPIforSequence", JSON.stringify(this.selectedApis));
    this.updateAllApisSelectedFlag();
    this.orchestrationService.moveToSequinceApi(this.selectedApis.length);
  }
  updateAllApisSelectedFlag() {
    if(this.orchestrationApis.length == this.selectedApis.length) {
      this.isSelectedAllApis = true;
    } else {
      this.isSelectedAllApis = false;
    }
    this.orchestrationService.moveToSequinceApi(this.selectedApis.length);
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
  inputParamView(inputLength:any) {    
    this.inputLength = inputLength;
  }

  outputParamView(outputLength:any) {    
    this.outputLength = outputLength;
  }

  moveToSequence() {
    if(!(this.selectedApis.length >= MIN_APIS_COUNT)) {
      this.toastService.add({
        type: 'warning',
        message: `Please select minimum ${MIN_APIS_COUNT} APIs to proceed further`
      });	
      return;
    }
    this.orchestrationService.moveToSequinceApi(this.selectedApis.length);
  }

  ngOnDestroy(): void {   
    this.orchestrationService.moveToSequinceApi(0); 
    this.projectSubcription.unsubscribe();
    this.dtTrigger.unsubscribe();    
  } 
}
