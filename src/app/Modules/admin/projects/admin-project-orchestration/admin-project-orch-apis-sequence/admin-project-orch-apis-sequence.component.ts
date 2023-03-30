import { Component, ViewChild, ContentChildren, QueryList, forwardRef, Input, ElementRef, OnInit
} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import {MatTable, MatTableDataSource} from '@angular/material/table';
//import { OrchestrationService } from 'src/app/services/orchestration.service';
import { Subscription } from 'rxjs';
//import { ToastrService } from 'ngx-toastr';
import { OrchestrationService } from '../../../orchestration.service';
import { MatPaginator } from '@angular/material/paginator'; 
import {MatSort, Sort} from '@angular/material/sort';
export interface OrchestrationApi {
  name: string;
  position: number;
  description: string;
  apiUrl: string;
  apiEndpoint: string;
 }
 const ELEMENT_DATA:OrchestrationApi[] = []
@Component({
  selector: 'app-admin-project-orch-apis-sequence',
  templateUrl: './admin-project-orch-apis-sequence.component.html',
  styleUrls: ['./admin-project-orch-apis-sequence.component.scss']
})
export class AdminProjectOrchApisSequenceComponent implements OnInit {
  @ViewChild('table') table: MatTable<OrchestrationApi>;
  projectOrchestrationApis:any[];
  projectOrchestrationApisSearch:OrchestrationApi[];

  displayedColumns: string[] = ['position', 'name','apiUrl', 'description',  'apiEndpoint'];
  apisUpdatedSubscription: Subscription;
  apisSequenceCompletedSubscription: Subscription;
  projectId: string = "";
  hasUpdatedApiSequence = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter', {static: false}) filter: ElementRef; 
  
  dataSource = new MatTableDataSource<OrchestrationApi>(ELEMENT_DATA);
  constructor(private orchestrationService: OrchestrationService){
    this.apisUpdatedSubscription = orchestrationService.onApisSelectionUpdated().subscribe((result:any) => {
      this.projectOrchestrationApis = result.apis;
      this.hasUpdatedApiSequence = result.hasUpdated;
      this.orchestrationService.publishSequencedApis(this.projectOrchestrationApis);
    })
    this.apisSequenceCompletedSubscription = this.orchestrationService.onApiSequencingActivityCompleted().subscribe(result=>{
      this.orchestrationService.publishSequencedApis(this.projectOrchestrationApis);
      // if(this.hasUpdatedApiSequence) {
      //   const projectOrchestration = this.constructProjectOrchestration(this.projectId, this.projectOrchestrationApis); 
      //   this.orchestrationService.updateProjectOrchestration(this.projectId, projectOrchestration).subscribe(result => {
      //     toastr.success("Updated the sequence");
      //   }, error => {});
      // }
    }, error=>{})

    this.orchestrationService.selectApiCountSubject.subscribe((seletedApiList:any)=>{
      if(seletedApiList){
        this.projectOrchestrationApis =seletedApiList;
      }
      
    })
  }

  list:any
  ngOnInit() {
    this.projectId = this.orchestrationService.projectId;
    this.projectOrchestrationApis=this.orchestrationService.getSelectedApi;
   // this.list=[]
   // this.list=localStorage.getItem("selectedAPIforSequence");
   // this.projectOrchestrationApis=JSON.parse(this.list)
     this.projectOrchestrationApisSearch=this.orchestrationService.getSelectedApi;
    if(!this.projectId) return;
   

    // this.projectOrchestrationApis = [
    //   {name:'test1',
    //    position: 1223,
    //    description: 'description',
    //    apiUrl: 'apiUrl',
    //    apiEndpoint: 'apiEndpoint'},
    //    {name:'test2',
    //    position: 1224,
    //    description: 'description',
    //    apiUrl: 'apiUrl',
    //    apiEndpoint: 'apiEndpoint'},
    //    {name:'test3',
    //    position: 1225,
    //    description: 'description',
    //    apiUrl: 'apiUrl',
    //    apiEndpoint: 'apiEndpoint'},
    //    {name:'test4',
    //    position: 1225,
    //    description: 'description',
    //    apiUrl: 'apiUrl',
    //    apiEndpoint: 'apiEndpoint'}
    //  ];
  }  

  dropTable(event: CdkDragDrop<OrchestrationApi[]>) {
    const prevIndex = this.projectOrchestrationApis.findIndex((d) => d === event.item.data);
    moveItemInArray(this.projectOrchestrationApis, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  constructProjectOrchestration(projectId:any, projectOrchestrationApis:any) {
    let apis:any = [];
    projectOrchestrationApis.forEach((element:any, index:any) => {
      apis.push({
        sequence : index+1,
        orchestration_api: element._id
      })
    });
    return {
      project_id: projectId,
      apis: apis
    }
    
  }
  ngOnDestroy() {
    this.apisUpdatedSubscription.unsubscribe()
    this.apisSequenceCompletedSubscription.unsubscribe();
  }

  apiName:string
  applyFilter() {
          if(this.apiName==""){
            this.projectOrchestrationApis=this.orchestrationService.getSelectedApi;
            this.list=localStorage.getItem("selectedAPIforSequence");
            this.projectOrchestrationApis=JSON.parse(this.list)
          }else{
            this.projectOrchestrationApis=this.projectOrchestrationApis.filter(ele=>ele.api_name.toLowerCase().match(this.apiName.toLowerCase()));
            
          }
   }
  ngAfterViewInit() {  
    //this.dataSource = new MatTableDataSource(this.projectOrchestrationApis);
   // this.dataSource.paginator = this.paginator;
  }
  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<DataTableDirective>;
  // dtOptions: DataTables.Settings[]= [];
  // dtTrigger: Subject<any> = new Subject();  
  // projectOrchestrationApis:any[];
  // displayedColumns: string[] = ['position', 'name','apiUrl', 'description',  'apiEndpoint'];
  // apisUpdatedSubscription: Subscription;
  // apisSequenceCompletedSubscription: Subscription;
  // projectId: string = "";
  // hasUpdatedApiSequence = false;

  // constructor(  private orchestrationService: OrchestrationService,) { }

  // ngOnInit(): void {
  //   this.dtOptions[0] = {
  //   //   // "paging": false,
  //   //   // "info": false,
  //   //   pagingType: 'full_numbers',
  //   //   pageLength: 10,
  //   //   retrieve: true,
  //   //   "order": [[1, 'asc']],
  //   //   scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
  //   //   scrollX: true, 
  //   //   scrollCollapse: true,
  //   //   columnDefs:  [ {
  //   //     'targets': [0], // column index (start from 0)
  //   //     'orderable': false, // set orderable false for selected columns
  //   //  }],
  //   //  order: [[1, 'asc']],
  //    pagingType: 'full_numbers',
  //    retrieve:true,
  //    pageLength: 10,
  //     lengthMenu: [
  //       [10, 20, 30, -1],
  //       [10, 20, 30, 'All'],
  //     ],   
     
  //  //  scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
  //  //  scrollX: true, 
  //  //  scrollCollapse: true,
  //   //  columnDefs:  [ {
  //   //    'targets': [0], // column index (start from 0)
  //   //    'orderable': false,
  //   //   // set orderable false for selected columns
  //   //   }],
  //   };
  //   this.dtOptions[1] = {
  //     order: [[1, 'asc']],
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     lengthMenu: [
  //       [10, 20, 30, -1],
  //       [10, 20, 30, 'All'],
  //     ],    
      
  //   //  scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
  //   //  scrollX: true, 
  //   //  scrollCollapse: true,
  //     columnDefs:  [ {
	// 			'targets': [0], // column index (start from 0)
	// 			'orderable': false,
  //      // set orderable false for selected columns
	// 		 }],
  //     }
  //   this.loadApiSequinceApi();
  //   this.onApiSequencingActivityCompleted
  // }


  // loadApiSequinceApi(){
  //   this.apisUpdatedSubscription = this.orchestrationService.onApisSelectionUpdated().subscribe((result:any) => {
  //     this.projectOrchestrationApis = result.apis;
  //     this.hasUpdatedApiSequence = result.hasUpdated;
  //     this.orchestrationService.publishSequencedApis(this.projectOrchestrationApis);
  //   })
  // }

  // onApiSequencingActivityCompleted(){
  //   this.apisSequenceCompletedSubscription = this.orchestrationService.onApiSequencingActivityCompleted().subscribe(result=>{
  //     this.orchestrationService.publishSequencedApis(this.projectOrchestrationApis);
  //   }, error=>{})
  // }

  
  // ngOnDestroy() {
  //   this.apisUpdatedSubscription.unsubscribe()
  //   //this.apisSequenceCompletedSubscription.unsubscribe();
  // }

 

}
