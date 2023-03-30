import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { AdminComponent } from './admin.component';
import { ManageApiComponent } from  './manage-api/manage-api.component';
import { AdminProjectOrchApisSequenceComponent } from './projects/admin-project-orchestration/admin-project-orch-apis-sequence/admin-project-orch-apis-sequence.component';
import { AdminProjectOrchListApisComponent } from './projects/admin-project-orchestration/admin-project-orch-list-apis/admin-project-orch-list-apis.component';
import { AdminProjectOrchWorkflowComponent } from './projects/admin-project-orchestration/admin-project-orch-workflow/admin-project-orch-workflow.component';
import { AdminProjectOrchestrationComponent } from './projects/admin-project-orchestration/admin-project-orchestration.component';
import { ProjectsComponent } from './projects/projects.component'
import { ResourcesComponent } from './resources/resources.component'


const routes: Routes = [

  { path: '', component: AdminComponent },
  { path: 'admin', component: AdminComponent} , 
  { path: 'landing', component: AdminLandingComponent} ,
  { path: 'manage-api', component: ManageApiComponent} ,
  { path: 'manage-project', component: ProjectsComponent} ,
  { path: 'manage-resources', component: ResourcesComponent} , 
  {
    path: 'projects/orchestration',
    component: AdminProjectOrchestrationComponent, 
    children:[{ path: '', component:AdminProjectOrchListApisComponent},
               { path: 'select-api', component:AdminProjectOrchListApisComponent},
              { path: 'sequence-api', component:AdminProjectOrchApisSequenceComponent},
              { path: 'workflow', component:AdminProjectOrchWorkflowComponent}]           
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
