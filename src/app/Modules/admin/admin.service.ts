import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}

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

  getListWorkflowConfigData(project_id: any) {
    return this.httpClient.get(
      APIEndpoint +
        '/projects/' +
        project_id +
        '/workflow/configurations'
    );
  }

  // admin-manage-project API call
  getUserGroups() {
    return this.httpClient.post(
      APIEndpoint + '/user-groups/get/v1',
      {},
      this.httpOptions()
    );
  }

  userStatusForGroup(body: any) {
    return this.httpClient.put(
      APIEndpoint + `/users/group/status`,
      body
    );
  }

  editUserGroup(body: any) {
    return this.httpClient.put(APIEndpoint + `/user-groups/v1`, body);
  }

  getDomain() {
    return this.httpClient.post(APIEndpoint + '/domains/get', '');
  }

  createUserGroups(body: any) {
    return this.httpClient.post(APIEndpoint + '/user-groups', body);
  }

  addUser(body: any) {
    return this.httpClient.post(APIEndpoint + '/users/v1', body);
  }

  createDuplicateUserGroups(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/user-groups/duplicate',
      body
    );
  }

  deleteUserGroup(body: any) {
    return this.httpClient.post(
      APIEndpoint + `/user-groups/delete/v1`,
      body
    );
  }

  deleteUser(body: any) {
    return this.httpClient.post(APIEndpoint + `/users/delete/v1`, body);
  }
  /*
  addUser(body) {
    return this.http.post(APIEndpoint + '/users/v1', body, this.httpOptions());
  } */

  getUser() {
    return this.httpClient.post(
      APIEndpoint + '/users/get/v1',
      {},
      this.httpOptions()
    );
  }

  getUserDetailsbyId(body: any) {
    return this.httpClient.post(
      APIEndpoint + `/users/get-by-id`,
      body,
      this.httpOptions()
    );
  }
  getRoles() {
    return this.httpClient.post(
      APIEndpoint + '/roles/get',
      '',
      this.httpOptions()
    );
  }

  userStatus(body: any) {
    return this.httpClient.put(
      APIEndpoint + `/users/v1`,
      body,
      this.httpOptions()
    );
  }

  editUserGroupAndRoles(body: any) {
    return this.httpClient.put(
      APIEndpoint + `/users/v1`,
      body,
      this.httpOptions()
    );
  }

  addAndRemoveUserInGroup(body: any) {
    return this.httpClient.put(
      APIEndpoint + `/user-groups/users`,
      body,
      this.httpOptions()
    );
  }

  getProject() {
    return this.httpClient.post(
      APIEndpoint + '/projects/get',
      '',
      this.httpOptions()
    );
  }

  saveProject(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/projects',
      body,
      this.httpOptions()
    );
  }

  deleteProject(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/projects/delete',
      body,
      this.httpOptions()
    );
  }

  editProject(body: any) {
    return this.httpClient.put(
      APIEndpoint + '/projects',
      body,
      this.httpOptions()
    );
  }

  projectPerformance(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/documents/project-performance',
      body,
      this.httpOptions()
    );
  }

  projectDocument(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/documents/get',
      body,
      this.httpOptions()
    );
  }

  submitFailedDocuments(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/documents/reprocess',
      body,
      this.httpOptions()
    );
  }

  projectValidation(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/projects/validation',
      body,
      this.httpOptions()
    );
  }

  getCurrentUserRoles(payload: any) {
    return this.httpClient.post(
      APIEndpoint + `/users/roles/v1`,
      payload,
      this.httpOptions()
    );
  }
}
