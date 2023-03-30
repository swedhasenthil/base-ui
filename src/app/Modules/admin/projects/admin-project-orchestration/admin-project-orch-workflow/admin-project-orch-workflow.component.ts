import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import * as backbone from 'backbone';
import * as joint from 'jointjs';
//import { OrchestrationService } from 'src/app/services/orchestration.service';
import { Subscription } from 'rxjs';
import { OrchestrationService } from '../../../orchestration.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

import * as $ from "jquery";

const RECT_COLOUR = 'blue';
const TEXT_COLOUR = 'white'
const RECT_WIDTH = 150;
const RECT_HEIGHT = 40;
const RECT_WIDTH_PER_CHAR = 6.8;

const X_POSITION = 100;
const ARROW_HEAD = "M 10 0 L 0 5 L 10 10 z";
const LINK_TYPE = "devs.Link";
const RECT_TYPE = "basic.Rect";
const WF_UI_WIDTH = 2400;
const WF_UI_HEIGHT = 350;
const WF_SELECTED_API_STARTING_POSITION = 20;
const WF_SELECTED_API_VERTICAL_SPACE = 30;

const API_ID_KEY = "api_id";
const API_ID_NAME = "api_name";
const ID_TYPE = "id";
const NAME_TYPE = "name";

const DEFAULT_WF_ERROR_MSG = "Ensure all APIs are connected properly and there is no circular loop";
// declare var $:any;
// declare var jQuery: any;

@Component({
  selector: 'app-admin-project-orch-workflow',
  templateUrl: './admin-project-orch-workflow.component.html',
  styleUrls: ['./admin-project-orch-workflow.component.scss']
})
export class AdminProjectOrchWorkflowComponent implements OnInit {

  
  receiveSequencedApisSubscription: Subscription;
  submitWorklowSubjectSubscription:Subscription;
  projectId: string = "";
  sequencedApis: any;
  sequencedApisMapper: any;
  graph: any;
  workflow: any;
  list:any
  @Output() workflowSubmitted = new EventEmitter();
  constructor(
    private orchestrationService: OrchestrationService,  
    public toastService:ToasterService,
  ) {

   this.submitWorklowSubjectSubscription=this.orchestrationService.submitWorklowSubject.subscribe(data=>{
     this.list=localStorage.getItem("selectedAPIforSequence");
     this.sequencedApis=JSON.parse(this.list);
      this.updateWorkflowNav();
     
    })


    this.receiveSequencedApisSubscription = orchestrationService.onPublishSequencedApis().subscribe((result:any)=>{
      this.sequencedApis = result;
      this.sequencedApisMapper = {};
      this.sequencedApis.forEach((element:any) => {
        this.sequencedApisMapper[element._id] = element;
      }); 
      if(this.workflow) {
        this.resetWorkflow(this.workflow, this.sequencedApis);
      } else {
        this.workflow = this.orchestrationService.workflow ? JSON.parse(this.orchestrationService.workflow) : null;
        this.workflow ? this.resetWorkflow(this.workflow, this.sequencedApis) : "";
      }
      this.initializeWorkflow();
    })
  }

  wfStepBackBtnClicked() {
    this.workflow = this.graph.toJSON();
  }

  ngOnInit() {
    this.load();
    this.projectId = this.orchestrationService.projectId;
    if(!this.projectId) return;
  }

  load(){
   // this.list=localStorage.getItem("selectedAPIforSequence");
   // this.sequencedApis = this.sequencedApis=JSON.parse(this.list);
    this.sequencedApis =this.orchestrationService.getSelectedApi
    this.sequencedApisMapper = {};
    if(this.sequencedApis != null && this.sequencedApis != undefined)  {
      this.sequencedApis.forEach((element:any) => {
        this.sequencedApisMapper[element._id] = element;
      }); 
    }
    
   
    if(this.workflow) {
      this.resetWorkflow(this.workflow, this.sequencedApis);
    } else {
      this.workflow = this.orchestrationService.workflow ? JSON.parse(this.orchestrationService.workflow) : null;
      this.workflow ? this.resetWorkflow(this.workflow, this.sequencedApis) : "";
    }
    this.initializeWorkflow();
  }

  ngOnViewInit() {
    
  }

  initializeWorkflow() {
    const paperElement = $("#paper");
    let paper;

    if(this.workflow) {
      this.graph = new joint.dia.Graph({}, {cellNamespace: joint.shapes});
      this.graph.fromJSON(this.workflow);
    } else {
      this.graph = new joint.dia.Graph;
    }

    paper = new joint.dia.Paper({
       el: paperElement,
      width: WF_UI_WIDTH,
      height: WF_UI_HEIGHT,
      model: this.graph,
      gridSize: 1,
      cellViewNamespace: joint.shapes,
    //   background: {
    //     color: 'rgba(0, 255, 0, 0.3)'
    // },
      defaultLink: new joint.shapes.devs.Link({
        attrs: {
          '.marker-target': {
            d: ARROW_HEAD
          }
        }
      })
    });
    this.drawWorkflow(this.graph, this.sequencedApis);
  }



  getARectangleStage(textValue:any, apiId=null, xPosition=X_POSITION, yPosition = RECT_WIDTH) {
    const width = Math.ceil(RECT_WIDTH_PER_CHAR*(textValue.length))+2;
     let rect = new joint.shapes.basic.Rect({
      position: { x: xPosition, y: yPosition },
      size: { width: width, height: RECT_HEIGHT },
      attrs: { text: { text: textValue, api_id:apiId, magnet: true } }
    });
    return rect;
  }

  drawWorkflow(graph:any, graphData:any) {

      let xPosition = WF_SELECTED_API_STARTING_POSITION;
      let yPosition = RECT_HEIGHT;
   if(graphData != null && graphData != undefined)  {
        
      graphData.forEach((api:any) => {
        if(!this.isPartOfExistingWorkflow(api, this.workflow)) {
          // Create stages
          this.getARectangleStage(api.api_name, api._id, xPosition, yPosition).addTo(graph);
          // xPosition += 2;
          yPosition = yPosition + WF_SELECTED_API_VERTICAL_SPACE;
          if (yPosition > WF_UI_HEIGHT - RECT_HEIGHT) {
            xPosition += RECT_WIDTH + 5;
            yPosition = RECT_HEIGHT;
          }
        }
      }); 
    } 
  }

  updateWorkflow() {
    if(!this.sequencedApis.length) {    
      this.toastService.add({
        type: 'warning',
        message: 'There are no APIs in the workflow'
      });	
      return;
    }
    if(!this.graph) return;
    let wf = this.graph.toJSON();
    let wfMapper:any = {};
    let wfMapperApiNames:any = {};
    let wfMapperApiIds:any = {};
    let apisMapper:any = {};
    let startApi:any;
    let stages = 0;
    try {
      wf.cells.forEach((e:any) => {
        if (e.type == LINK_TYPE) {
          if (wfMapper[e.source.id]) {
            wfMapper[e.source.id].push(e.target.id);
          } else {
            wfMapper[e.source.id] = []
            wfMapper[e.source.id].push(e.target.id);
          }
        } else if(e.type == RECT_TYPE) {
          ++stages;
          apisMapper[e.id] = {};
          apisMapper[e.id][API_ID_KEY] = e.attrs.text.api_id;
          apisMapper[e.id][API_ID_NAME] = e.attrs.text.text;
        }
      })
      wf.cells.forEach((e:any) => {
        if (e.type == LINK_TYPE) {
          const sName = apisMapper[e.source.id][API_ID_NAME];
          const tName = apisMapper[e.target.id][API_ID_NAME];
          const sId = apisMapper[e.source.id][API_ID_KEY];
          const tId = apisMapper[e.target.id][API_ID_KEY];
          if (wfMapperApiIds[sId]) {
            wfMapperApiIds[sId].push(tId);
            wfMapperApiNames[sName].push(tName);
          } else {
            wfMapperApiIds[sId] = []
            wfMapperApiIds[sId].push(tId);
            wfMapperApiNames[sName] = []
            wfMapperApiNames[sName].push(tName);
          }
        }
      })  
    } catch (error) {    
      this.toastService.add({
        type: 'warning',
        message: DEFAULT_WF_ERROR_MSG
      });
      return;
    }
    
    // get start API
    startApi = this.getStartApi(wfMapper, apisMapper);
    if(!startApi) {
      this.toastService.add({
        type: 'warning',
        message: DEFAULT_WF_ERROR_MSG
      });
    }
    const sequencedApisIds = this.getSequencedApis(startApi, wfMapperApiIds, ID_TYPE);
    if(stages != sequencedApisIds.count){
      if(sequencedApisIds.count == -1) {
        this.toastService.add({
          type: 'warning',
          message: 'Could not submit, since workflow has loop'
        }); 
        return;
      }
      this.toastService.add({
        type: 'warning',
        message: DEFAULT_WF_ERROR_MSG
      }); 
      return;
    }
    const projectOrchestration = {
      project_id: this.projectId?this.projectId:localStorage.getItem('projectId'),
      apis: this.getSequencedApisJSON(sequencedApisIds.sequencedApis),
      workflow: JSON.stringify(wf) 
    };

    this.orchestrationService.updateProjectOrchestration(localStorage.getItem('projectId'), projectOrchestration).subscribe(result => {
      this.toastService.add({
        type: 'success',
        message: "Updated the orchestration workflow"
      })
      this.workflowSubmitted.emit();
    }, error => {});
  }

  getStartApi(wfMapper:any, apisMapper:any) {
    const keys = Object.keys(wfMapper);
    const nestedValues = this.getFlattenArray(Object.values(wfMapper));
    const values = [... new Set(nestedValues)];
    for(let index in keys) {
        const key = keys[index];
        const match = values.find(value => value == key);
        if(!match) {
            return {
                api_name: apisMapper[key].api_name, 
                api_id: apisMapper[key].api_id, 
                id: key
            }
        }
            
    }
    return
  }

  getFlattenArray(elements:any) {
    let temp:any = [];
    elements.forEach((innerElements:any) => {
      innerElements.forEach((element:any) => {
        temp.push(element)
      });
    });
    return temp;
  }

  getSequencedApis(startApi:any, wfMapperApis:any, type:any) {
    let count = 1;
    let keys = type == ID_TYPE? [startApi.api_id] : [startApi.api_name];
    let seq= 1;
    let sequencedApis:any = {};
    let wfApis:any = [];
    wfApis.push(keys[0]);
    sequencedApis[seq] = keys;
    while(keys && keys.length > 0) {
      ++seq;
      sequencedApis[seq] = [];
      keys.forEach(element => {
        if(wfMapperApis[element]) {
          wfMapperApis[element].forEach((element:any) => {            
            if (!(sequencedApis[seq].indexOf(element) != -1)) {
              sequencedApis[seq].push(element);
              if(wfApis.indexOf(element) == -1) {
                wfApis.push(element);
              }
              count++;
            }
          });
        }
      });
      keys = sequencedApis[seq];
      if(wfApis.length > this.sequencedApis.length){
        return {sequencedApis:null, count: wfApis.length};
      }
    }
    return {sequencedApis, count:wfApis.length};
  }
  getSequencedApisJSON(sequencedApis:any) {

    let sequenceObj:any = [];
    for (const sequence in sequencedApis) {
      sequencedApis[sequence].forEach((api:any, index:any) => {
        const nextSeqApi = sequencedApis[Number(sequence) + 1];
        sequenceObj.push({
          sequence: sequence,
          orchestration_api: api,
          pending_status: (!nextSeqApi || nextSeqApi.length == 0) ? 'NA' : this.getPendingStatus(nextSeqApi),
          failure_status: this.getFailureStatus(api)
        });
      });
    }
    return sequenceObj;
  }
  getFailureStatus(apiId:any): string{
    const stageName = this.sequencedApisMapper[apiId]["stage_name"];
    const apiName = this.sequencedApisMapper[apiId]["name"];
    const statusMsg = stageName? stageName: apiName;
    return `Failed ${statusMsg}`;
  }

  getPendingStatus(apis:any): string {
    const lastIndex = apis.length - 1;
    const nextSeqApiId = apis[lastIndex];
    const nextStageName = nextSeqApiId? this.sequencedApisMapper[nextSeqApiId]["stage_name"] : 'NA';
    const nextApiName = this.sequencedApisMapper[nextSeqApiId]["name"];
    const statusMsg = nextStageName? nextStageName: nextApiName;
    return `Pending ${statusMsg}`;
  }
  isPartOfExistingWorkflow(api:any, workflow:any) {
    if(!api || !workflow || !workflow.cells) {
      return false;  
    }
    const tempApi = workflow.cells.find((e:any) => {
    if (e.type == RECT_TYPE && (e?.attrs?.text?.api_id === api._id)) {
        return true;
      }
      return
    })
    return tempApi? true : false;
  }

  resetWorkflow(workflow:any, sequencedApis:any) {
    let sequencedApisMapper:any = {};
    let wfApisMapper:any = {};
    sequencedApis.forEach((element:any) => {
      sequencedApisMapper[element._id] = element._id;
    });

    this.workflow.cells = this.workflow.cells.filter((e:any, index:any) => {
      if(e && e.type == RECT_TYPE) {
        const tempApi = e?.attrs?.text?.api_id;
        if(sequencedApisMapper[tempApi]) {
          return e;
        } else {
          wfApisMapper[e.id] = e.id;
        }
      } else {
        return e;
      }
    })
    if(Object.keys(wfApisMapper).length) {
      this.workflow.cells = this.workflow.cells.filter((e:any, index:any) => {
        if(e && e.type == LINK_TYPE) {
          const sid = e.source.id;
          const tid = e.target.id;
          if(wfApisMapper[sid] || wfApisMapper[tid]) {} 
          else {
            return e;
          }
        } else {
          return e;
        }
      })
    }
  }
  
  updateWorkflowNav() {
    this.updateWorkflow();
    this.workflow = this.graph.toJSON();
  }

  ngOnDestroy() {
    this.receiveSequencedApisSubscription.unsubscribe();
    this.submitWorklowSubjectSubscription.unsubscribe();
  }

}
