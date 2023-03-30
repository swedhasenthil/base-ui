import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class BackendUserService implements CanActivate {
  userLoggedIn = false;
  loggedInUserDetails: string;
  authorizedUser: string;
  authorizedUserToken: string;

  constructor(private router: Router) {}
  //
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   
    const url = state.url;
    const expectedRole = route.data.role;
    let currentUser: any;
    try{
      currentUser = jwt_decode(localStorage.getItem('token'));
    }
    catch {
      this.router.navigate(['/login']);
    }
 
    // Check if expected role is equal to loggedInUserDetails.Role
    if (expectedRole === currentUser.role) {
      return true;
    }
    this.router.navigate(['/login']);
  }
  verifyLogin(url:any) {
    if (this.userLoggedIn) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  verifyUser() {
    // Call Node API to check if user exists
    this.authorizedUser = 'API Call to check user'; // or returns user or false

    // If user exists: Check his role and redirect
    if (this.authorizedUser) {
      this.loggedInUserDetails = 'user details of verified user';
      this.userLoggedIn = true;
      this.router.navigate(['/analyst']);
      this.router.navigate(['/admin']);
    }
  }

  login(loginEmail:any, loginPassword:any) {
    // Call login API for the user returns user data with oauth token with role or 'Invalid email/password'
    this.authorizedUserToken = ' API returned a token ';
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    this.loggedInUserDetails = 'returned user k details such as name and role';
  }

  logout() {
    this.userLoggedIn = false;
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
