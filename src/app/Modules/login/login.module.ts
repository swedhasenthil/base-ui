import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { SharedModule } from '../../shared/shared.module';
import { AadloginComponent } from './aadlogin/aadlogin.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { MsalService } from '@azure/msal-angular';
import { SignUpComponent } from './sign-up/sign-up.component';
// import { ToasterComponent } from 'src/app/core/toaster/toaster.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent
    // ToasterComponent

  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
   // SharedModule,
  ],
  providers:[AuthGuardService,MsalService]
})
export class LoginModule { }
