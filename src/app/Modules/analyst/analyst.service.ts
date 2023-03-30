import { Inject, Injectable, InjectionToken } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
  HttpHeaderResponse,
} from '@angular/common/http';
import { distinctUntilChanged, scan, map, tap } from 'rxjs/operators';
import { error } from 'jquery';
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
  content: ArrayBuffer | null ;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
}

export function download(
  saver: (b: ArrayBuffer |null) => void )
  : (source: Observable<HttpEvent<ArrayBuffer>>) => Observable<Download> {
  return (source: Observable<HttpEvent<ArrayBuffer>>) =>
    source.pipe(
      scan(
        (download: Download, event): Download => {
          console.log("event download",download,event)

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
              saver(event.body)        
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
  providedIn: 'root'
})
export class AnalystService {
  // httpOptions: any;
  token = localStorage.getItem('token');
  headers:any;
  downloadResponse: any;
  constructor(private httpClient:HttpClient,  
    @Inject(SAVER) public save: Saver,
     private toastr: ToastrService) {
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
  
  getProjectsList(payload:any){
    return this.httpClient.post(environment.APIEndpoint + '/projects/get-by-role',payload);
  }
  
  getDocumentsList(payload:any){
    return this.httpClient.post(environment.APIEndpoint + '/documents/get',payload);
  }
  
  validDocument(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + `/documents/validation`,
      body,
      this.httpOptions()
    );
  }

  
  getBlobFromAPI(filename:any) {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + ' ' + this.token,
    });
    const fileNameAtBlob = filename;
    return this.httpClient.post<Blob>(
      `${environment.APIEndpoint}/images/get`,
      { blob: fileNameAtBlob },
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }
  
  getBoundingBoxText(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/coordinates',
      body,
      this.httpOptions()
    );
  }
  
  getDocumentTypes(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/projects-document-types/get/',
      body,
      this.httpOptions()
    );
  }
  
  unlockDocument(docId:any) {
    return this.httpClient.post(
      environment.APIEndpoint + `/documents/${docId}/unlock`,
      {},
      this.httpOptions()
    );
  }

  unlockMyDocuments() {
    const userId = localStorage.getItem('currentUserId');
    return this.httpClient.post(
      environment.APIEndpoint + `/documents/unlock?user_id=${userId}`,
      {},
      this.httpOptions()
    );
  }
  
  getReasonList() {
    return this.httpClient.post(environment.APIEndpoint + '/reasons/get', '', this.httpOptions());
  }

  rejectDocument(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/reject',
      body,
      this.httpOptions()
    );
  }

  submitTask(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/submit',
      body,
      this.httpOptions()
    );
  }

  submitDocument(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/submit',
      body,
      this.httpOptions()
    );
  }
  
  saveDocument(body:any) {
    return this.httpClient.put(environment.APIEndpoint + '/documents', body, this.httpOptions());
  }

  
  getManualTaskApi(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + `/documents/task-by-id`,
      body,
      this.httpOptions()
    );
  }
  getGroupPerformance(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/group-performance/',
      body,
      this.httpOptions()
    );
  }
  getIndivisualPerformance(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/documents/individual-performance/',
      body,
      this.httpOptions()
    );
  }

  minDate() {
    return this.httpClient.post(environment.APIEndpoint+ '/documents/min-date',
      {},
      { headers: this.headers }
    );
  }

  // download(httpRequestBody:any,url:any) {
  //   return this.httpClient.post(environment.APIEndpoint + url, httpRequestBody, this.httpOptions());
  // }
  download(httpRequestBody:any,url: any,filename?: any
  ): Observable<Download> {
    return this.httpClient
      .post(environment.APIEndpoint+ url, httpRequestBody, {
        reportProgress: true,
        observe: 'events',
        responseType: 'arraybuffer',
        headers:     {
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer' + ' ' + this.token,
        }
      })
      .pipe(download((response) => {
                    console.log(response)
          this.downloadResponse = response
          let blob = new Blob([this.downloadResponse], { type: 'text/csv' });
          this.save(blob, filename.toLowerCase().replace(' ', '_') + '.csv');
          this.toastr.success('File downloaded successfully');    
        }
        )
      );
  }

}
