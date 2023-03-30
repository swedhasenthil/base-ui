import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { LOGIN_TYPE } from '../../../environments/environment';
@Injectable()
export class AuthGuardService implements CanActivate {
  isRoute = false;
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (LOGIN_TYPE == 'AAD' && state.url == '/aadlogin') {
      this.isRoute = true;
    } else {
      this.isRoute = false;
    }
    if (this.isRoute) {
      return true;
    } else {
      if (LOGIN_TYPE == 'AAD') {
        this.router.navigate(['/aadlogin']);
        //this.router.navigate(['/login/signup']);
        return false;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
