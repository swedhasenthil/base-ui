import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmeComponent } from './sme.component';
import { SmeLandingComponent } from './sme-landing/sme-landing.component';
import { CalibrateDocumentsComponent } from './calibrate-documents/calibrate-documents.component';
import { CalibrateDocumentsGoldenComponent } from './calibrate-documents-golden/calibrate-documents-golden.component';
import { CalibrateDocumentsReviewComponent } from './calibrate-documents-review/calibrate-documents-review.component';
import { CalibrateDocumentsTrainingComponent } from './calibrate-documents-training/calibrate-documents-training.component';
import { CognitiveApisComponent } from './cognitive-apis/cognitive-apis.component';
import { CognitiveApisModelComponent } from './cognitive-apis-model/cognitive-apis-model.component';
import { ReferenceDataManagementComponent } from './reference-data-management/reference-data-management.component';
import { ConfigureProjectsComponent } from './configure-projects/configure-projects.component';
import { ConfigureProjectsWorkflowComponent } from './configure-projects-workflow/configure-projects-workflow.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { RulesComponent } from './rules/rules.component';

const routes: Routes = [
  { path: '', component: SmeComponent },
  { path: 'sme', component: SmeComponent} ,
  { path: 'calibrate-documents', component: CalibrateDocumentsComponent},
             { path: 'calibrate-documents-Golden', component: CalibrateDocumentsGoldenComponent },
             { path: 'calibrate-documents-review', component: CalibrateDocumentsReviewComponent},
             { path: 'calibrate-documents-training', component: CalibrateDocumentsTrainingComponent },
             { path: 'sme/cognitive-apis', component: CognitiveApisComponent },
             { path: 'cognitive-apis-model', component:CognitiveApisModelComponent},
            //  {path:'sme/configure-projects',component:ConfigureProjectsComponent},
             {path:'sme/configure-projects-workflow',component:ConfigureProjectsWorkflowComponent},
             { path: 'landing', component: SmeLandingComponent} ,
             { path: 'cognitive-apis', component: CognitiveApisComponent },
             { path: 'cognitive-apis-model', component:CognitiveApisModelComponent},
             {path:'configure-projects',component:ConfigureProjectsComponent},
             {path:'configure-projects-workflow',component:ConfigureProjectsWorkflowComponent},
             {path:'reference-data-management',component:ReferenceDataManagementComponent},
             { path: 'workflow', component:WorkFlowComponent},
             { path: 'rules', component:RulesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmeRoutingModule { }
