import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class OrchestrationService {

  private _projectName: string = "";
  private _projectId : string = "";
  private _project:any;
  private _selectedApis :Array<any> = [];
  private _apisSelectionUpdated = new Subject<any>();
  private _apisSequenceDone = new Subject<any>();
  private _publishSequencedApis = new Subject<any>();
  private _workflowUpdated = new Subject<any>();
  private _workflowStepBackBtnClicked = new Subject<any>();
  public selectApiCountSubject=new BehaviorSubject(null);
  public submitWorklowSubject=new BehaviorSubject(null);
  private _workflow: any;
  private _selectedAPIforSequence:any;


  constructor(
    private http: HttpClient
  ) { }

  


  httpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token'),
      }),
      withCredentials: true,
    };
  }

  moveToSequinceApi(selectedAPICount:any){
    this.selectApiCountSubject.next(selectedAPICount);
  }

  submitWorkFlow(){
    this.submitWorklowSubject.next(null);
  }

  listOrchestrationApis() {
    return this.http.get(
      APIEndpoint + '/orchestration-apis',
      this.httpOptions()
    );
  }

  
  getOrchestrationApi(apiId:any) {
    return this.http.get(
      APIEndpoint + `/orchestration-apis/${apiId}`,
      this.httpOptions()
    );
  }

  updateOrchestrationApi(orchestrationApi:any) {
    return this.http.put(
      APIEndpoint + `/orchestration-apis`,
      orchestrationApi,
      this.httpOptions()
    );
  }

  deleteOrchestrationApi(apiId:any) {
    return this.http.delete(
      APIEndpoint + `/orchestration-apis/${apiId}`,
      this.httpOptions()
    );
  }

  fetchProjectOrchestrationDetails(id:any) {
    return this.http.get(
      APIEndpoint + `/projects/${id}/orchestration`,
      this.httpOptions()
    );
  }

  updateProjectOrchestration(id:any, projectOrchestration:any) {
    return this.http.post(
      APIEndpoint + `/projects/${id}/orchestration`,
      projectOrchestration,
      this.httpOptions()
    );
  }

  getProjectsList(body: any) {
    return this.http.post(
      environment.baseUrl + '/projects/get-by-role',
      body
    );
  }

  getWorkflowOrchestrationProjectsList(body: any) {
    return this.http.post(
      environment.baseUrl + '/projects/get',
      body
    );
  }

  set projectName(projectName) {
    this._projectName = projectName;
  }

  get projectName() {
    return this._projectName;
  }

  set projectId(id:any) {
    this._projectId = id;
  }

  get projectId() {
    return this._projectId;
  }

  set selectedApis(apis:any) {
    this._selectedApis = apis;
  }

  get selectedApis() {
    return this._selectedApis;
  }

  set workflow(wf:any) {
    this._workflow = wf;
  }

  get workflow() {
    return this._workflow;
  }
  set project(project) {
    this._project = project;
  }

  get project() {
    return this._project;
  }

  
  set setSelectedApi(project:any) {
    this._selectedAPIforSequence = project;
  }

  get getSelectedApi() {
    return this._selectedAPIforSequence;
  }

  informApisSelectionUpdated(apis:any, hasUpdated:any, hasWorkflow:any) {
    this._apisSelectionUpdated.next({apis, hasUpdated, hasWorkflow});
  }

  onApisSelectionUpdated() {
    return this._apisSelectionUpdated.asObservable();
  }

  apiSequencingActivityCompleted() {
    this._apisSequenceDone.next(null)
  }
  
  onApiSequencingActivityCompleted() {
    return this._apisSequenceDone.asObservable();
  }

  publishSequencedApis(sequencedApis:any) {
    this._publishSequencedApis.next(sequencedApis);
  }
  
  onPublishSequencedApis() {
    return this._publishSequencedApis.asObservable();
  }


}
