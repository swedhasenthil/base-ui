import { Injectable } from '@angular/core'
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
import { ToasterService } from '../toaster/toaster.service'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public router: Router,public toastr:ToasterService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        // if (error.status == 404 || error.status == 0) {
        //   this.router.navigate(['error']);
        // } else {
        // }
        switch (parseInt(error.status)) {
          case 400: 
          var message;
          if(error.error){
            message=error.error.message;
          }else{
            message="'An error occurred'"
          }
 
          this.toastr.add({
            type: 'error',
            message: message
          });
        break;
          case 403:   
          this.toastr.add({
            type: 'error',
            message: 'An error occurred'
          });
            break;
  
          case 404:
            //this.router.navigate(['error']);
            this.toastr.add({
              type: 'error',
              message: 'An error occurred'
            });
            break;
  
          case 500:
           // this.toastr.error('An error occurred');
            break;
        }
        return of(error)
      }),
    )
  }
}
