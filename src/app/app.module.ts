import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './Modules/login/login.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/http/jwt.interceptor';

import { DatePipe } from '@angular/common';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { ToasterComponent } from './core/toaster/toaster.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration,
} from '@azure/msal-angular';
import { AadloginComponent } from './Modules/login/aadlogin/aadlogin.component';
import { Configuration } from 'msal';
import {
  AUTHORITY,
  CLIENT_ID,
  NAVIGATION_TO_LOGIN,
  POST_LOGOUT_REDIRECT_URI,
  REDIRECT_URI,
  VALIDATION_AUTHORITY,
} from 'src/environments/environment';
import { LoaderInterceptor } from './core/http/loader.interceptor';
import { OverlayComponent } from './core/overlay/overlay.component';
import { AnalystComponent } from './Modules/analyst/analyst.component';
import { AnalystModule } from './Modules/analyst/analyst.module';
import { SharedModule } from './shared/shared.module';
import { getSaver, SAVER } from './shared/services/report.service';
import { ErrorInterceptor } from './core/http/error.interceptor';

import * as $ from "jquery";


export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
];

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: CLIENT_ID,
      authority: AUTHORITY,
      validateAuthority: VALIDATION_AUTHORITY,
      redirectUri: REDIRECT_URI,
      postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
      navigateToLoginRequestUrl: NAVIGATION_TO_LOGIN,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: !isIE,
    consentScopes: ['user.read', 'openid', 'profile'],
    unprotectedResources: ['https://www.microsoft.com/en-us/'],
    protectedResourceMap,
    extraQueryParameters: {},
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ToasterComponent,
    AadloginComponent,
    AnalystComponent,
    OverlayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ChartModule,
    DataTablesModule,
    LoginModule,
    FormsModule,
    MsalModule,
    FormsModule,
    AnalystModule,
    SharedModule,   
    
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi: true},
    {provide: HTTP_INTERCEPTORS,useClass: MsalInterceptor,multi: true,},
    {provide: MSAL_CONFIG,useFactory: MSALConfigFactory,},
    {provide: MSAL_CONFIG_ANGULAR,useFactory: MSALAngularConfigFactory,},
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
     { provide: SAVER, useFactory: getSaver },
    MsalService,
    //OverlayService,
    // BackendUserService,
    // AuthService,
    // GlobalConstants,
    AuthGuardService,
    // BackendAADUserService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
