import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router } from '@angular/router';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService,private router:Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if(!localStorage.getItem('notificanUrl')){
      this.loaderService.show();
    }
    return next.handle(request).pipe(
      finalize(() => {

        if(this.router.url==='/analyst/my-work' || this.router.url === '/qc/my-work')
        {
          setTimeout(() => {
            this.loaderService.hide();
          }, 1500);
        }else{
          this.loaderService.hide();
        }
        localStorage.removeItem('notificanUrl');
      })
    );
  }
}
