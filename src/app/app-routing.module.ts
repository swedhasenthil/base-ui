import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { enableProdMode } from '@angular/core';
import { CanvasComponent } from './shared/component/canvas/canvas.component';
import { LOGIN_TYPE } from 'src/environments/environment';
import { AadloginComponent } from './Modules/login/aadlogin/aadlogin.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { ErrorPageComponent } from './shared/component/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'analyst',
    loadChildren: () =>
      import('./Modules/analyst/analyst.module').then((m) => m.AnalystModule),
  },
  {
    path: '',
    redirectTo: String(LOGIN_TYPE) === 'AAD' ? 'aadlogin' : 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./Modules/login/login.module').then((m) => m.LoginModule),
  },
  { path: 'canvas', component: CanvasComponent },
  {
    path: 'aadlogin',
    component: AadloginComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'Qc', loadChildren: () => import('./Modules/qc/qc.module').then(m => m.QcModule) },
  { path: 'error', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
