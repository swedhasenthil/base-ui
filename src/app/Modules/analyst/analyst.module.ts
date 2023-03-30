import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalystRoutingModule } from './analyst-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MyWorkComponent } from './my-work/my-work.component';
import { ReviewDocumentComponent } from './review-document/review-document.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [MyWorkComponent, ReviewDocumentComponent, ReportsComponent],
  imports: [
    CommonModule,
    AnalystRoutingModule,

    SharedModule
  ]
})
export class AnalystModule { }
