import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectFilterComponent } from './component/project-filter/project-filter.component';
import { AssigneeFilterComponent } from './component/assignee-filter/assignee-filter.component';
import { DocumentsStatusFilterComponent } from './component/documents-status-filter/documents-status-filter.component';
import { ListDocumentsComponent } from './component/list-documents/list-documents.component';
import { CanvasThumbnailsComponent } from './component/canvas-thumbnails/canvas-thumbnails.component';
import { CanvasDocumentComponent } from './component/canvas-document/canvas-document.component';
import { AttributesComponent } from './component/attributes/attributes.component';
import { AttributeInputTypesComponent } from './component/attributes/attribute-input-types/attribute-input-types.component';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { ReviewDocumentButtonsComponent } from './component/attributes/review-document-buttons/review-document-buttons.component';
import { CanvasComponent } from './component/canvas/canvas.component';
import { TimerComponent } from './component/timer/timer.component';
import { ReportComponent } from './component/report/report.component';
import { ErrorPageComponent } from './component/error-page/error-page.component';
import { TruncatePipe } from './truncate.pipe';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
// import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ProjectFilterComponent,
    AssigneeFilterComponent,
    DocumentsStatusFilterComponent,
    ListDocumentsComponent,
    CanvasThumbnailsComponent,
    CanvasDocumentComponent,
    AttributesComponent,
    AttributeInputTypesComponent,
    ReviewDocumentButtonsComponent,
    CanvasComponent,
    TimerComponent,
    ReportComponent,
    ErrorPageComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    DragDropModule,
    MatTableModule,
    FlexLayoutModule,
    MatInputModule,
    NgSelectModule,
    NgbTooltipModule,
    NgbModule

    // CalendarModule
  ],
  exports: [
    CommonModule,
    DataTablesModule,
    ProjectFilterComponent,
    AssigneeFilterComponent,
    DocumentsStatusFilterComponent,
    ListDocumentsComponent,
    CanvasThumbnailsComponent,
    CanvasDocumentComponent,
    AttributesComponent,
    CanvasComponent,
    TimerComponent,
    ReportComponent,
    ErrorPageComponent,
    TruncatePipe,
    DragDropModule,
    MatTableModule,
    FlexLayoutModule,
    MatInputModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [BsDatepickerConfig],
})
export class SharedModule {}
