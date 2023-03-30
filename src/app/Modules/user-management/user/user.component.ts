import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { signup } from '../../../Modal/singnUp';
import { LoginService } from '../../login/login.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  formEditUser: FormGroup;
  submited: boolean = false;
  objSignup = new signup();
  dob: string;
  imagePath: any;
  dateTime = new Date();
  @Input() action: string;
  @Input() set editId(value: any) {
    if (value == null) {
      this.formEditUser?.reset();
      this.formEditUser?.get('gender')?.patchValue('1');
      this.formEditUser?.get('dob')?.patchValue(new Date());
      this.formEditUser?.get('roles')?.patchValue('User');
      this.submited = false;
    }
    this.loadUserById(value);
  }

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private activeRouter: ActivatedRoute,
    private userService: UserService,
    private toastService: ToasterService,
    private sanitizer: DomSanitizer
  ) {
    this.dateTime.setDate(this.dateTime.getDate());
  }

  ngOnInit(): void {
    this.formEditUser = this.fb.group({
      id: [],
      firstName: ['', Validators.required],
      lastName: [],
      gender: ['1'],
      dob: [new Date(), Validators.required],
      mobile: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
    });
    this.imagePath = 'assets/images/img_avatar.png';
  }
  user: any;
  loadUserById(userid: number) {
    this.userService.getUserById(userid).subscribe((res) => {
      this.user = res;
      this.formEditUser.get('firstName')?.patchValue(this.user.firstName);
      this.formEditUser.get('lastName')?.patchValue(this.user.lastName);
      this.formEditUser.get('gender')?.patchValue(this.user.gender);
      this.formEditUser.get('dob')?.patchValue(new Date(this.user.dob));
      this.formEditUser.get('mobile')?.patchValue(this.user.mobile);
      this.formEditUser.get('email')?.patchValue(this.user.email);
      this.formEditUser.get('userName')?.patchValue(this.user.userName);
      this.formEditUser.get('password')?.patchValue(this.user.password);
      this.formEditUser.get('roles')?.patchValue(this.user.roles[0]);
      this.imagePath = this.user.profileImage
        ? this.user.profileImage
        : 'assets/images/img_avatar.png';
    });
  }

  get f() {
    return this.formEditUser.controls;
  }

  uodate() {
    this.submited = true;

    if (this.formEditUser.valid) {
      this.objSignup.id = this.user ? this.user.id : null;
      this.objSignup.status = this.user ? this.user.status : 'Pending';
      this.objSignup.firstName = this.formEditUser.value.firstName;
      this.objSignup.lastName = this.formEditUser.value.lastName;
      this.objSignup.dob = this.formEditUser.value.dob;
      this.objSignup.email = this.formEditUser.value.email;
      this.objSignup.gender = this.formEditUser.value.gender;
      this.objSignup.userName = this.formEditUser.value.userName;
      this.objSignup.password = this.formEditUser.value.password;
      this.objSignup.mobile = this.formEditUser.value.mobile;
      this.objSignup.profileImage = this.imagePath;
      this.objSignup.roles = [this.formEditUser.value.roles];

      if (this.action === 'Add User') {
        this.userService.saveNewUser(this.objSignup).subscribe((res) => {
          this.toastService.add({
            type: 'success',
            message: 'User added successfully!',
          });
          this.userService.reloadUserList();
        });
      } else {
        this.userService.updateUser(this.objSignup).subscribe((res) => {
          this.toastService.add({
            type: 'success',
            message: 'User updated successfully!',
          });
          this.userService.reloadUserList();
        });
      }
    }
  }

  fileUpload(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imagePath = event.target.result;
      };
    }
  }

  get getUserType() {
    return localStorage.getItem('role');
  }
}
