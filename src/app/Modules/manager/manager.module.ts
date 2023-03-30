import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagerLandingComponent } from './manager-landing/manager-landing.component';
import { ManagerTaskComponent } from './manager-task/manager-task.component';
import { ManagerRoutingModule } from './manager-routing.modules';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule,BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManagerTimelineComponent } from './manager-task/manager-timeline/manager-timeline.component';
import { ManageAssignUserComponent } from './manager-task/manage-assign-user/manage-assign-user.component';

@NgModule({
  declarations: [
    ReportsComponent,
    DashboardComponent,
    ManagerLandingComponent,
    ManagerTaskComponent,
    ManagerTimelineComponent,
    ManageAssignUserComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    DataTablesModule,
    SharedModule,
    FormsModule, ReactiveFormsModule ,   BsDatepickerModule.forRoot()
  ],
  providers: [BsDatepickerConfig]

})
export class ManagerModule { }
