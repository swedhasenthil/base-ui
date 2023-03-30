import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { SmeRoutingModule } from './sme-routing.module';
import { SmeComponent } from './sme.component';
import { SmeLandingComponent } from './sme-landing/sme-landing.component';
import { CalibrateDocumentsTrainingComponent } from './calibrate-documents-training/calibrate-documents-training.component';
import { CalibrateDocumentsReviewComponent } from './calibrate-documents-review/calibrate-documents-review.component';
import { CalibrateDocumentsGoldenComponent } from './calibrate-documents-golden/calibrate-documents-golden.component';
import { CalibrateDocumentsComponent } from './calibrate-documents/calibrate-documents.component';
import { CognitiveApisComponent } from './cognitive-apis/cognitive-apis.component';
import { CognitiveApisModelComponent } from './cognitive-apis-model/cognitive-apis-model.component';
import { ConfigureProjectsComponent } from './configure-projects/configure-projects.component';
import { ConfigureProjectsWorkflowComponent } from './configure-projects-workflow/configure-projects-workflow.component';
import { ReferenceDataManagementComponent } from './reference-data-management/reference-data-management.component';
import { DataTablesModule } from 'angular-datatables';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { RulesComponent } from './rules/rules.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSliderModule } from '@angular/material/slider';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ManageAttributesComponent } from './configure-projects/manage-attributes/manage-attributes.component';
import { AddEditRuleComponent } from './rules/add-edit-rule/add-edit-rule.component';
import { DefineRulesComponent } from './configure-projects/define-rules/define-rules.component';
import { ExpandRowComponent } from './configure-projects/expand-row/expand-row.component';
import { AddNewAndEditDocumentComponent } from './calibrate-documents/add-new-and-edit-document/add-new-and-edit-document.component';
@NgModule({
  declarations: [
    SmeComponent,
    SmeLandingComponent,
    CalibrateDocumentsTrainingComponent,
    CalibrateDocumentsReviewComponent,
    CalibrateDocumentsGoldenComponent,
    CalibrateDocumentsComponent,
    CognitiveApisComponent,
    CognitiveApisModelComponent,
    ConfigureProjectsComponent,
    ConfigureProjectsWorkflowComponent,
    ReferenceDataManagementComponent,
    WorkFlowComponent,
    RulesComponent,
    ManageAttributesComponent,
    AddEditRuleComponent,
    DefineRulesComponent,
    ExpandRowComponent,
    AddNewAndEditDocumentComponent,
  ],
  imports: [
    CommonModule,
    SmeRoutingModule,
    DataTablesModule,
    FormsModule ,
    ReactiveFormsModule,
    Ng2SearchPipeModule  ,
    SharedModule,
    MatSliderModule,

  // SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
 
})
export class SmeModule { }
