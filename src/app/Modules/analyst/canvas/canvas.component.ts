import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScrollService } from '../../../shared/services/scroll.service';
import { AuthService } from './../../../core/auth.service';
import { AnalystService } from '../analyst.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })), // default image state start
      state('rotated', style({ transform: 'rotate(-90deg)' })), // Change image state 90 End
      transition('rotated => default', animate('1500ms ease-out')), // start rotating second
      transition('default => rotated', animate('400ms ease-in')), // Return to default state (rotating second)
    ]),
  ],
})
export class CanvasComponent implements OnInit {
  selectedIndex: any;
  editableIndex: any;
  analystheaderflag: boolean = true;
  inprogressflag: boolean = false;
  isDefault: boolean = true;
  selectedProject: any;
  selectedProjectId: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  documents: any;
  getTaskFlag: boolean = false;
  documentListFlag: boolean = false;
  token = localStorage.getItem('token');
  loggedInUsername:any = '';
  documentTypeDataObjectArray: any;
  documentTypeChangeIndicator:boolean = false;
  autoUpdate:boolean = true;
  manualUpdate:boolean = false;
  showDocumentTypeDropdown:boolean = false;
  getTaskDocumentId: any = '';
  getTaskDocumentConfidenceScore: any = 'ls';
  rejectReasonValue: any = '';
  currentDocumentType: any = '';
  getTaskIsDisabled:boolean = false;
  // lastClickedElement;
  images: any = [];
  imagesRevisedWidth: any = {};
  imagesRevisedDegree: any = {};
  documentDetailsDataObject: any = {};
  individualPerformanceObject: any = {
    reviewed: 'NA',
    rejected: 'NA',
  };
  groupPerformanceObject: any = {
    percentage: 'NA',
    pending: 'NA',
    reviewed: 'NA',
    rejected: 'NA',
    totalDocuments: 'NA',
  };
  fieldsChangedObjectArray: any = [];
  documentTypesArray: any = [];
  currentDocumentTypeVar = '';
  currentDocumentTypeId = '';
  showSaveModalSuccess:boolean = true;
  getDocumentNameById: any = {};
  rejectionReasonsArray: any = [];
  imageResponse: any;
  thumbImgArr: any = [];
  activeImg: any = 0;
  public imgWidth: number;
  public imgHeight: number;
  ImageArray: any = [];
  imageBlobUrl: any = [];
  fileNameAtBlob: any;
  ZOOM_IN_BY = 1.2; // Existing + 20%
  ZOOM_OUT_BY = 0.8; // Existing - 20%
  DEFAULT_IMG_WIDTH = 39;
  state: string = 'default'; 
  displayTimerFlag:boolean = false;
  
  getaLocation: any;
  dataLocation: any;
  dataPage: any;
  numberOfImagesForCurrentTask = 0;
  loggedUser: any;
  userHasProjects: boolean;
  getAllProjects:any = [];
  getTaskDocumentTypeId: string;
  diplayInfo:boolean = false;
  boundingBox: any;
  pageIndex: any;
  attributes: any = {};
  selectedDocumentType: any;
  public testVar: any = [];
  interval: any;
  time = new Date();
  reviewTime: any;
  ifcount: any;
  elsecount: any;
  valueCount: any = 0;
  isButton:boolean = true;
  totalValue: any = 0;
  filteredAttributesBySmeArray: any = [];
  lengthError: any = [];
  dataTypeError: any = [];
  incorrectLengthArray: any = [];
  isNumberError: any = [];
  isNumberValid:boolean = false;
  revisedFieldCoordinates: any = [];
  validateDocId: any;
  originData: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  refreshDocList: any;
  REFRESH_DOCS_LIST_DURATION = 10000; // Milliseconds
  objectKeys = Object.keys;
  previouslyUpdatedTableCellContent: any;
  ORIGIN_VAL_BOUNDING_COLOR = '#FF0000';
  fetchDocToView: any;
  roleId:any;
  constructor(
    private scrollService: ScrollService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title,
    private toastr: ToastrService,
    private authService: AuthService,
    private analystService: AnalystService
  ) {
    // this.getTaskDocumentId = window.location.href.split('?')[1].split('&')[0];
    // if (this.getTaskDocumentId.endsWith('=')) {
    //   this.getTaskDocumentId = this.getTaskDocumentId.slice(0, -1);
    // }
    this.getTaskDocumentId = localStorage.getItem('documentId')
    console.log("this.getTaskDocumentId", this.getTaskDocumentId);
    
    this.titleService.setTitle('Skense - Analyst');
    this.authService.setCurrentUserId(localStorage.getItem('currentUserId'));
    this.authService.setCurrentUserRoleId(
      localStorage.getItem('currentUserRoleId')
    );
    console.log("localStorage.getItem('currentProjectId')", localStorage.getItem('currentProjectId'));
    
    this.authService.setCurrentProjectId(
      localStorage.getItem('currentProjectId')
    );
    this.getDocumentTypesFromBackend();
  }
  projectsList:any;
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, 'All'],
      ],
      order: [[0, 'desc']],
    };
    
    this.roleId = localStorage.getItem("currentUserRoleId")
    this.getListDocuments();
    if (this.authService.getCurrentUserProjectsArray()) {
      this.getAllProjects = this.authService.getCurrentUserProjectsArray();
    }
    // Get all projects using localStorage
    this.projectsList = localStorage.getItem('currentUserProjectsArray');
    this.getAllProjects = JSON.parse(this.projectsList);
    console.log("this.getAllProjects", this.getAllProjects);
    
    this.selectedProject = this.getAllProjects[0];
    this.selectedProjectId = this.getAllProjects[0]._id;
    if (this.getAllProjects[0].taskAssignment == 'Auto') {
      this.getTaskFlag = true;
    } else {
      this.documentListFlag = true;
      this.fetchAndUpdateDocsListPeriodically();
      this.getDocumentsOfProject();
    }
    this.loggedUser = localStorage.getItem('user');
    // this.getGroupPerformanceDetails();
    // this.getIndividualPerformanceDetails();
    this.getReasonsList();
    this.checkUserProjects();
    this.loggedInUsername = localStorage.getItem('userName')
      ? localStorage.getItem('userName')
      : 'default user';

    this.activatedRouter.queryParams.subscribe(
      (params) => {
        console.log(params);
        this.fetchDocToView = params.fetchDocToView;
        this.getTask(false, this.getTaskDocumentId);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error('Error');
      }
    );
  }
  
  docCanvas:any;
  getListDocuments(){
    this.analystService.getProjectsList({ role_id: this.roleId })
      .subscribe((data) => {
        if (data) {
          this.getAllProjects = data;
          this.getAllProjects = this.getAllProjects.map((project:any) => {
            let tempProject:any = {};
            tempProject['id'] = project._id;
            tempProject['previewImage'] = project.preview_image;
            tempProject['projectName'] = project.project_name;
            tempProject['taskAssignment'] = project.task_assignment;
            tempProject['timerDisplay'] = project.timer_display;
            return tempProject;
          });
        }
        this.selectedProject = this.getAllProjects[0];
        this.selectedProjectId = this.selectedProject.id;
        this.getDocumentTypesFromBackend();
        if (this.getAllProjects[0].taskAssignment == 'Auto') {
          this.getTaskFlag = true;
        } else {
          this.documentListFlag = true;
          this.getDocumentsOfProject();
        }
        if (this.getAllProjects[0].timerDisplay == true) {
          this.displayTimerFlag = true;
        } else {
          this.displayTimerFlag = false;
        }
        this.loggedUser = localStorage.getItem('user');
        this.loggedInUsername = localStorage.getItem('userName')
          ? localStorage.getItem('userName')
          : 'default user';
          if (this.docCanvas) {
            this.docCanvas.close();
          }
          this.getTask(false, this.getTaskDocumentId);
        },
        (err) => {
          console.log(`Error in listProjects, error:`, err);
        }
      ); 
   }
   animatedData:any
  @HostListener('window:storage', ['$event'])
  onStorageChange(ev: StorageEvent) {
    // console.log(`${ev.key} = ${ev.newValue}`);
    let animateDetails;
    if (localStorage.getItem('animate')) {
      this.animatedData = localStorage.getItem('animate')
      animateDetails = JSON.parse(this.animatedData);
      console.log(`animateDetails: `, animateDetails);
      this.animate(
        animateDetails.data,
        animateDetails.pageNo,
        animateDetails.index
      );
      localStorage.setItem('animate', '');
    }
    // console.log(`animateDetails: `, animateDetails);
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event:any) {
    alert('Close event detected');
    event.preventDefault();
    return false;
  }

  getDocumentsOfProject() {
    const request = {
      project_id: this.selectedProjectId,
    };
    this.analystService.getDocumentsList(request).subscribe(
      (response) => {
        const projectPerformanceResponse: any = response;
        // this.rerender();
        this.documents = projectPerformanceResponse.data;
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error('Error');
      }
    );
  }
  fetchAndUpdateDocsListPeriodically() {
    this.refreshDocList = setInterval(() => {
      // this.getDocumentsOfProject();
    }, this.REFRESH_DOCS_LIST_DURATION);
  }


  startTimer() {
    if (this.getaLocation[0].review_time) {
      const d = this.getaLocation[0].review_time;
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      const mDisplay: any = m > 0 ? m + (m === 1 ? '' : '') : '';
      const sDisplay: any = s > 0 ? s + (s === 1 ? '' : '') : '';
      this.time.setUTCHours(0, mDisplay, sDisplay, 0);
      this.interval = setInterval(() => {
        this.time.setSeconds(this.time.getSeconds() + 1);
      }, 1000);
    } else {
      this.time.setUTCHours(0, 0, 0, 0);
      this.interval = setInterval(() => {
        this.time.setSeconds(this.time.getSeconds() + 1);
      }, 1000);
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  resetTimer() {
    this.reviewTime = this.time.getTime() / 1000;
    this.time.setUTCMinutes(0);
    this.time.setSeconds(0);
  }

  getCursorPosition(canvas:any, event:any) {
    const rect = canvas.getBoundingClientRect();
    const x = event.layerX - rect.left;
    const y = event.layerY - rect.top;
    return [x, y];
  }

  getBoundingBox(startCoordinates:any, endCoordinates:any) {
    const width = Math.abs(endCoordinates[0] - startCoordinates[0]);
    const height = Math.abs(endCoordinates[1] - startCoordinates[1]);
    let x1;
    let y1;

    if (
      startCoordinates[0] < endCoordinates[0] &&
      startCoordinates[1] < endCoordinates[1]
    ) {
      [x1, y1] = startCoordinates;
    } else if (
      startCoordinates[0] > endCoordinates[0] &&
      startCoordinates[1] < endCoordinates[1]
    ) {
      x1 = startCoordinates[0] - width;
      [y1] = [startCoordinates[1]];
    } else if (
      startCoordinates[0] > endCoordinates[0] &&
      startCoordinates[1] > endCoordinates[1]
    ) {
      x1 = startCoordinates[0] - width;
      y1 = startCoordinates[1] - height;
    } else if (
      startCoordinates[0] < endCoordinates[0] &&
      startCoordinates[1] > endCoordinates[1]
    ) {
      [x1] = [startCoordinates[0]];
      y1 = startCoordinates[1] - height;
    }

    const x2 = x1 + width;
    const y2 = y1;
    const x3 = x2;
    const y3 = y1 + height;
    const x4 = x1;
    const y4 = y3;
    return [x1, y1, x2, y2, x3, y3, x4, y4];
  }

  documentPreviewScrollHeight: any;
  canvasHeight:any = 0;
  lastClickedElement:any;
  //get images
  getImageFromBlob() {
    this.ImageArray = [];
    this.fileNameAtBlob = '';
    //loading images
    for (let i = 1; i <= this.getaLocation[0].page_count; i++) {
      let documentNameWithoutFormat =
        this.getaLocation[0].document_name.split('.')[0];
      this.fileNameAtBlob =
        documentNameWithoutFormat +
        '_' +
        this.getaLocation[0]._id +
        '_' +
        i +
        '.PNG';
      this.ImageArray.push(this.fileNameAtBlob);
    }
    //calling api to get the image as blob
    if (this.getaLocation[0].page_count == this.ImageArray.length) {      
      for (let j = 0; j < this.ImageArray.length; j++) {
        this.analystService.getBlobFromAPI(this.ImageArray[j]).subscribe(
          (val:any) => {         
            this.createImageFromBlob(val);
            var reader = new FileReader();
            reader.readAsDataURL(val);
            reader.addEventListener(
              'load',
              () => {
                this.imageResponse = new Image();
                this.imageResponse.src = reader.result;                
                let component = this;
                this.imageResponse.onload = function () {
                  // Draw preview
                  this.canvas = document.querySelector('#layer' + j);
                  this.context = this.canvas.getContext('2d');
                  this.canvas.width = this.width;
                  this.canvas.height = this.height;
                  this.canvas.style.width = component.DEFAULT_IMG_WIDTH + 'rem';
                  if (!component.imagesRevisedWidth) {
                    component.imagesRevisedWidth[`#layer${j}`] =
                      component.DEFAULT_IMG_WIDTH;
                  }
                  
                  component.images[j] = this;
                  this.context.clearRect(0, 0, this.width, this.height);
                  this.context.drawImage(this, 0, 0);
                  let scaleX:any,
                    scaleY:any,
                    startCoordinates:any = [];
                  if (component.images.length == component.ImageArray.length) {
                    component.documentPreviewScrollHeight =
                      document.getElementsByClassName(
                        'preview-wrapper'
                      )[0]?.scrollHeight;
                    component.canvasHeight =
                      component.documentPreviewScrollHeight /
                      component.ImageArray.length;
                  }
                  this.canvas.addEventListener('mousedown', (e:any) => {
                    startCoordinates = component.getCursorPosition(this, event);
                    let elementId = `#layer${
                      component.activeImg ? component.activeImg : 0
                      }`;
                    const actualWidth:any = $(`${elementId}`).attr('width');
                    const DOMWidth:any = $(`${elementId}`).first().outerWidth();
                    const actualHeight:any = $(`${elementId}`).attr('height');
                    const DOMHeight:any = $(`${elementId}`).first().outerHeight();
                    scaleX = parseInt(actualWidth) / DOMWidth;
                    scaleY = parseInt(actualHeight) / DOMHeight;
                  });
                  this.canvas.addEventListener('mouseup', (e:any) => {
                    console.log("You are in mouseup", e);
                    // if(!component?.lastClickedElement?.className?.includes(component.docAttributeValueClass) ) {
                    //   return;
                    // }
                    const endCoordinates = component.getCursorPosition(
                      this,
                      e
                    );
                    // detecting that user is clicked on the document or drawn a line
                    if(endCoordinates.toString() == startCoordinates.toString()) {
                      return;
                    }
                    const ctx = e.target.getContext('2d');
                    let bounding = component.getBoundingBox(
                      [
                        startCoordinates[0] * scaleX,
                        startCoordinates[1] * scaleY,
                      ],
                      [endCoordinates[0] * scaleX, endCoordinates[1] * scaleY]
                    );
                    console.log("bounding", bounding, "=", ctx);
                    
                    this.context.clearRect(0, 0, this.width, this.height);
                    this.context.drawImage(this, 0, 0);
                    component.drawRectangle(e.target, bounding, null);
                    const httpRequestBody = {
                      doc_id: component.getTaskDocumentId,
                      coordinates: bounding,
                      page_no: parseInt(this.canvas.id.split('layer')[1]) + 1,
                    };
                    console.log("httpRequestBody", httpRequestBody);
                    
                    component.analystService
                      .getBoundingBoxText(httpRequestBody)
                      .subscribe(
                        (data:any) => {
                          let results = data;
                          console.log("coordinates results", results);
                          
                          if (
                            results.extracted_text &&
                            results.extracted_text.length == 0
                          ) {
                            component.toastr.warning(
                              'Could not extract value for the selected bounding box'
                            );
                            return;
                          }
                          let val = results.extracted_text.join(' ');
                          component.revisedFieldCoordinates = [];
                          results.coordinates.forEach((e:any) => {
                            component.revisedFieldCoordinates.push(
                              Math.round(e)
                            );
                          });
                          console.log("component.lastClickedElement", component.lastClickedElement);
                          let index = parseInt(
                            component?.lastClickedElement?.id.split(
                              'sided-panel-values-'
                            )[1]
                          );
                          
                          if (component.lastClickedElement.value === val) {
                            component.filteredAttributesBySmeArray[index].editedByAnalyst = false;
                            component.filteredAttributesBySmeArray[index].edited = false; return;
                          }
                          if (component.originData[index] &&
                            component.originData[index].category_details[0] &&
                            component.originData[index].category_details[0].value === val
                          ) {
                            let color = component.filteredAttributesBySmeArray[index].category_details[0].isColor;
                            component.filteredAttributesBySmeArray[index].category_details = JSON.parse(
                              JSON.stringify(component.originData[index].category_details)
                            );
                            component.filteredAttributesBySmeArray[index].category_details[0].isColor =
                              component.documentDetailsDataObject[component.currentDocumentType
                              ][index].category_details[0].isColor;
                            component.filteredAttributesBySmeArray[index].category_details[0].isColor = color;
                            component.filteredAttributesBySmeArray[index].editedByAnalyst = false;
                            component.filteredAttributesBySmeArray[index].edited = false;
                            component.validateDocument(
                              component.getaLocation[0]._id,
                              component.getDocumentNameById[
                              component.getaLocation[0].document_type_id
                              ]
                            );
                            return;
                          }
                          component.lastClickedElement.value = val;
                          if (component.fieldsChangedObjectArray.length > 0) {
                            component.fieldsChangedObjectArray[index].category_details[0].value = val;
                          } else {
                            component.filteredAttributesBySmeArray[index].category_details[0].value = val;
                            component.filteredAttributesBySmeArray[index].category_details[0]['location'] =
                              component.revisedFieldCoordinates;
                            component.filteredAttributesBySmeArray[index].edited = true;
                            component.filteredAttributesBySmeArray[index].editedByAnalyst = true;
                          }
                          component.validateDocument(
                            component.getaLocation[0]._id,
                            component.getDocumentNameById[
                            component.getaLocation[0].document_type_id
                            ]
                          );
                        },
                        (err) => {
                          if (this.authService.isNotAuthenticated(err.status)) {
                            this.authService.clearCookiesAndRedirectToLogin();
                            return;
                          }
                          this.toastr.error('Error');
                        }
                      );
                  });
                };
              },
              false
            );
            setTimeout(() => {
              // this.overlay.activateOverlay(false, '');
            }, 500);
          },
          (err) => {
            if (this.authService.isNotAuthenticated(err.status)) {
              this.authService.clearCookiesAndRedirectToLogin();
              return;
            }
            // this.toastr.error('Error');
          }
        );
      }
    }
  }
  saveLastClickedElement() {
    this.lastClickedElement = document.activeElement;
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageBlobUrl.push(reader.result);        
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  setindex(index:any) {
    this.activeImg = index;
    var pageid = 'layer' + index;
    this.scrollService.scrollToElementById(pageid, null, null);
  }

  /*
function name: drawRectangle
purpose: draw rectange within canvas
*/

  drawRectangle(canvas:any, boundingBox:any, colorCode:any) {
    const ctx = canvas.getContext('2d');

    const width = Math.abs(boundingBox[0] - boundingBox[2]) + 10;
    const height = Math.abs(boundingBox[1] - boundingBox[7]) + 6;
    // console.log(width, height);
    ctx.beginPath();
    ctx.rect(boundingBox[0], boundingBox[1], width, height);
    // ctx.fillStyle = 'rgba(0,102,255,.15)';
    // ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = colorCode ? colorCode : '#0dbd00';
    ctx.stroke();
  }
  animate(data:any, pageNo:any, index:any): void {
    if (index != this.editableIndex) {
      this.editableIndex = -1;
    }
    let animateDetails = {
      data: data,
      pageNo: pageNo,
      index: index,
    };
    // localStorage.setItem('animate', JSON.stringify(animateDetails));
    let currentField =
      // this.documentDetailsDataObject[this.currentDocumentType][index];
    this.selectedIndex = index;
    this.dataLocation = '';
    this.dataPage = '';
    if (pageNo != '-') {
      var pageid = 'layer' + (pageNo - 1);
      for (let i = 0; i < this.getaLocation[0].extracted_details.length; i++) {
        if (data == this.getaLocation[0].extracted_details[i].category) {
          this.dataLocation =
            this.getaLocation[0].extracted_details[
              i
            ].category_details[0].location.toString();
          this.dataPage =
            this.getaLocation[0].extracted_details[
              i
            ].category_details[0].page_no;
          break;
        }
      }
    }
    this.boundingBox = this.dataLocation;
    this.pageIndex = this.dataPage;
    let canvas = document.querySelectorAll('canvas')[this.pageIndex - 1];
    let { verticalScroll, horizontalScroll } =
      this.scrollService.getScrollValues(this.dataLocation, canvas);
      var pageid = 'layer' + (pageNo - 1);
    this.scrollService.scrollToElementById(
      pageid,
      verticalScroll,
      horizontalScroll
    );
    let context = canvas.getContext('2d');

    // context.drawImage(this.images[this.pageIndex - 1], 0, 0);
    if (!this.boundingBox && !this.pageIndex) {
      this.toastr.warning('No value extracted from this slip');
    } else if (this.boundingBox == '0,0,0,0,0,0,0,0') {
      this.toastr.warning('Predefined value');
    } else {
      this.drawRectangle(
        document.querySelectorAll('canvas')[this.pageIndex - 1],
        this.boundingBox.split(',').map((n:any) => parseInt(n, 10)),
        null
      );
      if (currentField.editedByAnalyst) {
        this.drawRectangle(
          document.querySelectorAll('canvas')[this.pageIndex - 1],
          this.originData[index].category_details[0].location.map((n:any) =>
            parseInt(n, 10)
          ),
          this.ORIGIN_VAL_BOUNDING_COLOR
        );
      }
      // this.zoomIn(this.pageIndex - 1);
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  // Functions for elements in page-container
  getTask(onSubmit:any, docId:any) {
    // clearInterval(this.refreshDocList);
    this.validateDocId = docId;
    this.ImageArray = [];
    this.fileNameAtBlob = '';
    this.imageBlobUrl = [];
    this.pauseTimer();
    this.resetTimer();
    // this.diplayInfo = true;
    this.getTaskFlag = false;
    // this.analystheaderflag = false;
    this.documentListFlag = false;
    this.scrollService.activateOverlay(true, 'sk-circle');
    
    this.getImageFromBlob();
    this.getTaskFromBackend(docId).subscribe(
      (data:any) => {
        this.getaLocation = data;
        if (!data[0]) {
          this.toastr.warning('You have no documents to review!');
          this.getTaskIsDisabled = false;
          setTimeout(() => {
            this.scrollService.activateOverlay(false, '');
          }, 500);
        } else {
          this.startTimer();
          this.getTaskDocumentId = data[0]._id;
          this.getTaskDocumentTypeId = data[0].document_type_id;
          if (!onSubmit) {
            this.getTaskIsDisabled = true;
            this.showDocumentTypeDropdown = true;
          }
          this.originData = [];
          this.currentDocumentTypeId = data[0]['document_type_id'];
          this.currentDocumentType =
            this.getDocumentNameById[data[0].document_type_id];
          this.currentDocumentTypeVar =
            this.getDocumentNameById[data[0].document_type_id];
          this.getTaskDocumentConfidenceScore =
            data[0].confidence_score < 0.5
              ? 'ls'
              : data[0].confidence_score < 0.75
              ? 'ms'
              : 'hs';
          this.showSaveModalSuccess = true;
          const getTaskFieldsArray = data[0].extracted_details;
          if (data[0].edited_details_a) {
            if (data[0].edited_details_a.length > 0) {
              data[0].edited_details_a.forEach((editedField:any) => {
                if (editedField.category) {
                  getTaskFieldsArray.forEach((extratctedField:any, index:any) => {
                    if (editedField.category === extratctedField.category) {
                      this.originData.push(
                        JSON.parse(JSON.stringify(extratctedField))
                      );
                      // editedField['editedByAnalyst'] = true;
                      if (editedField['edited'] == true) {
                        editedField['editedByAnalyst'] = true;
                        getTaskFieldsArray.splice(index, 1, editedField);
                      }
                      // getTaskFieldsArray.splice(index, 1, editedField);
                    }
                  });
                }
              });
            }
          }
          if (this.getDocumentNameById[data[0].document_type_id]) {
            this.documentDetailsDataObject[
              this.getDocumentNameById[data[0].document_type_id]
            ] = getTaskFieldsArray;
          } else {
            this.getDocumentNameById[this.getTaskDocumentTypeId] = 'Others';
            this.documentDetailsDataObject['Others'] = getTaskFieldsArray;
            this.documentTypesArray.push('Others');
            this.currentDocumentType = 'Others';
            this.currentDocumentTypeVar = 'Others';
          }
          this.documentTypeDataObjectArray.forEach(
            (documentTypeDataObjectArrayElement:any) => {
              if (
                this.getTaskDocumentTypeId ===
                documentTypeDataObjectArrayElement.document_type_id._id
              ) {
                documentTypeDataObjectArrayElement.attributes.forEach(
                  (attributeElement:any) => {
                    const thresholdValue: any = attributeElement.threshold;
                    let confidenceScoreValue: any;
                    this.documentDetailsDataObject[
                      this.getDocumentNameById[data[0].document_type_id]
                    ].forEach((documentData:any) => {
                      if (
                        attributeElement.attribute_name ===
                        documentData.category
                      ) {
                        confidenceScoreValue =
                          documentData.category_details[0].confidence_score;
                        if (confidenceScoreValue >= thresholdValue) {
                          documentData.category_details[0]['isColor'] = 'true';
                          // green
                        } else {
                          documentData.category_details[0]['isColor'] = 'false';
                        }
                      }
                    });
                  }
                );
              }
            }
          );
          // Filter attibutes according to SME selection criteria
          this.documentDetailsDataObject[
            this.getDocumentNameById[data[0].document_type_id]
          ].forEach((documentDetailsDataObjectElement:any) => {
            this.documentTypeDataObjectArray.forEach(
              (documentTypeDataObjectArrayElement:any) => {
                // Match the documents by Name
                if (
                  documentTypeDataObjectArrayElement.document_type_id
                    .document_type ===
                  this.getDocumentNameById[data[0].document_type_id]
                ) {
                  documentTypeDataObjectArrayElement.attributes.forEach(
                    (attributesBySmeElement:any) => {
                      // Match the category value with the SME attribute and filter
                      if (
                        documentDetailsDataObjectElement.category ===
                        attributesBySmeElement.attribute_name
                      ) {
                        documentDetailsDataObjectElement['edited'] = false;
                        this.filteredAttributesBySmeArray.push(
                          documentDetailsDataObjectElement
                        );
                      }
                    }
                  );
                }
              }
            );
          });
          this.documentDetailsDataObject[
            this.getDocumentNameById[data[0].document_type_id]
          ] = this.filteredAttributesBySmeArray;
        }
        this.validateDocument(
          data[0]._id,
          this.getDocumentNameById[data[0].document_type_id]
        );
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.analystheaderflag = true;
        setTimeout(() => {
          this.scrollService.activateOverlay(false, '');
        }, 500);
        this.toastr.error(err.error.message);
        this.documentListFlag = true;
        this.fetchAndUpdateDocsListPeriodically();
        // this.getDocumentsOfProject();
      }
    );
  }

  validateDocument(docId:any, documentTypeName:any) {
    // console.log(` In validateDocument, docId: ${docId}\n Doc type id ${documentTypeName} `);
    let requestBody = {
      ...this.getaLocation[0],
    };

    // TODO:: Hard coded value for dev purpose, to be removed , it should be added in backend

    let td = {
      type: 'table',
      content: [
        {
          'Account Number': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [613, 837, 633, 837, 633, 665, 613, 665],
                page_no: 2,
                value: 'B0180PF1701001',
              },
            ],
          },
          'Account Name': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [579, 605, 946, 605, 946, 980, 579, 980],
                page_no: null,
                value: 'A) Yieh United Steel Co, Lid and/or as Original',
              },
            ],
          },
          'Account Status': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [],
                page_no: null,
                value: 'Booked',
              },
            ],
          },
          'Cedant ID': {
            category_details: [
              {
                confidence_score: 0.8,
                location: [580, 601, 1137, 601, 1137, 1170, 580, 1170],
                page_no: 2,
                value: 'As Per Attachment Number 3',
              },
            ],
          },
          Peril: {
            category_details: [
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'natural perils',
              },
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'earthquake',
              },
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'flood',
              },
            ],
          },
        },

        {
          'Account Number': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [613, 837, 633, 837, 633, 665, 613, 665],
                page_no: 2,
                value: 'R2-B0180PF1701001',
              },
            ],
          },
          'Account Name': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [579, 605, 946, 605, 946, 980, 579, 980],
                page_no: null,
                value: 'R2-A) Yieh United Steel Co, Lid and/or as Original',
              },
            ],
          },
          'Account Status': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [],
                page_no: null,
                value: 'Booked',
              },
            ],
          },
          'Cedant ID': {
            category_details: [
              {
                confidence_score: 0.8,
                location: [580, 601, 1137, 601, 1137, 1170, 580, 1170],
                page_no: 2,
                value: 'As Per Attachment Number 3',
              },
            ],
          },
          Peril: {
            category_details: [
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'natural perils',
              },
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'earthquake',
              },
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'flood',
              },
            ],
          },
        },
      ],
    };

    let td1 = {
      type: 'table',
      content: [
        {
          'Account Number1': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [613, 837, 633, 837, 633, 665, 613, 665],
                page_no: 2,
                value: 'B0180PF1701002',
              },
            ],
          },
          'Account Name1': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [579, 605, 946, 605, 946, 980, 579, 980],
                page_no: null,
                value: 'B) Yieh United Steel Co, Lid and/or as Original',
              },
            ],
          },
          'Account Status': {
            category_details: [
              {
                confidence_score: 0.9,
                location: [],
                page_no: null,
                value: 'Booked',
              },
            ],
          },
          'Cedant ID': {
            category_details: [
              {
                confidence_score: 0.8,
                location: [580, 601, 1137, 601, 1137, 1170, 580, 1170],
                page_no: 2,
                value: 'As Per Attachment Number 3',
              },
            ],
          },
          Peril: {
            category_details: [
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'natural perils',
              },
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'earthquake',
              },
              {
                confidence_score: 0.25,
                location: [],
                page_no: null,
                value: 'flood',
              },
            ],
          },
        },
      ],
    };

    requestBody.details = this.filteredAttributesBySmeArray;
    requestBody.document_id = docId;
    this.analystService.validDocument(requestBody).subscribe(
      (data:any) => {
        // console.log(`validated doc details: `, data);
        // console.log(`doc details before validation: `, this.documentDetailsDataObject);
        this.documentDetailsDataObject[documentTypeName].forEach(
          (element:any, index:any) => {
            element.has_error = data[index].has_error;
          }
        );
        this.documentDetailsDataObject[documentTypeName].push(td);
        this.documentDetailsDataObject[documentTypeName].push(td1);
        // console.log(`doc details after validation: `, this.documentDetailsDataObject);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error('Error');
      }
    );
  }

  checkUserProjects() {
    if (this.authService.getCurrentProjectId()) {
      this.userHasProjects = true;
    }
  }

  // on change of project
  onProjectChange(event: any) {
    console.log("event", event);
    this.selectedProjectId = event.id;
    if (event.taskAssignment == 'Auto') {
      this.documentListFlag = false;
      this.getTaskFlag = true;
    } else {
      this.getTaskFlag = false;
      this.documentListFlag = true;
      this.isDefault = false;
      this.fetchAndUpdateDocsListPeriodically();
      // const request = {
      //   project_id: event.id
      // };
      // this.adminService.projectDocument(request).subscribe(response => {
      //   const projectPerformanceResponse: any = response;
      //   this.rerender();
      //   this.documents = projectPerformanceResponse.data;
      // });
    }
    this.authService.setCurrentProjectId(this.selectedProjectId);
    // this.ngOnInit();
  }


  convertToInteger(inputValue:any) {
    const integerValue = Math.round(inputValue);
    if (!isNaN(integerValue)) {
      return Math.round(inputValue);
    }
    return '';
  }

  getTaskFromBackend(docId:any) {
    let httpRequestBody:any = {
      role_id: this.authService.getCurrentUserRoleId(),
      user_id: this.authService.getCurrentUserId(),
      project_id: this.authService.getCurrentProjectId(),
    };
    let getTaskRoute = null;
    if (docId) {
      getTaskRoute = '/documents/task-by-id?review=true';
      httpRequestBody['document_id'] = docId;
    } else {
      getTaskRoute = '/documents/task?review=true';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + this.token,
      }),
    };

    return this.http.post(
      `${environment.APIEndpoint}${getTaskRoute}`,
      httpRequestBody,
      httpOptions
    );
  }
  getDocumentTypesFromBackend() {
    const httpRequestBody = {
      project_id: this.authService.getCurrentProjectId(),
    };
    this.analystService.getDocumentTypes(httpRequestBody).subscribe(
      (data) => {
        const documentTypeGetArrayResponse: any = data;
        this.documentTypeDataObjectArray = data;
        this.documentTypesArray = [];
        if (documentTypeGetArrayResponse.message === 'Send project ID') {
          this.userHasProjects = false;
        } else {
          this.userHasProjects = true;
          documentTypeGetArrayResponse.forEach((docTypeElement:any) => {
            this.getDocumentNameById[docTypeElement.document_type_id._id] =
              docTypeElement.document_type_id.document_type;
            this.documentTypesArray.push(
              docTypeElement.document_type_id.document_type
            );
          });
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error('Error');
      }
    );
  }

  logout() {
    this.router.navigate(['/login']);
  }

  // Functions for elements in Sided-Panel
  onDocumentTypeFieldValueChange(
    inputElement:any,
    currentDocumentType:any,
    rowDataKey:any,
    index:any
  ) {
    // Every value edited is correct
    const changedValuesObject = {};
    const changedValuesObjectCopy = Object.assign(
      changedValuesObject,
      rowDataKey
    );
    this.selectedIndex = index;
    // this.filteredAttributesBySmeArray[index]['editedByAnalyst'] = true;
    changedValuesObjectCopy.category_details[0].value = inputElement.value;
    // pushing  data to fieldsChangedObjectArray  on change of inputfield
    if (this.fieldsChangedObjectArray.length > 0) {
      for (let k = 0; k < this.fieldsChangedObjectArray.length; k++) {
        if (
          this.fieldsChangedObjectArray[k]['category'] ==
          changedValuesObjectCopy.category
        ) {
          this.fieldsChangedObjectArray[k]['category_details'][0].value =
            inputElement.value;
          this.ifcount++;
        } else {
          this.elsecount++;
        }
      }
    } else {
      this.fieldsChangedObjectArray.push(changedValuesObjectCopy);
    }
    if (this.ifcount === 0 && this.elsecount > 0) {
      this.fieldsChangedObjectArray.push(changedValuesObjectCopy);
    }
    if (this.autoUpdate) {
      // find the matching item and relace with new item in fieldsChangedObjectArray
      this.documentDetailsDataObject[currentDocumentType].map(
        (obj:any) =>
          this.fieldsChangedObjectArray.find(
            (o:any) => o.category === obj.category
          ) || obj
      );
      this.fieldsChangedObjectArray =
        this.documentDetailsDataObject[currentDocumentType];
      for (let i = 0; i < this.fieldsChangedObjectArray.length; i++) {
        if (!this.fieldsChangedObjectArray[i]['edited']) {
          this.fieldsChangedObjectArray[i]['edited'] = false;
        }
      }
      this.fieldsChangedObjectArray[index]['edited'] = true;
      if (
        this.fieldsChangedObjectArray[index]['category_details'][0].value === ''
      ) {
        this.fieldsChangedObjectArray[index]['edited'] = false;
      }
    } else {
      for (let i = 0; i < this.attributes[currentDocumentType].length; i++) {
        this.attributes[currentDocumentType][i]['edited'] = true;
        if (
          this.attributes[currentDocumentType][i]['category_details'][0]
            .value === ''
        ) {
          this.attributes[currentDocumentType][i]['edited'] = false;
        }
      }
      this.fieldsChangedObjectArray = this.attributes[currentDocumentType];
    }
    // validation for submit button on document type change
    for (let k = 0; k < this.fieldsChangedObjectArray.length; k++) {
      if (this.fieldsChangedObjectArray[k]['category_details'][0].value) {
        this.valueCount++;
      }
    }
    if (this.manualUpdate) {
      if (this.attributes[currentDocumentType].length === this.valueCount) {
        this.isButton = true;
      } else {
        this.isButton = false;
      }
    } else {
      this.documentDetailsDataObject[currentDocumentType].forEach((element:any) => {
        element.category_details.forEach((value:any) => {
          if (value.value) {
            this.totalValue++;
          }
        });
      });
      if (
        this.documentDetailsDataObject[currentDocumentType].length ==
        this.totalValue
      ) {
        this.isButton = true;
      } else if (
        this.documentDetailsDataObject[currentDocumentType].length ===
        this.valueCount
      ) {
        this.isButton = true;
      } else {
        this.isButton = false;
      }
    }
    this.ifcount = 0;
    this.elsecount = 0;
    this.valueCount = 0;
    this.totalValue = 0;
  }

  updateAndValidate() {
    this.validateFieldBySme();
  }

  validateFieldBySme() {
    this.lengthError = [];
    this.dataTypeError = [];
    this.incorrectLengthArray = [];
    for (let i = 0; i < this.fieldsChangedObjectArray.length; i++) {
      for (const allDocumentsetBySme of this.documentTypeDataObjectArray) {
        for (let j = 0; j < allDocumentsetBySme.attributes.length; j++) {
          if (
            this.fieldsChangedObjectArray[i].category ===
              allDocumentsetBySme.attributes[j].attribute_name &&
            this.fieldsChangedObjectArray[i].edited
          ) {
            if (
              allDocumentsetBySme.attributes[j].length &&
              this.fieldsChangedObjectArray[i].category_details[0].value
                .length !== allDocumentsetBySme.attributes[j].length
            ) {
              const incorrectlengthArray = {
                attribute_name: this.fieldsChangedObjectArray[i].category,
                length: allDocumentsetBySme.attributes[j].length,
              };
              this.lengthError.push(incorrectlengthArray);
            } else {
              this.lengthError = [];
            }
            if (
              allDocumentsetBySme.attributes[j].data_type === 'number' &&
              (allDocumentsetBySme.attributes[j].upper_limit ||
                allDocumentsetBySme.attributes[j].lower_limit)
            ) {
              this.dataTypeError = [];
              if (
                allDocumentsetBySme.attributes[j].lower_limit <
                  this.fieldsChangedObjectArray[i].category_details[0].value &&
                this.fieldsChangedObjectArray[i].category_details[0].value <
                  allDocumentsetBySme.attributes[j].upper_limit
              ) {
                this.dataTypeError = [];
                this.isNumberError = [];
              } else {
                this.isNumberError = [];
                const isNumber = {
                  attribute_name:
                    allDocumentsetBySme.attributes[j].attribute_name,
                  value:
                    this.fieldsChangedObjectArray[i].category_details[0].value,
                  isnum: /^\d+$/.test(
                    this.fieldsChangedObjectArray[i].category_details[0].value
                  ),
                };
                this.isNumberError.push(isNumber);
                for (const iterator of this.isNumberError) {
                  if (iterator.isnum) {
                    this.isNumberValid = true;
                  } else {
                    this.isNumberValid = false;
                  }
                }
                this.dataTypeError = [];
                const incorrectrangeArray = {
                  attribute_name:
                    allDocumentsetBySme.attributes[j].attribute_name,
                  data_type: allDocumentsetBySme.attributes[j].data_type,
                  lower_limit: allDocumentsetBySme.attributes[j].lower_limit,
                  upper_limit: allDocumentsetBySme.attributes[j].upper_limit,
                };
                this.dataTypeError.push(incorrectrangeArray);
              }
            }
          }
        }
      }
    }
  }
  onDocumentTypeValueChange(inputValue:any, flag:any) {
    this.valueCount = 0;
    this.fieldsChangedObjectArray = [];
    this.isButton = false;
    this.getTaskDocumentConfidenceScore = 'none';
    this.selectedDocumentType = inputValue;
    this.currentDocumentType = inputValue;
    this.currentDocumentTypeVar = inputValue;
    this.manualUpdate = false;
    this.autoUpdate = false;
    if (flag) {
      this.documentTypeChangeIndicator = true;
    } else {
      this.autoUpdate = true;
    }
  }

  documentTypeValueChanged() {
    this.documentTypeChangeIndicator = false;
    this.autoUpdate = true;
    this.manualUpdate = false;
  }

  documentTypeValueUnchanged() {
    this.documentTypeChangeIndicator = false;
    this.manualUpdate = true;
    this.autoUpdate = false;
    this.attributes = {};
    this.testVar = [];
    this.documentTypeDataObjectArray.forEach((element:any) => {
      if (
        element.document_type_id.document_type === this.selectedDocumentType
      ) {
        this.currentDocumentTypeId = element.document_type_id._id;
        element.attributes.forEach((attr:any) => {
          const selectedDocumentType = this.selectedDocumentType;
          const json = {
            [selectedDocumentType]: {
              category_details: [
                {
                  location: [],
                  confidence_score: '',
                  page_no: '',
                  value: '',
                },
              ],
              category: attr.attribute_name,
              edited: false,
            },
          };
          this.attributes = json;
          this.testVar.push(this.attributes[selectedDocumentType]);
        });
      }
    });
    const attributesOnDocumentChange = {
      [this.selectedDocumentType]: this.testVar,
    };
    this.attributes = attributesOnDocumentChange;
  }
  onSaveDocumentClick() {
    // Clarification: No need to Get Task after saving. Should remain in same condition
    this.reviewTime = this.time.getTime() / 1000;
    const httpRequestBody = {
      id: this.getTaskDocumentId,
      role_id: this.authService.getCurrentUserRoleId(),
      edited_document_type_id: this.manualUpdate
        ? this.currentDocumentTypeId
        : null,
      review_time: this.reviewTime,
      edited_details: this.fieldsChangedObjectArray.length
        ? this.fieldsChangedObjectArray
        : this.filteredAttributesBySmeArray,
    };

    this.analystService.saveDocument(httpRequestBody).subscribe(
      (data) => {
        const saveDocumentResponse: any = data;
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error(err.error.message);
      }
    );
  }
  submitAndGetTask(getTaskOnSubmit:any) {
    // Submit PUT Call
    this.reviewTime = this.time.getTime() / 1000;
    const httpRequestBody = {
      id: this.getTaskDocumentId,
      role_id: this.authService.getCurrentUserRoleId(),
      edited_document_type_id: this.manualUpdate
        ? this.currentDocumentTypeId
        : null,
      review_time: this.reviewTime,
      edited_details: this.fieldsChangedObjectArray.length
        ? this.fieldsChangedObjectArray
        : this.filteredAttributesBySmeArray,
    };

    if (getTaskOnSubmit) {
      // Submit and Get New Task
      this.scrollService.activateOverlay(true, 'sk-circle');
      this.analystService.submitTask(httpRequestBody).subscribe(
        (data) => {
          const submitDocumentResponse: any = data;
          this.autoUpdate = true;
          this.manualUpdate = false;
          this.getTask(true, null);
        },
        (err) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          this.toastr.error(err.error.message);
          this.scrollService.activateOverlay(false, 'sk-circle');
        }
      );
    } else {
      // Submit and Close
      this.scrollService.activateOverlay(true, 'sk-circle');
      this.analystService.submitDocument(httpRequestBody).subscribe(
        (data) => {
          this.autoUpdate = true;
          this.manualUpdate = false;
          this.ngOnInit();
        },
        (err) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          this.toastr.error(err.error.message);
          this.scrollService.activateOverlay(false, 'sk-circle');
        }
      );
      this.enableGetTaskButton();
      this.showDocumentTypeDropdown = false;
    }
    this.fieldsChangedObjectArray = [];
    this.filteredAttributesBySmeArray = [];
  }

  enableGetTaskButton() {
    this.getTaskIsDisabled = false;
  }

  onRejectReasonSelect(inputValue:any) {
    this.rejectReasonValue = inputValue;
  }

  getReasonsList() {
    this.analystService.getReasonList().subscribe(
      (data) => {
        const rejectDocumentReasonsResponse: any = data;
        this.rejectionReasonsArray = new Array(
          ...rejectDocumentReasonsResponse
        );
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error('Error');
      }
    );
  }

  rejectDocumentModalSubmit() {
    this.reviewTime = this.time.getTime() / 1000;
    const httpRequestBody = {
      id: this.getTaskDocumentId,
      role_id: this.authService.getCurrentUserRoleId(),
      review_time: this.reviewTime,
      reason_for_rejection: this.rejectReasonValue,
    };
    this.analystService.rejectDocument(httpRequestBody).subscribe(
      (data) => {
        this.enableGetTaskButton();
        this.showDocumentTypeDropdown = false;
        this.rejectReasonValue = '';
        this.documentTypeDataObjectArray = [];
        this.ngOnInit();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error('Error');
      }
    );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    // document.getElementById('header-user-profile').style.marginLeft = '75%';
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    localStorage.setItem('pop_out_window_closed', 'true');
  }

  getManualTask(clickedDocumentId:any) {
    const httpRequestBody = {
      role_id: this.authService.getCurrentUserRoleId(),
      user_id: this.authService.getCurrentUserId(),
      project_id: this.authService.getCurrentProjectId(),
      document_id: clickedDocumentId,
    };

    console.log(httpRequestBody);
    this.analystService.getManualTaskApi(httpRequestBody).subscribe(
      (response) => {
        const loginResponse = response;
        console.log(loginResponse);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.error(err.error.message);
      }
    );
  }

  highlightRow(index:any) {
    if (index != this.editableIndex) {
      this.editableIndex = -1;
    }
    this.selectedIndex = index;
  }

  zoomIn(index:any) {
    let nthLayer;
    if (index) {
      nthLayer = `#layer${index}`;
    } else {
      nthLayer = `#layer${this.activeImg}`;
    }
    if (this.imagesRevisedWidth[nthLayer] && !index) {
      this.imagesRevisedWidth[nthLayer] *= this.ZOOM_IN_BY;
      // console.log(`If newWidthOfImage: `, newWidthOfImage);
    } else {
      this.imagesRevisedWidth[nthLayer] =
        this.DEFAULT_IMG_WIDTH * this.ZOOM_IN_BY;
      // console.log(`Else newWidthOfImage: `, newWidthOfImage);
    }
    // console.log(`after this.imagesRevisedWidth[nthLayer]: `, this.imagesRevisedWidth[nthLayer]);
    (<HTMLElement>document.querySelector(nthLayer)).style.width =
      this.imagesRevisedWidth[nthLayer] + 'rem';
  }

  zoomOut() {
    let nthLayer = `#layer${this.activeImg}`;
    let canvas = document.querySelector(nthLayer);
    if (this.imagesRevisedWidth[nthLayer]) {
      this.imagesRevisedWidth[nthLayer] *= this.ZOOM_OUT_BY;
    } else {
      this.imagesRevisedWidth[nthLayer] =
        this.DEFAULT_IMG_WIDTH * this.ZOOM_OUT_BY;
    }
    (<HTMLElement>document.querySelector(nthLayer)).style.width =
      this.imagesRevisedWidth[nthLayer] + 'rem';
  }
  fitToScreen() {
    (<HTMLElement>(
      document.querySelector(`#layer${this.activeImg}`)
    )).style.width = this.DEFAULT_IMG_WIDTH + 'rem';
  }

  rotate() {
    let nthLayer = `#layer${this.activeImg}`;
    // this.state = (this.state === 'default' ? 'rotated' : 'default');
    let degree = 0;
    if (this.imagesRevisedDegree[nthLayer]) {
      if (this.imagesRevisedDegree[nthLayer] == 270) {
        this.imagesRevisedDegree[nthLayer] = 0;
      } else {
        this.imagesRevisedDegree[nthLayer] += 90;
      }
    } else {
      this.imagesRevisedDegree[nthLayer] = 90;
    }
    (<HTMLElement>(
      document.querySelector(`#layer${this.activeImg}`)
    )).style.transform = `rotate(${this.imagesRevisedDegree[nthLayer]}deg)`;
  }

  getDataAndValidateDocument(index:any, docField:any) {
    this.validateDocument(
      this.getaLocation[0]._id,
      this.getDocumentNameById[this.getaLocation[0].document_type_id]
    );
    this.editableIndex = -1;
    if (
      docField.category_details[0].value ===
      this.originData[index].category_details[0].value
    ) {
      console.log('inside if');
      this.filteredAttributesBySmeArray[index]['editedByAnalyst'] = false;
      this.filteredAttributesBySmeArray[index]['edited'] = false;
    } else {
      this.filteredAttributesBySmeArray[index]['editedByAnalyst'] = true;
    }
    this.validateDocument(
      this.getaLocation[0]._id,
      this.getDocumentNameById[this.getaLocation[0].document_type_id]
    );
  }

  editThisValue(index:any) {
    localStorage.setItem('editable_index', index);
    this.editableIndex = index;
  }
  updateTableCellContent(tableRecordField:any) {
    if (this.previouslyUpdatedTableCellContent) {
      this.previouslyUpdatedTableCellContent.canUpdateTableCellContent = false;
    }
    tableRecordField.canUpdateTableCellContent = true;
    this.previouslyUpdatedTableCellContent = tableRecordField;
  }
  getCanvasStyle() {
    return 'hide-element';
  }
  getFormStyle() {
    return 'col-10';
  }
}
