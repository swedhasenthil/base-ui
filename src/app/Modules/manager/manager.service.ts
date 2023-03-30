import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

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
  documentDetails = new BehaviorSubject(null)
  documentUser = new BehaviorSubject(null)
  constructor(private httpClient:HttpClient) { }

  listProjects(body:any) {
    return this.httpClient.post(
    environment.APIEndpoint+ `/projects/get-by-role`,
      body,
      this.httpOptions()
    );
  }
  getProjectDocument(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/get',
      body,
      this.httpOptions()
    );
  }

  getRoles() {
    return this.httpClient.post(environment.APIEndpoint + '/roles/get/', '', this.httpOptions());
  }
  getDocumentTimeline(documentId: string) {
    return this.httpClient.get(
      environment.APIEndpoint + `/documents/${documentId}/logs`,
      this.httpOptions()
    );
  }
  unlockThisProjectDocs(projectId: string) {
    return this.httpClient.post(
      environment.APIEndpoint + `/documents/unlock?project_id=${projectId}`,
      {},
      this.httpOptions()
    );
  }
  fetchUsersOfGivenRoleAndProject(roleId: any, projectId: any) {
    return this.httpClient.get(
      environment.APIEndpoint + `/users/document-assignees?project=${projectId}&role=${roleId}`,
      this.httpOptions()
    );
  }

  assignUserToThisDocument(payload: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/assign-user',
      payload,
      this.httpOptions()
    );
  }

  reAssignUserToThisDocument(payload: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/reassign-user',
      payload,
      this.httpOptions()
    );
  }

  fetchADocumentById(docId:any) {
    return this.httpClient.get(
      environment.APIEndpoint+ `/documents/${docId}`,
      this.httpOptions()
    );
  }
  getDocumentsProccessed(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/documents-processed',
      filters,
      this.httpOptions()
    );
  }

  getPagesProccessed(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/pages-processed',
      filters,
      this.httpOptions()
    );
  }

  getStraightThroughProcessing(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/straight-through-processing',
      filters,
      this.httpOptions()
    );
  }
  machineLevelAccuracyAnalyst(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/machine-accuracy-analyst',
      filters,
      this.httpOptions()
    );
  }

  machineLevelAccuracyQC(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/machine-accuracy-qc',
      filters,
      this.httpOptions()
    );
  }

  averageTimeSpent(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/average-time-spent',
      filters,
      this.httpOptions()
    );
  }

  dailyPerformancereport(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/daily-performance-report',
      filters,
      this.httpOptions()
    );
  }
  analystAccuracy(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/analyst-accuracy',
      filters,
      this.httpOptions()
    );
  }

  reasonsToReject(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/reasons-for-rejection',
      filters,
      this.httpOptions()
    );
  }
  dailyVolume(filters: any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/daily-volume',
      filters,
      this.httpOptions()
    );
  }

  documentTimelineValue(document:any){
    this.documentDetails.next(document)
  }

  documentReAssignUser(document:any){
    this.documentUser.next(document)
  }

}
