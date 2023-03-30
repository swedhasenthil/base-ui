import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { AnalystComponent } from '../analyst/analyst.component';
//import { AnalystComponent } from '../analyst/analyst.component';
import { ManagerComponent } from '../manager/manager.component';
import { QcComponent } from '../qc/qc.component';
import { SmeComponent } from '../sme/sme.component';
import { AadloginComponent } from './aadlogin/aadlogin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
 
const routes: Routes = [
  { path: '', component: LoginComponent },
  // { path:'aadlogin', component:AadloginComponent , canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signup', component: SignUpComponent },
  // {path: 'analyst',component:AnalystComponent},
  { path: 'sme', component: SmeComponent },
  { path: 'manager', component: ManagerComponent },
  {
    path: 'analyst',
    component: AnalystComponent,
    // loadChildren: () => import('../analyst/analyst.module').then(m => m.AnalystModule)
  },
  {
    path: 'sme',
    loadChildren: () => import('../sme/sme.module').then((m) => m.SmeModule),
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('../manager/manager.module').then((m) => m.ManagerModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'qc',
    loadChildren: () => import('../qc/qc.module').then((m) => m.QcModule),
  },

  //   {path: 'Admin',
  //    // loadChildren: () => import('../layout/adminlayout/adminlayout.module').then(m => m.AdminlayoutModule)
  //   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
