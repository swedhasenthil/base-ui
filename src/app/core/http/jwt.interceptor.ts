import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      const token=localStorage.getItem('token')

      if(token==null){
       // if(this.router.url!='/login/signup'){
          this.router.navigate([this.router.url]);
       // }
         
      }


    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'null') {
      let token = localStorage.getItem('token');
      request = request.clone({
          setHeaders: {
              'Authorization': `Bearer ${token}`,
              'Accept': '*/*'
          }
      });
  }
     return next.handle(request);
  }
}
