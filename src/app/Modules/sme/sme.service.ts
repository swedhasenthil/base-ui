import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmeService {
  private _metaDataConfigureDoc: any;
  private _metaDataTrainingDoc: any
  private _projectDetails: any;
  public refrestWorkflowList = new Subject<any>();
  WorkflowObservable = this.refrestWorkflowList.asObservable();
  reviewDocumentId: any;
  projectRulesMappedWithDocTypes: any;
  projectRulesMappedWithIds: any;
  workflowRules: any;
  workflowRuleIds: any;
  projectRulesMappedWithStatus: any;
  addEditRuleSubject = new BehaviorSubject({ action: null, editRuleData: null });
  refreshRulesListSubject = new BehaviorSubject(null);
  leftAttributes = new BehaviorSubject(null);
  rightAttributes = new BehaviorSubject(null);
  selectedAttributes = new BehaviorSubject(null);
  fieldValue = new BehaviorSubject(null);
  updateDocId = new BehaviorSubject(null);
  submitFinalArr = new BehaviorSubject(null);
  masterIndex = new BehaviorSubject(null);
  listOfPoject = new BehaviorSubject(null);
  projectExpandValue = new BehaviorSubject(null);
  DocumentForm = new BehaviorSubject(null);
  headerValue = new BehaviorSubject(null);
  EditStatus = new BehaviorSubject(null);
  SelectedIndex = new BehaviorSubject(null);
  indexAttributes =  new BehaviorSubject(null);
  constructor(private httpClient: HttpClient,
    private toastr: ToasterService,
    private authService: AuthService,) { }

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
  set projectDetils(projectDetaile: any) {
    this._projectDetails = projectDetaile;
  }

  get projectDetails() {
    return this._projectDetails;
  }

  set metaDataConfigureDoc(metaDataConfigureDoc) {
    this._metaDataConfigureDoc = metaDataConfigureDoc;
  }

  get metaDataConfigureDoc() {
    return this._metaDataConfigureDoc;
  }

  set metaDataTrainingDoc(metaDataTrainingDoc: any) {
    this._metaDataTrainingDoc = metaDataTrainingDoc;
  }

  get metaDataTrainingDoc() {
    return this._metaDataTrainingDoc;
  }
  // calibrate document form for edit and new
  setDocumentFrom(value: any, header: any) {
    this.DocumentForm.next(value)
    console.log("header", header)
    this.headerValue.next(header)
  }
  setEditStatus(status: any) {
    this.EditStatus.next(status)
  }
  reloadWorkflowList() {
    // debugger
    this.refrestWorkflowList.next(null);
  }

  getProjectList(body: any) {
    return this.httpClient.post(environment.APIEndpoint + `/projects/get-by-role`, body);
  }
  updateProject(body: any) {
    return this.httpClient.put(environment.APIEndpoint + '/projects/', body);
  }
  getListWorkflowDropdownConfigData(project_id: any) {
    return this.httpClient.get(
      environment.APIEndpoint + `/projects/${project_id}/workflow/destinations`
    );
  }
  //List of workflow Config data  details
  getListWorkflowConfigData(project_id: any) {
    return this.httpClient.get(environment.APIEndpoint + '/projects/' + project_id + '/workflow/configurations', this.httpOptions());
  }

  deleteWorkflowConfigDocument(project_id: number, workflow_configuration_id: number) {
    return this.httpClient.delete(environment.APIEndpoint + `/projects/${project_id}/workflow/configurations/${workflow_configuration_id}`, this.httpOptions());
  }

  //List of workflow Destination Dropdown  details
  getDestinationList(project_id: number) {
    return this.httpClient.get(environment.APIEndpoint + `/projects/${project_id}/workflow/destinations`, this.httpOptions());
  }


  submit(body: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/projects-document-types/',
      body,
      this.httpOptions()
    );
  }

  addNewWorkflow(project_id: any, body: any) {
    return this.httpClient.post(environment.APIEndpoint + `/projects/${project_id}/workflow/configurations`, body, this.httpOptions());
  }
  // editWorkflowDataApi(project_id:any, workflow_configuration_id:any, wf_config_data:any) {
  //   return this.httpClient.put(
  //     environment.APIEndpoint + `/projects/${project_id}/workflow/configurations/${workflow_configuration_id}`,     
  //     wf_config_data,
  //     this.httpOptions()
  //   );
  // }
  getWorkflowRuleList(project_id: number) {
    return this.httpClient.get(environment.APIEndpoint + `/projects/${project_id}/workflow/rules`);
  }

  getDocumentType() {
    return this.httpClient.post(environment.APIEndpoint + '/document-types/get', {});
  }
  getProjectDocumentType(projectID: any) {
    return this.httpClient.post(environment.APIEndpoint + '/projects-document-types/get', { project_id: projectID });
  }

  addRule(project_id: any, body: any) {
    return this.httpClient.post(environment.APIEndpoint + `/projects/${project_id}/workflow/rules`, body);
  }
  deleteRule(project_id: number, workflow_rule_id: number) {
    return this.httpClient.delete(environment.APIEndpoint + `/projects/${project_id}/workflow/rules/${workflow_rule_id}`);
  }
  createRuleDataApi(project_id: any, body: any) {
    return this.httpClient.post(
      environment.APIEndpoint + `/projects/${project_id}/workflow/rules`,
      body,
      this.httpOptions()
    );
  }

  getCalibrateDocumentsList() {
    return this.httpClient.post(environment.APIEndpoint + '/document-types/get/v1', {});
  }


  addTrainingDocumentData(body: any) {
    return this.httpClient.post(environment.APIEndpoint + '/training-data', body);
  }

  addGoldenDocumentData(body: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/golden-data', body);
  }

  updateDocumentStatus(body: any) {
    return this.httpClient.put(environment.APIEndpoint + `/document-types`, body);
  }
  addDocument(body: any) {
    return this.httpClient.post(environment.APIEndpoint + '/document-types', body);
  }

  deleteDocument(body: any) {
    return this.httpClient.post(environment.APIEndpoint + `/document-types/delete`, body);
  }
  getListOfModelApi() {
    return this.httpClient.get(environment.APIEndpoint + '/versioned-model-apis?is_active=true');
  }
  getReferenceData1() {
    return this.httpClient.post(environment.APIEndpoint + `/reference-data/get`, {});
  }

  //List of training data document details
  getListTrainingDocument(document_type_id: any) {
    return this.httpClient.get(environment.APIEndpoint + '/training-data/' + document_type_id + '/docs');
  }
  getListGoldenDataDocument(document_type_id: any) {
    return this.httpClient.get(environment.APIEndpoint + '/golden-data/' + document_type_id + '/docs',);
  }

  submit_attribures(body: any) {
    return this.httpClient.post(environment.APIEndpoint + '/projects-document-types/', body);
  }

  editWorkflowDataApi(project_id: any, workflow_configuration_id: any, wf_config_data: any) {
    return this.httpClient.put(environment.APIEndpoint + `/projects/${project_id}/workflow/configurations/${workflow_configuration_id}`, wf_config_data);
  }

  deleteTrainingDocument(document_type_id: any) {
    return this.httpClient.delete(environment.APIEndpoint + `/training-data/${document_type_id}`);
  }


  token = localStorage.getItem('token');
  private _modelApi: any;



  getReferenceData() {
    return this.httpClient.post(
      environment.APIEndpoint + `/reference-data/get`, '',
      this.httpOptions()
    );
  }
  addReferenceData(body: any) {
    return this.httpClient.post(
      environment.APIEndpoint + `/reference-data`, body,
      this.httpOptions()
    );
  }
  deleteDocType(docTypeID: any, projectId: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/projects-document-types/delete/',
      { document_type_id: docTypeID, project_id: projectId },
      this.httpOptions()
    );
  }
  // submit(body:any) {
  //   return this.httpClient.post(
  //     environment.APIEndpoint + '/projects-document-types/',
  //     body,
  //     this.httpOptions()
  //   );
  // }
  editDocType(body: any) {
    return this.httpClient.put(
      environment.APIEndpoint + '/projects-document-types/',
      body,
      this.httpOptions()
    );
  }
  updateRefrenceData(body: any) {
    return this.httpClient.put(
      environment.APIEndpoint + `/reference-data`, body,
      this.httpOptions()
    );
  }

  deleteReferenceData(body: any) {
    return this.httpClient.post(
      environment.APIEndpoint + `/reference-data/delete`, body,
      this.httpOptions()
    );
  }
  addGoldenFailedDocumentData(body: any) {

    return this.httpClient.put(
      environment.APIEndpoint + '/golden-data/re-upload',
      body,
      this.httpOptions()
    );
  }
  getModelApis() {
    return this.httpClient.get(
      environment.APIEndpoint + '/model-apis',
      this.httpOptions()
    );
  }
  set modelApi(modelApi) {
    this._modelApi = modelApi;
  }

  get modelApi() {
    return this._modelApi;
  }
  getVersionedModelApis(modelApiId: any) {
    return this.httpClient.get(
      environment.APIEndpoint + '/versioned-model-apis?modelApiId=' + modelApiId,
      this.httpOptions()
    );
  }

  makeVersion(modelApiMetaData: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/versioned-model-apis',
      modelApiMetaData,
      this.httpOptions()
    );
  }

  changeVersionedApiStatus(versionedModelApiIdAndStatus: any) {
    return this.httpClient.put(
      environment.APIEndpoint + '/versioned-model-apis/' + versionedModelApiIdAndStatus.id,
      versionedModelApiIdAndStatus,
      this.httpOptions()
    );
  }
  benchmarkVersionedModelApi(payload: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/versioned-model-apis/benchmarking',
      payload,
      this.httpOptions()
    );
  }
  deleteGoldenDocument(document_type_id: any) {
    return this.httpClient.delete(
      environment.APIEndpoint + `/golden-data/${document_type_id}`,
      this.httpOptions()
    );
  }
  getDocTypeUnderProject(projectID: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/projects-document-types/get',
      { project_id: projectID },
      this.httpOptions()
    );
  }
  //List of workflow rules data  details
  getListWorkflowRuleData(project_id: any) {
    return this.httpClient.get(
      environment.APIEndpoint + '/projects/' + project_id + '/workflow/rules',
      this.httpOptions()
    );
  }
  listReviewDataDocs(docTypeId: string, filter: string) {
    return this.httpClient.get(
      environment.APIEndpoint + '/review-data/' + docTypeId + '/docs' + filter,
      this.httpOptions()
    );
  }
  updateRuleDataApi(project_id: any, body: any) {
    return this.httpClient.put(
      environment.APIEndpoint + `/projects/${project_id}/workflow/rules`,
      body,
      this.httpOptions()
    );
  }
  assignReviewDataToUser(payload: { review_document_id: any; }) {
    return this.httpClient.put(
      environment.APIEndpoint + '/review-data/assign',
      payload,
      this.httpOptions()
    );
  }

  getReviewDataDocument(docTypeId: any) {
    return this.httpClient.get(
      environment.APIEndpoint + `/review-data/${docTypeId}/attributes_data`,
      this.httpOptions()
    );
  }

  submitReviewDataForReview(payload: any) {
    return this.httpClient.put(
      environment.APIEndpoint + '/review-data/review',
      payload,
      this.httpOptions()
    );
  }

  deleteReviewDocument(docTypeId: string) {
    return this.httpClient.delete(
      environment.APIEndpoint + `/review-data/${docTypeId}`,
      this.httpOptions()
    );
  }

  listStatusesOfReviewDoc() {
    return [{
      id: 1,
      value: "Pending"
    }, {
      id: 2,
      value: "In Progress"
    }, {
      id: 3,
      value: "Moved to TDS"
    }, {
      id: 4,
      value: "Moved to GDS"
    }, {
      id: 5,
      value: "Rejected"
    }]
  }
  validateBooleanWorkflowAndGetDocTypeId(booleanWorkflow: string = "") {
    this.workflowRules = this.getRulesFromBooleanWorkflow(booleanWorkflow);
    if (!this.workflowRules || this.workflowRules?.length == 0) {
      return { error: "Entered boolean workflow is invalid" }
    }
    const unavailableRulesInThisProject = this.workflowRules?.find((wf: string | number) => this.projectRulesMappedWithDocTypes[wf] == undefined);
    if (unavailableRulesInThisProject) {
      return { error: "Rules entered in the boolean workflow is not existing in this project" };
    }
    if (!this.isAllRulesBelongsToSameDocType(this.workflowRules)) {
      return { error: "All rules should belong to same document type in the entered boolean workflow" };
    }
    return this.projectRulesMappedWithDocTypes[this.workflowRules[0]];
  }

  getRulesFromBooleanWorkflow(booleanWorkflow: string = "") {
    let rules: string[] = [];
    booleanWorkflow = booleanWorkflow.toLowerCase();
    booleanWorkflow = booleanWorkflow.replace(/\(|\)|AND|OR|/gi, "");
    booleanWorkflow = booleanWorkflow.replace(/\s\s+/g, ' ');
    booleanWorkflow.split(" ").forEach(rule => {
      if (rule.trim()) {
        rules.push(rule);
      }
    });
    return rules;

  }

  getFormattedBooleanWorkflowInputForValidation(bw = "") {
    bw = "(" + bw + ")";
    bw = bw.replace(/ /g, "");
    bw = bw.replace(/\(/g, " ( ");
    bw = bw.replace(/\)/g, " ) ");
    bw = bw.replace(/AND|and/g, " AND ");
    bw = bw.replace(/OR|or/g, " OR ");
    bw = bw.replace(/\s\s+/g, ' ');
    return bw;
  }

  isAllRulesBelongsToSameDocType(workflowRules: any[]) {
    let hasDifferentDocTypes = true;
    this.workflowRuleIds = [];
    workflowRules.forEach((wfr: string | number, index: number) => {
      this.workflowRuleIds.push(this.projectRulesMappedWithIds[wfr]);
      if (index != 0) {
        if (this.projectRulesMappedWithDocTypes[wfr] != this.projectRulesMappedWithDocTypes[workflowRules[index - 1]]) {
          hasDifferentDocTypes = false;
        }
      }
    });
    return hasDifferentDocTypes;
  }

  isBracketsClosedProperly(exp = "") {
    let expArr = exp.split(" ");
    let count = 0;
    expArr.forEach(element => {
      if (element.trim() == "(") {
        count++;
      } else if (element.trim() == ")") {
        count--;
      }
    });
    return count == 0 ? true : false;
  }

  isConditionOperatorSurroundedwithValidData(expArr: string[], operatorIndex: number) {
    try {
      const prev = expArr[operatorIndex - 1]?.trim().toLowerCase();
      const next = expArr[operatorIndex + 1]?.trim().toLowerCase();
      if (prev != '(' && prev != 'and' && prev != 'or' &&
        next != ')' && next != 'and' && next != 'or'
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }

  }

  eachConditionsAreValid(expArr: any[], iteration = 1) {
    let start = -1;
    let end = -1;
    let rules = [];
    let condition: any;
    let isValid = true;
    expArr.forEach((element: string, index: number) => {
      const tempElement = typeof element == 'string' ? element.trim()?.toLowerCase() : element;
      if (!tempElement) {

      } else if (tempElement == "(") {
        start = index;
        end = -1;
        rules = [];
        condition = undefined;
      } else if (tempElement == ")") {
        end = index;
        expArr.splice(start, (end - start + 1), iteration);
        this.eachConditionsAreValid(expArr, iteration + 1);
      } else if (tempElement == "and" || tempElement == "or") {
        if (!this.isConditionOperatorSurroundedwithValidData(expArr, index)) {
          isValid = false;
        }
        if (!condition) {
          condition = tempElement
        } else {
          // different conditions used within the bracket
          condition != tempElement ? isValid = false : '';
        }

      } else {
        rules.push(tempElement);
      }
    });
    if (!isValid) { return isValid };
    if (start == end - 1) { return !isValid } // it is empty bracket
    if (rules.length == 0) { return !isValid }
    if (start != end) {
      expArr.splice(start, (end - start + 1), iteration);
      this.eachConditionsAreValid(expArr, iteration + 1);
    }
    return isValid;
  }

  isValidBooleanWorkflow(exp = "") {
    if (!exp.trim()) return false;

    if (!this.isBracketsClosedProperly(exp)) {
      return false;
    }

    let expArr = exp.split(" ");
    if (!this.eachConditionsAreValid(expArr)) {
      return false;
    }

    return true;

  }

  hasOnlyActiveRules(booleanWorkflow: string = "") {
    const wfRules = this.getRulesFromBooleanWorkflow(booleanWorkflow);
    const hasInactiveRules = wfRules.find(rule => this.projectRulesMappedWithStatus[rule] == false);
    return hasInactiveRules ? false : true;
  }

  addEditRule(action: any, editRuleData?: any) {
    let obj = { 'action': action, 'editRuleData': editRuleData }
    this.addEditRuleSubject.next(obj);
  }

  refreshRulesList() {
    this.refreshRulesListSubject.next(null);
  }

  // configure project updated function 
  updatedProjectDocument(req: any, name: any) {
    this.updateProject(req).subscribe(
      (dataResult: any) => {
        const updateAnalystBypassInProjectResponse: any = dataResult;
        if (!updateAnalystBypassInProjectResponse.error) {
          this.toastr.add({
            type: 'success',
            message: name + 'updated Succesfully!',
          });
        }
      },
      (err: { status: any; }) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: name + 'cannot update',
        });
      }
    );
  }
  setAttributes(leftValue: any, rightValue: any) {
    this.leftAttributes.next(leftValue);
    this.rightAttributes.next(rightValue);
  }
  setSelectedAttributes(selectValue: any){
    this.selectedAttributes.next(selectValue)

  }
  setSlectedFieldType(fieldValue: any,index:any) {
    this.fieldValue.next(fieldValue);
    this.indexAttributes.next(index)
  }
  documentSubmitValue(updateId: any, finalArr: any) {
    this.updateDocId.next(updateId)
    this.submitFinalArr.next(finalArr)
  }
  setExpandRowValue(event: any, masterIndex: any, list: any) {
    this.masterIndex.next(masterIndex);
    this.listOfPoject.next(list);
    this.projectExpandValue.next(event)
  }

}
