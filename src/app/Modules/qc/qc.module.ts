import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QcRoutingModule } from './qc-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MyWorkComponent } from './my-work/my-work.component';
import { ReviewDocumentComponent } from './review-document/review-document.component';
import { ReportsComponent } from './reports/reports.component';
ReportsComponent
@NgModule({
  declarations: [MyWorkComponent, ReviewDocumentComponent, ReportsComponent],
  imports: [
    CommonModule,
    QcRoutingModule,

    SharedModule
  ]
})
export class QcModule { }
