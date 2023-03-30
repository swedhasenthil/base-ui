import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './manager.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagerLandingComponent } from './manager-landing/manager-landing.component';
import { ManagerTaskComponent } from './manager-task/manager-task.component';

const routes: Routes = [
    {path:'',component:ManagerComponent},
     {path:'manager', component: ManagerComponent },
     {path:'manager-landing',component:ManagerLandingComponent},
     {path:'reports', component: ReportsComponent},
     {path:'dashboard',component: DashboardComponent},
     {path:'manager-task',component:ManagerTaskComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }