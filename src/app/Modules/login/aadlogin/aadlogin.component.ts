import { Component, OnInit } from '@angular/core';
import { BroadcastService, MsalService, MSAL_CONFIG, 
          MSAL_CONFIG_ANGULAR 
        } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { AadService } from 'src/app/shared/services/aad.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { AadService } from 'src/app/services/aad.service';
// import { OverlayService } from 'src/app/services/overlay.service';
// import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: 'app-aadlogin',
  templateUrl: './aadlogin.component.html',
  styleUrls: ['./aadlogin.component.scss'], 
})
export class AadloginComponent implements OnInit {
  Year: number = new Date().getFullYear();
  isIframe = false;
  userLoggedIn = false;
  rolesList = [];
  loginError = false;
  skillsObject = {};
  projectList:any = [];
  loading = false;
  error = '';
  currentYear: number;
  constructor(
    private broadcastService: BroadcastService,
    private msalService: MsalService,
    private router: Router,
   // private overlay: OverlayService,
    private authService: AuthService,
    private aadService: AadService,
    //private notificationService: NotificationService
  ) {let year: number = new Date().getFullYear();
    this.currentYear = year}

  async ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.userLoggedIn = !!this.msalService.getAccount();
      if (localStorage.getItem('msal.idtoken') !== '{}') {
        if (localStorage.getItem('msal.idtoken') !== null) {
          this.getUserDetails();
        }
      }
    });

    //logging msal reponses
    this.msalService.setLogger(
      new Logger((logLevel, message, piiEnabled) => {}, {
        correlationId: CryptoUtils.createNewGuid(),
        piiLoggingEnabled: false,
      })
    );
  }

  login() {
    const isIE =
      window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.msalService.loginRedirect();
    } else {
      this.msalService.loginPopup();
    }
  }

  logout() {
    localStorage.clear();
    this.msalService.logout();
  }

  async getUserDetails() {
    //this.overlay.activateOverlay(true, 'sk-circle');
    const userClaims = await this.msalService.getAccount();
    const accessToken:any = localStorage.getItem('msal.idtoken');
    localStorage.setItem('token', accessToken);
    const request = {
      email_id: userClaims.idToken.email,
    };
    // api call for aad auth
    this.aadService.getCreateUser(request, accessToken).subscribe((data:any) => {
      const loginResponse = data;
      if (loginResponse['message'] === 'User Authenticated successfully') {
        localStorage.setItem(
          'user',
          loginResponse['userDetails']['user_name']
        );
        localStorage.setItem('user_name',loginResponse['userDetails']['user_name']);
        localStorage.setItem(
          'userId',
          loginResponse['userDetails']['_id']
        );
        let role = loginResponse['userDetails']['roles'][0]['name'];
        localStorage.setItem('currentUserRoleName',role)
        localStorage.setItem('role', role);
        localStorage.setItem('token', accessToken);
        if (
          loginResponse['projectDetails'][0] &&
          loginResponse['projectDetails'][0]['_id']
        ) {
          this.authService.setCurrentProjectId(
            loginResponse['projectDetails'][0]['_id']
          );
          localStorage.setItem(
            'currentProjectId',
            loginResponse['projectDetails'][0]['_id']
          );
          loginResponse['projectDetails'].forEach((element:any) => {
            let tempObject = {
              id: element._id,
              projectName: element.project_name,
              taskAssignment: element.task_assignment,
              previewImage: element.preview_image
            };
            this.projectList.push(tempObject);
          });
        }
        this.authService.setCurrentUserProjectsArray(this.projectList);
        localStorage.setItem(
          'currentUserProjectsArray',
          JSON.stringify(this.projectList)
        );
        // else {
        // add exception handling
        // }
        this.authService.setCurrentUserId(
          loginResponse['userDetails']['_id']
        );
        this.authService.setCurrentUserRoleName(
          loginResponse['userDetails']['roles'][0]['name']
        );
        // this.authService.setCurrentUserRoleName('sme');
        this.authService.setCurrentUserRoleId(
          loginResponse['userDetails']['roles'][0]['_id']
        );
        localStorage.setItem(
          'currentUserId',
          loginResponse['userDetails']['_id']
        );
        localStorage.setItem(
          'currentUserRoleName',
          loginResponse['userDetails']['roles'][0]['name']
        );
        localStorage.setItem(
          'currentUserRoleId',
          loginResponse['userDetails']['roles'][0]['id']
        );

        //this.notificationService.checkRoleAndConfigureNotification(loginResponse['userDetails']['roles']);

        // this.authService.setCurrentUserId('5ee9d6db56170c00532b2672');
        // this.authService.setCurrentUserRoleId('5eea105dd392195b680a2949');
        // this.authService.setCurrentProjectId('5eea09d156170c00532b268c');

        if (role === 'Admin') {
          //this.router.navigate(['/admin']); 
          this.router.navigate(['/admin/landing'])
          // this.router.navigate([this.returnUrl]);
        }
        if (role === 'Analyst L1' || role === 'Analyst L2') {
          // this.router.navigate([this.returnUrl]);
          this.router.navigate(['/analyst']);
        }
        if (role === 'SME') {
          // this.router.navigate([this.returnUrl]);
          this.router.navigate(['/sme']);
        }
        if (role === 'QC L1' || role === 'QC L2') {
          this.router.navigate(['/qc']);
        }
        if (role === 'Manager') {
          this.router.navigate(['/manager']);
        }
        if (role === 'Doc Specialist') {
          this.router.navigate(['/doc-specialist']);
        }
        setTimeout(() => {
          //this.overlay.activateOverlay(false, '');
        }, 500);
      } 
       else if (loginResponse['message'] === 'Invalid user') {
      //  this.overlay.activateOverlay(false, '');
        this.userLoggedIn = false;
        this.loginError = true;
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        this.router.navigate(['/aadlogin']);
      } else {
        //this.overlay.activateOverlay(false, '');
        this.userLoggedIn = false;
        this.loginError = true;
        localStorage.removeItem('role');
        localStorage.removeItem('token');
      }
    })
  }
}
