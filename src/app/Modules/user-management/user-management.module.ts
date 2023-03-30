import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    UserListComponent,
    UserComponent,
    UserManageComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,FormsModule,ReactiveFormsModule,
    SharedModule,
    DataTablesModule
  ]
})
export class UserManagementModule { }
