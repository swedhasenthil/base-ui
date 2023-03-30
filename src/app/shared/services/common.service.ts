import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { BehaviorSubject, concatMap, from, Subject, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';

const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  commonService(commonService: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
  // For Review Document canvas page
  public documentImageObserval = new BehaviorSubject<any>(null);

  public stausListObserval = new BehaviorSubject<any>(null);

  public refreshTableSubject = new BehaviorSubject<any>(null);

  public activeAttribute = new BehaviorSubject<any>(null);
  public activeAttributeIndex = new BehaviorSubject<any>(null);

  // for checking from which component (analyst or qc or manager) we are calling child components
  public parentComponent = new BehaviorSubject<any>(null);

  public documentType = new BehaviorSubject<any>(null);

  public document = new BehaviorSubject<any>(null);

  public manualUpdate = new BehaviorSubject<any>(null);

  public assignTypeAuto = new Subject<any>();
  public assignTaskTypeAutoSub: Subscription;
  public assignTaskTypeAuto = new EventEmitter();

  onAutoAssignTask() {
    this.assignTaskTypeAuto.emit();
  }
  public editLabel = new BehaviorSubject<any>(null);
  public DocumentList = new BehaviorSubject<any>(null);
  public selectStatus = new BehaviorSubject<any>(null);

  public submitButtons = new BehaviorSubject<any>(null);
  public clearBoundingBoxSubject = new BehaviorSubject<any>(null);
  public EditableIndex = new BehaviorSubject<any>(null);
  public saveButtons = new BehaviorSubject<any>(null);
  public changeTextAtrribute = new BehaviorSubject<any>(null);
  public hideEditBoxSubject = new BehaviorSubject<any>(null);
  public canvasExtractedDataValidation = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) {}

  /**
   * Set & Get Document
   *
   */

  private reviewDocument: any;

  set setReviewDocument(reviewDocument: any) {
    this.reviewDocument = reviewDocument;
  }

  get getReviewDocument() {
    return this.reviewDocument;
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
  /**
   * Get list of Projects using this service
   *
   */

  setStausList(statusLast: any) {
    this.stausListObserval.next(statusLast);
  }

  setActiveAttribute(attribute: any) {
    this.activeAttribute.next(attribute);
  }

  setActiveAttributeIndex(index: any) {
    this.activeAttributeIndex.next(index);
  }

  setParentComponent(flag: any) {
    this.parentComponent.next(flag);
  }

  setDocumentType(documentType: any) {
    this.documentType.next(documentType);
  }

  setSubmitButton(value: any) {
    this.submitButtons.next(value);
  }
  setEditableIndex(value: any) {
    this.EditableIndex.next(value);
  }
  setSaveButton(value: any) {
    this.saveButtons.next(value);
  }
  setDocument(reviewDocument: any) {
    this.document.next(reviewDocument);
  }

  setManualUpdate(value: any) {
    this.manualUpdate.next(value);
  }
  setListDocument(value: any) {
    this.DocumentList.next(value);
  }
  setAssignTypeAuto(value: any) {
    this.assignTypeAuto.next(value);
  }
  setSelectStatus(value: any) {
    this.selectStatus = value;
  }
  setEditLabel(value: any) {
    this.editLabel.next(value);
  }

  setCanvasExtractedDataValidation(value: any) {
    this.canvasExtractedDataValidation.next(value);
  }
  
  refreshTable() {
    this.refreshTableSubject.next(null);
  }

  seteditTextValue(value: any) {
    this.changeTextAtrribute.next(value);
  }
  clearBoundIngBox(labelName?: string) {
    this.clearBoundingBoxSubject.next(labelName);
  }

  hideEditBox(show?: boolean, editBoxYaxis?: any, editBoxXaxis?: any) {
    this.hideEditBoxSubject.next({
      show: show,
      editBoxYaxis: editBoxYaxis,
      editBoxXaxis: editBoxXaxis,
    });
  }

  getProjectsList(body: any) {
    return this.httpClient.post(APIEndpoint + '/projects/get-by-role', body);
  }

  getDocumentsList(body: any) {
    return this.httpClient.post(APIEndpoint + '/documents/get', body);
  }

  // Get Blob Data from Server
  getBlobFromAPI(filename: any) {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/json'
    });
    const fileNameAtBlob = filename;
    return this.httpClient.post<Blob>(
      `${APIEndpoint}/images/get`,
      { blob: fileNameAtBlob },
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }

  getImageFromBlob(document: any) {
    if (document) {
      let documentThumbnailsArray = [];
      let documentId = document._id;
      let documentTotalPages = document.page_count;
      let documentName = document.document_name;
      let documentNameWithoutExtention = documentName.split('.')[0];

      if (documentTotalPages) {
        // Create thumbnail Image Names
        for (let pageNo = 1; pageNo <= documentTotalPages; pageNo++) {
          let thumbnailImageName = `${documentNameWithoutExtention}_${documentId}_${pageNo}.PNG`;
          documentThumbnailsArray.push(thumbnailImageName);
        }

        from(documentThumbnailsArray)
          .pipe(
            concatMap((thumbnail) => {
              return this.getBlobFromAPI(thumbnail);
            })
          )
          .subscribe((responce) => {
            this.createImageFromBlob(responce);
          });

        // // Call API to get Blob Image
        // documentThumbnailsArray.forEach((thumbnail) => {
        //   this.getBlobFromAPI(thumbnail).subscribe(
        //     (response: any) => {
        //       this.createImageFromBlob(response);
        //     },
        //     (error) => {

        //     }
        //   );
        // });
      }
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        // Set current response for next image response
        this.documentImageObserval.next(reader.result);
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getBoundingBoxText(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/documents/coordinates',
      body,
      this.httpOptions()
    );
  }

  //called where this function geting called
  getTaskFromBackend(payload: any) {
    // let httpRequestBody:any = {
    //   role_id: localStorage.getItem('currentUserRoleId'),
    //   user_id: localStorage.getItem('userId'),
    //   project_id: doc.project_id
    // };
    let getTaskRoute = null;
    if (payload.document_id) {
      getTaskRoute = '/documents/task-by-id?review=true';
      //httpRequestBody['document_id'] = doc.docId;
    } else {
      getTaskRoute = '/documents/task?review=true';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        // Authorization: 'Bearer' + ' ' + this.token,
      }),
    };
    return this.httpClient.post(
      `${APIEndpoint}${getTaskRoute}`,
      payload,
      httpOptions
    );
  }

  getReasonList() {
    return this.httpClient.post(
      APIEndpoint + '/reasons/get',
      '',
      this.httpOptions()
    );
  }

  getDocumentTypes(payload: any) {
    return this.httpClient.post(
      APIEndpoint + '/projects-document-types/get/',
      payload
    );
  }

  validDocument(body: any) {
    return this.httpClient.post(
      APIEndpoint + `/documents/validation`,
      body,
      this.httpOptions()
    );
  }

  rejectDocument(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/documents/reject',
      body,
      this.httpOptions()
    );
  }

  submitTaskAndDocument(body: any) {
    return this.httpClient.post(
      APIEndpoint + '/documents/submit',
      body,
      this.httpOptions()
    );
  }

  saveDocument(body: any) {
    return this.httpClient.put(
      APIEndpoint + '/documents',
      body,
      this.httpOptions()
    );
  }

  getManualTaskApi(body: any) {
    return this.httpClient.post(
      APIEndpoint + `/documents/task-by-id`,
      body,
      this.httpOptions()
    );
  }
  enableSubmitButton(attributes: any) {
    let result = attributes.find((attribute: any) => {
      return (
        (attribute.mandatory && attribute.category_details[0].value == '') ||
        attribute.has_error
      );
    });
    if (result) {
      this.setSubmitButton(false);
    } else {
      this.setSubmitButton(true);
    }
  }
  getChatGPTResponse(body:any) {
    return this.httpClient.post(
      environment.APIEndpoint + '/chatGPT/get',
      body,
      this.httpOptions()
    );
  }
  
  markAllNotificationsRead(userId: any, body: any) {
    return this.httpClient.post(
      APIEndpoint + `/users/${userId}/notifications/mark-as-read`,
      body,
      this.httpOptions()
    );
  }
  // editIconLabel(value:any){
  //  this.documen
  // }
}
