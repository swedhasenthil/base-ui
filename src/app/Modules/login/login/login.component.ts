import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { AuthService } from '../../../core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  submited: boolean = false;
  isInvalidUser: boolean = false;
  loginDetails:any=[];
  projectList :any= [];
  displayError: boolean;
  currentYear: number;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService,
     private authService:AuthService,public toastService:ToasterService) {
    localStorage.clear();
}

  ngOnInit(): void {
    let year: number = new Date().getFullYear();
    this.currentYear = year
    this.formLogin = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
    localStorage.removeItem('currentUserRoleName');

  }


  get f() { return this.formLogin.controls }

  login() {
    this.submited = true;
    const payload = {
      email_id: this.formLogin.value.userName,
      password: this.formLogin.value.password,
    };

    this.loginService.login(payload).subscribe((res: any) => {
      const loginResponse = res;

      if (res) {
        const loginDetails = res['userDetails'];
 

        localStorage.setItem('loginDetails', JSON.stringify(loginDetails))
        localStorage.setItem('user_name', loginDetails.user_name);

        localStorage.setItem('token', res['access_token']);
        let role = loginDetails['roles'][0];
        localStorage.setItem(
          'currentUserRoleName',role?.name
        );
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
        loginResponse['projectDetails'].forEach((element: any) => {
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
        'currentUserProjectsArray', JSON.stringify(this.projectList)

      );
 
        this.isInvalidUser=false;
        this.displayError = true;
        setTimeout(()=>{
          this.toastService.add({
            type: 'success',
            message: 'User logged in successfully'
          });
        },3000);

        // this.notificationService.checkRoleAndConfigureNotification(loginDetails['userDetails']['roles']);

        switch (role.name) {
          case 'Admin':
            //this.router.navigate(['/user-dashboard'], { replaceUrl: true });
            this.router.navigate(['/admin/landing'], { replaceUrl: true });
            break;
          case 'Analyst L1' || 'Analyst L2':
            this.router.navigate(['/analyst/my-work'], { replaceUrl: true });

            break;
          case 'SME':
            this.router.navigate(['/sme'], { replaceUrl: true });;
            break;
          case 'QC L1' || 'QC L2':
            //this.router.navigate(['/user-dashboard'], { replaceUrl: true });
            break;

          case 'Manager':
            //this.router.navigate(['/user-dashboard'], { replaceUrl: true });
            break;
          case 'Doc Specialist':
            //this.router.navigate(['/user-dashboard'], { replaceUrl: true });
            break;
          default:
            this.router.navigate(['/login'], { replaceUrl: true });
            break;
        }
        this.setData();

      }
    },
    err => {
      this.toastService.add({
        type: 'error',
        message: 'Invalid User'
      });
      this.isInvalidUser=true
    }
    )
  }
  setData(){
    var sessionData = localStorage.getItem("loginDetails")
    this.loginDetails = JSON.parse(sessionData || '{}')
 


    this.authService.setCurrentUserId(
      this.loginDetails._id
    );
    this.authService.setCurrentUserRoleName(
      this.loginDetails.roles[0].name

    );
 
    // this.authService.setCurrentUserRoleName('sme');
    this.authService.setCurrentUserRoleId(
      this.loginDetails.roles[0].id
    );
    localStorage.setItem(
      'currentUserId',
      this.loginDetails._id
    );
    localStorage.setItem(
      'currentUserRoleName',
      this.loginDetails.roles[0].name
    );
 
    localStorage.setItem('currentUserRoleId', this.loginDetails.roles[0].id);
  this.loginService.setUserid(this.loginDetails._id)
 
  }

}
