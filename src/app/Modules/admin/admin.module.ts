import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { ManageApiComponent } from './manage-api/manage-api.component';
import { ProjectsComponent } from './projects/projects.component';
import { ResourcesComponent } from './resources/resources.component';
import { ResourcesUsersViewComponent } from './resources-users-view/resources-users-view.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AdminProjectOrchApisSequenceComponent } from './projects/admin-project-orchestration/admin-project-orch-apis-sequence/admin-project-orch-apis-sequence.component';
import { AdminProjectOrchListApisComponent } from './projects/admin-project-orchestration/admin-project-orch-list-apis/admin-project-orch-list-apis.component';
import { AdminProjectOrchWorkflowComponent } from './projects/admin-project-orchestration/admin-project-orch-workflow/admin-project-orch-workflow.component';
import { AdminProjectOrchestrationComponent } from './projects/admin-project-orchestration/admin-project-orchestration.component';
import { PrettyjsonPipe } from './prettyjson.pipe';
import { ListOrchestrationApiComponent } from './manage-api/list-orchestration-api/list-orchestration-api.component';
import { EditOrchestrationApiComponent } from './manage-api/edit-orchestration-api/edit-orchestration-api.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AdminComponent,
    AdminLandingComponent,
    ManageApiComponent,
    ProjectsComponent,
    ResourcesComponent,
    ResourcesUsersViewComponent,
    AdminProjectOrchApisSequenceComponent,
    AdminProjectOrchListApisComponent,
    AdminProjectOrchWorkflowComponent,
    AdminProjectOrchestrationComponent, 
    PrettyjsonPipe, ListOrchestrationApiComponent, EditOrchestrationApiComponent  
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    FormsModule ,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule  , 
    MatPaginatorModule,
    MatSortModule,
    SharedModule

  ]
})
export class AdminModule { }
