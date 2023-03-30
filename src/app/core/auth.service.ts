import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
// import { OverlayService } from 'src/app/services/overlay.service';
import { Router } from '@angular/router';

// const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentProjectId: string;
  public currentUserId: string;
  public currentUserRoleId: string;
  public currentUserRoleName: string;
  public currentUserProjectsArray: any = [];
  httpOptions: any;
  token = localStorage.getItem('token');
  loginDetails: any;
  // private overlay: OverlayService,
  constructor(
    private http: HttpClient,
    public router: Router,
    public toastService:ToasterService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + this.token,
      }),
      withCredentials: true,
    };
  }

  // Getters and Setters for variables
  getCurrentProjectId() {
    return this.currentProjectId;
  }

  setCurrentProjectId(newProjectId: any) {
    this.currentProjectId = newProjectId;
  }

  getCurrentUserId() {
    if (!this.currentUserId) {
      return localStorage.getItem('currentUserId');
    }
    return this.currentUserId;
  }

  setCurrentUserId(newUserId: any) {
    this.currentUserId = newUserId;
  }

  getCurrentUserRoleName() {
 
    return this.currentUserRoleName;
  }

  setCurrentUserRoleName(newRole: any) {
    this.currentUserRoleName = newRole;
 
  }

  setCurrentUserRoleId(newRoleId: any) {
    this.currentUserRoleId = newRoleId;
  }

  getCurrentUserRoleId() {
    return this.currentUserRoleId;
  }

  getCurrentUserProjectsArray() {
    return this.currentUserProjectsArray;
  }

  setCurrentUserProjectsArray(newProjectArray: any) {
    this.currentUserProjectsArray = [];
    this.currentUserProjectsArray = [...newProjectArray];
  }

  isNotAuthenticated(status: any) {
    return status == 401;
  }

  clearCookiesAndRedirectToLogin() {
    this.toastService.add({
      type: 'error',
      message: 'Your session has expired. Please login again'
    });
    setTimeout(() => {
      // this.overlay.activateOverlay(false, '');
    }, 500);
    this.logout();
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserRoleId');
    localStorage.removeItem('currentProjectId');
    localStorage.removeItem('currentUserProjectsArray');
    localStorage.removeItem('userId');
    localStorage.removeItem('okta-token-storage');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUserRoleName');
    localStorage.removeItem('user_name');
    localStorage.removeItem('okta-cache-storage');
    localStorage.removeItem('role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('token');

    this.router.navigate(['/aadlogin']);
  }
}
