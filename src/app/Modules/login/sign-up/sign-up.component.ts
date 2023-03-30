import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//import { MustMatch } from 'src/app/MustMatch';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from '../MustMatch';
import { LoginService } from '../login.service';
import { ToastrService } from 'ngx-toastr';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
//import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  isValid: true;
  captchaData: any;
  rolesObject:any = {};
  error = '';
  message = '';

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private toastr:ToasterService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        username: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[A-Za-z ]+$')
        ]),
        empid: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[a-z0-9]+$')
        ]),
        email: new FormControl(null, [
          Validators.required,
          // Validators.pattern(
          //   '^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+.)?[a-zA-Z]+.)?(wns).com$'
          // )
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ]),
        userRole: new FormControl(null, [Validators.required])
        // captcha: new FormControl(null, [Validators.required])
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

    this.loginService.getRoles().subscribe(data => {
      const rolesArray: any = data;
      rolesArray.forEach((role:any) => {
        const key = role.role_name;
 
        this.rolesObject[key] = role._id;
        // Object.assign(this.rolesObject, {key: role.role_name});
      });
 
    });
  }

  save() {
    if (this.signUpForm.invalid) {
      return;
    } else {
 
      const request = {
        user_name: this.signUpForm.get('username')?.value,
        employee_id: this.signUpForm.get('empid')?.value,
        email_id: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value,
        role_id: this.rolesObject[this.signUpForm.get('userRole')?.value],
        "captcha": this.signUpForm.get('captcha')?.value
      };

      this.loginService.usersignUp(request).subscribe(data => {
        const signupResponse: any = data;
        if (signupResponse.error) {
          this.error = 'Registration Failed!';
          //this.toastr.error("Registration Failed!")
          this.toastr.add({
            type: 'error',
            message: 'User login successfully'
          });
        } else if (signupResponse['email_id'] !== null) {
          // this.router.navigate(['/login']);
          this.message =
            'Registration Successful! Your request is pending with Admin';
            //this.toastr.success(this.message)
            this.toastr.add({
              type: 'success',
              message:this.message
            });
          this.signUpForm.reset();
        } else {
          //this.error = signupResponse['message'];

          //this.toastr.error(signupResponse['message'])
          this.toastr.add({
            type: 'error',
            message: signupResponse['message']
          });
        }
      });
    }
  }
}
