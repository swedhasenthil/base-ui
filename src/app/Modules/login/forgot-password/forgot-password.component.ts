import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Modules/user-management/user.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

 formChangePassword:FormGroup;
 userList:any=[]
 txtEmail:string;
 emailExists:boolean=false;
 submited:boolean=false;

  constructor(private userService:UserService,private fb:FormBuilder,private loginService:LoginService) { }

  ngOnInit(): void {

    this.formChangePassword=this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required],
      confirmPassword:['',Validators.required]
    }
    )
    this.loadUser();
  }

  get f(){return this.formChangePassword.controls;}

  loadUser(){
    this.userService.getUserList().subscribe(res=>{
      this.userList=res;
       
    })
}
  user:any=[]
  send(){
    this.submited=true;
    if(this.formChangePassword.value.email!=""){
   this.user=this.userList.filter((item:any)=>item.email===this.formChangePassword.value.email.trim())
    if(this.user.length>0){
    this.emailExists=true;
    }
  }
  }

  change(){
    this.submited=true;
    if(this.formChangePassword.valid){
      var user=this.user[0];
      user.password=this.formChangePassword.value.password;
      this.loginService.changePassword(user).subscribe(res=>{
        alert("Password changes successfully");
      })
    }
  }
  cancel(){
    this.formChangePassword.reset();
  }

}
