import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:'manage-user',component:UserManageComponent,
 children:[
  {path:"",component:UserListComponent},
  {path:"userListComponent",component:UserListComponent},
  {path:"user/:id",component:UserComponent}]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
