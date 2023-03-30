import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QcComponent } from './qc.component';
import { MyWorkComponent } from './my-work/my-work.component';
import { ReviewDocumentComponent } from './review-document/review-document.component';
import { ReportsComponent } from './reports/reports.component';
const routes: Routes = [
  { path: '', redirectTo: "my-work", pathMatch: 'full' },
  { path: 'my-work', component: MyWorkComponent },
  { path: 'review-document', component: ReviewDocumentComponent },
  { path: 'reports', component: ReportsComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QcRoutingModule { }
