import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/toaster/toaster.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy{
  userList:any=[];
  dtOptions: DataTables.Settings = {};
  editId:any;
  dtTrigger: Subject<any> = new Subject<any>();
  action:string=''
  @ViewChild('closebutton') closebutton:ElementRef;
  @ViewChild('closedelete') deleteModal:ElementRef;
  constructor(private userService:UserService,private route:Router,private toastr:ToasterService) {

   }

  ngOnInit(): void {
    this.userService.sub.subscribe(res=>{
      this.loadUser();
    })
    this.dtOptions = {
    pageLength: 10,
    processing: true,
    responsive: true,
    scrollCollapse: true,
    columnDefs:  [ {
      'targets': [5,6], // column index (start from 0)
      'orderable': false, // set orderable false for selected columns
     }],
  };

     this.loadUser();
  }

  loadUser(){
      this.userService.getUserList().subscribe(res=>{
        this.userList=res;
        this.closebutton.nativeElement.click();
        this.dtTrigger.next(null);
      })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  approve(user:any){
     user.status="Active"
     this.userService.Approve(user).subscribe(res=>{
         this.loadUser();
         this.toastr.add({
          type: 'success',
          message:"user is Approved"
        });
     });
  }

  reject(user:any){
    user.status="InActive"
    this.userService.Approve(user).subscribe(res=>{
        this.loadUser();
        this.toastr.add({
          type: 'success',
          message:"user is Approved"
        });
    });
  }

  edit(id:number){
    this.action="Edit User"
    this.editId=id
    this.closebutton.nativeElement.click();
  }

 get getUserType(){
   return localStorage.getItem('role')
  }

  addUser(){
    this.action="Add User"
    this.editId=null; 
  }

  deleteId:number;
  delete(id:number){
    this.deleteId=id;
  }
  deleteYes(){
    this.userService.deleteUser(this.deleteId).subscribe(res=>{
      this.toastr.add({
        type: 'success',
        message:'User deleted successfully'
      });
      this.deleteModal.nativeElement.click();
      this.loadUser();
  })
  }
  deleteNo(){
    this.deleteModal.nativeElement.click();
  }
}
