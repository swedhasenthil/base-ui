import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MsalModule } from '@azure/msal-angular';
// import { MsalService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR, MsalAngularConfiguration, BroadcastService } from '@azure/msal-angular';

import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration,
  BroadcastService,
} from '@azure/msal-angular';
import { ErrorInterceptor } from 'src/app/core/http/error.interceptor';
import { LoaderInterceptor } from 'src/app/core/http/loader.interceptor';
import { getSaver, SAVER } from 'src/app/shared/services/report.service';
import { JwtInterceptor } from '../../../core/http/jwt.interceptor';



import { AadloginComponent } from './aadlogin.component';

describe('AadloginComponent', () => {
  let component: AadloginComponent;
  let fixture: ComponentFixture<AadloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AadloginComponent ],
      imports: [HttpClientTestingModule],     
      providers: [
                  BroadcastService, MsalService,
                  { provide: MSAL_CONFIG, useValue: {} },
                  { provide: MSAL_CONFIG_ANGULAR, useValue: {} }
      ]     
     // providers: [
        // BroadcastService, 
        // { provide: MSAL_CONFIG, useValue: { clientID: '...' } }
        // MsalService,
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // {provide: HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi: true},
        // {provide: HTTP_INTERCEPTORS,useClass: MsalInterceptor,multi: true,},
        // {provide: MSAL_CONFIG,useFactory: MSALConfigFactory,},
        // // {provide: MSAL_CONFIG_ANGULAR,useFactory: MSALAngularConfigFactory,},
        // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        //  { provide: SAVER, useFactory: getSaver },
     // ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AadloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
