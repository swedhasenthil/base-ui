import { async, inject, TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should login 'true' for 200 Ok status `, async(inject([LoginService, HttpTestingController],
    (service: LoginService, backend: HttpTestingController) => {
      service.login({ userName: 'CF09221601k', password: 'LK6XOMPBRkH0'}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
      backend.expectOne('https://api-skense-2-0.eveniontechnologies.com/api/users/authenticate/v1').flush(
        { status: 200, statusText: 'Ok' });
    })));
 

});
