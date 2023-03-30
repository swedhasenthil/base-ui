import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrchestrationService } from '../../orchestration.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

const IPP_KEY = "input_params";
const IFF_KEY = "input_filter_fields";
const OPP_KEY = "output_params";
const OFF_KEY = "output_filter_fields";

@Component({
  selector: 'app-list-orchestration-api',
  templateUrl: './list-orchestration-api.component.html',
  styleUrls: ['./list-orchestration-api.component.scss']
})
export class ListOrchestrationApiComponent implements OnInit {
  // orchestrationApis: [];
  orchestrationApis:any = [];
  apiToBeDeleted: any = null;    
  apiToBeEdited: any =[] ;
  // apiToBeEdited: any = null;
  inputLength: any = "";
  outputLength: any = "";
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();  
  apiName: any;
  orchestrationApi: any;

  constructor(
    private orchestrationService: OrchestrationService,
    public toastService:ToasterService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {

      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      retrieve: true,
      scrollX: true, scrollCollapse: true,
      columnDefs: [
        {
          targets: [9], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        }
      ],
    };

    this.apiToBeDeleted = null;
    this.apiToBeEdited = null;
    this.fetchOrchestrationApis(null);
  }

  ngAfterViewInit(): void {    
    this.dtTrigger.next(null);        
  }

  // rerender(): void {
  //   this.dtElements?.forEach((dtElement: DataTableDirective) => {
  //     if (dtElement?.dtInstance) {
  //       dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
  //         dtInstance.destroy();
  //       });
  //     }
  //   });
  //   this.dtTrigger?.next(null);
  // }

  
  fetchOrchestrationApis(updatedEvent:any) {
    if(updatedEvent){
      this.toastService.add({
        type: 'success',
        message: `${updatedEvent} API is updated`
      })
    }
    this.orchestrationService.listOrchestrationApis().subscribe(
      (result: any) => {
        this.orchestrationApis = result;
        this.orchestrationApi = true
       
        
        // this.rerender()
      }, (error) => { 
        if(error?.error?.message) {
          this.toastService.add({
            type: 'error',
            message: error.error.message
          });
        } else {
          this.toastService.add({
            type: 'error',
            message: 'APIs used in Orchestration, can not be edit'
          });
        }
    })
  }

  deleteOrchestrationApi() {
    this.orchestrationService.deleteOrchestrationApi(this.apiToBeDeleted._id).subscribe(result => {
      this.fetchOrchestrationApis(null);
      this.toastService.add({
        type: 'success',
        message: 'deleted successfully'
      });
    }, (error) => {
      if(error?.error?.message) {
        this.toastService.add({
          type: 'error',
          message: error.error.message
        });
      } else {
        this.toastService.add({
          type: 'error',
          message: 'APIs used in Orchestration, can not be deleted'
        });
      }
    })
  }

  captureApiNameToBeDeleted(apiToBeDeleted:any){
    this.apiToBeDeleted = apiToBeDeleted;
    this.apiName = this.apiToBeDeleted.api_name
  }

  captureApiNameToBeEdited(apiToBeEdited:any){
    this.apiToBeEdited = JSON.parse(JSON.stringify(apiToBeEdited));
    const ipp = this.apiToBeEdited[IPP_KEY];
    this.apiToBeEdited[IPP_KEY] = ipp? JSON.stringify(ipp) : '';
    const iff = this.apiToBeEdited[IFF_KEY];
    this.apiToBeEdited[IFF_KEY] = ipp? JSON.stringify(iff) : '';
    const opp = this.apiToBeEdited[OPP_KEY];
    this.apiToBeEdited[OPP_KEY] = ipp? JSON.stringify(opp) : '';
    const off = this.apiToBeEdited[OFF_KEY];
    this.apiToBeEdited[OFF_KEY] = ipp? JSON.stringify(off) : '';
  }

  inputParamView(inputLength:any) {    
    this.inputLength = inputLength;
  }

  outputParamView(outputLength:any) {    
    this.outputLength = outputLength;
  }
  
  ngOnDestroy(): void {    
    this.dtTrigger.unsubscribe();    
  } 

}
