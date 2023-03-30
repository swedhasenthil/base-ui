import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { Observable } from 'rxjs';
import {
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
  HttpHeaderResponse,
} from '@angular/common/http';
import { distinctUntilChanged, scan, map, tap } from 'rxjs/operators';
export type Saver = (blob: Blob, filename?: string) => void;

export const SAVER = new InjectionToken<Saver>('saver');

export function getSaver(): Saver {
  return saveAs;
}
function isHttpResponse<T>(event: HttpEvent<any>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpHeaderResponse<T>(
  event: HttpEvent<T>
): event is HttpHeaderResponse {
  return event.type === HttpEventType.ResponseHeader;
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress;
}
export interface Download {
  content: ArrayBuffer | null;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
}

export function download(
  saver: (b: ArrayBuffer | null) => void
): (source: Observable<HttpEvent<ArrayBuffer>>) => Observable<Download> {
  return (source: Observable<HttpEvent<ArrayBuffer>>) =>
    source.pipe(
      scan(
        (download: Download, event): Download => {
 

          if (download.state !== 'FAILED' && isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : download.progress,
              state: 'IN_PROGRESS',
              content: null,
            };
          }
          if (isHttpResponse(event)) {
            if (saver) {
              saver(event.body);
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body,
            };
          }

          if (isHttpHeaderResponse(event) && event.status !== 200) {
            return { state: 'FAILED', progress: 100, content: null };
          }
          return download;
        },
        { state: 'PENDING', progress: 0, content: null } //initial value
      ),
      distinctUntilChanged(
        (a, b) =>
          a.state === b.state &&
          a.progress === b.progress &&
          a.content === b.content
      )
    );
}
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  token = localStorage.getItem('token');
  headers:any;
  downloadResponse: any;
  constructor(
    private httpClient: HttpClient,
    @Inject(SAVER) public save: Saver,
    public toastService:ToasterService,
  ) {
    this.headers = {
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer' + ' ' + this.token,
    };
    }
  
    httpOptions() {
      return {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + ' ' + localStorage.getItem('token'),
        }),
        withCredentials: true,
      };
    }
  minDate() {
    return this.httpClient.post(
      environment.baseUrl + '/documents/min-date',
      {},
      { headers: this.headers }
    );
  }
  download(
    httpRequestBody: any,
    url: any,
    filename?: any
  ): Observable<Download> {
    return this.httpClient
      .post(environment.baseUrl + url, httpRequestBody, {
        reportProgress: true,
        observe: 'events',
        responseType: 'arraybuffer',
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer' + ' ' + this.token,
        },
      })
      .pipe(
        download((response) => {
 
          this.downloadResponse = response;
          let blob = new Blob([this.downloadResponse], { type: 'text/csv' });
          this.save(blob, filename.toLowerCase().replace(' ', '_') + '.csv');
          this.toastService.add({
            type: 'success',
            message: 'File downloaded successfully'
          }),
          (error:any)=>{
            this.toastService.add({
              type: 'error',
              message:error.error.message
            })
          } 
        }),
        
       
      );
  }

  // get list out the my performance 
  getProjectsList(payload:any){
    return this.httpClient.post(environment.baseUrl + '/projects/get-by-role',payload);
  }
  
  // get list out group performnce
  getGroupPerformance(body:any) {
    return this.httpClient.post(
      environment.baseUrl + '/documents/group-performance/',
      body,
      this.httpOptions()
    );
  }

getIndiviualPerformance(body:any) {
  return this.httpClient.post(
    environment.baseUrl + '/documents/individual-performance/',
    body,
    this.httpOptions()
  );
}
}
