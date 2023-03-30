import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators} from '@angular/forms';
import {signup} from '../../../Modal/singnUp';
import {LoginService} from '../login.service'
import { ToasterService } from 'src/app/core/toaster/toaster.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formSignup:FormGroup;
  submited:boolean=false;
  objSignup=new signup();
  dob:string;
  dateTime=new Date();
  constructor(private fb:FormBuilder,private loginService:LoginService,
    public toastService:ToasterService) { 
    this.dateTime.setDate(this.dateTime.getDate());  
  }

  ngOnInit(): void {
    this.formSignup=this.fb.group({
      id: [],
      firstName: ['',Validators.required],
      lastName: [],
      gender:['1'],
      dob:['',Validators.required],
      mobile:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10),Validators.pattern("^[0-9]*$")]],
      email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      userName:['',Validators.required],
      password:['',Validators.required],
   })
  }

  get f(){return this.formSignup.controls}

  signup(){
    this.submited=true;
   // console.log(this.formSignup.value)
    if(this.formSignup.valid){
    this.objSignup.id=null;
    this.objSignup.status='Pending';
    this.objSignup.firstName=this.formSignup.value.firstName;
    this.objSignup.lastName=this.formSignup.value.lastName;
    this.objSignup.dob=this.formSignup.value.dob;
    this.objSignup.email=this.formSignup.value.email;
    this.objSignup.gender=this.formSignup.value.gender;
    this.objSignup.userName=this.formSignup.value.userName;
    this.objSignup.password=this.formSignup.value.password;
    this.objSignup.mobile=this.formSignup.value.mobile;

    this.loginService.saveNewUser(this.objSignup).subscribe(res=>{
      this.toastService.add({
        type: 'success',
        message: "Signup Successfully"
      })
      this.formSignup.reset();
    });

  }
}

}
