import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ScrollService } from '../../services/scroll.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-canvas-document',
  templateUrl: './canvas-document.component.html',
  styleUrls: ['./canvas-document.component.scss'],
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
export class CanvasDocumentComponent implements OnInit {
  // Check from which module we are calling this component
  calledBy: any;
  @Input() document: any;
  state: any = true;
  ImageArray: any;
  documentTotalPages: any;
  isNewWindow: boolean = false;
  windowDocument: any;
  isEditBox: boolean = false;
  editTextBoxText = '';
  oldEditText = '';
  @Input() set openWindowDocument(document: any) {
    // For creating canvas layer, store total page count into documentTotalPages
    this.windowDocument = document;
    document.isNewWindow = true;
    this.documentTotalPages = document.page_count;
    document?.isNewWindow
      ? (this.isNewWindow = true)
      : (this.isNewWindow = false);
  }
  activeAttribute: any;
  imagesSubscription: Subscription;
  ImageIndexSubscription: Subscription;
  subscriptionParentComponent: Subscription;
  activeAttributeSubscription: Subscription;
  clearBoundingBoxSubscription: Subscription;
  subcriptionHideEditBoxSubject: Subscription;
  subcriptionchangeTextAtrribute: Subscription;
  currentImage: any;
  currentImageIndex: any = 0;
  imageBlobUrl: any = [];
  canScrollThumbnail: Boolean = true;
  // For canvas Image load
  imageResponse: any;
  // Canvas Default controlls
  ZOOM_IN_BY: number = 1.2; // Existing + 20%
  ZOOM_OUT_BY: number = 1 / 1.2; // Reverse previoulastClickedElements zoom in
  DEFAULT_IMG_WIDTH: number = 100;
  images: any = [];
  imagesRevisedWidth: any = {};
  imagesRevisedDegree: any = {};
  documentPreviewScrollHeight: any;
  canvasHeight: any = 0;
  predictedCanvasIndex = 0;
  canvasAutoScrollTo = false;
  isMouseDown: boolean = false;

  docCanvas: any;
  webURL: any;
  // Input style relavent variables
  docAttributeValueClass = 'doc-attribute-value';
  activeImg: any;
  activeAttributeIndexSubscription: Subscription;
  activeAttributeIndex: any;
  editboxPageIndex: any;
  @ViewChild('editBoxDiv') editBoxDiv: ElementRef;
  top: any;
  left: any;
  constructor(
    private commonService: CommonService,
    private scrollService: ScrollService,
    public toastService: ToasterService
  ) {}
  ngOnInit(): void {
    //get current index subscription
    this.ImageIndexSubscription =
      this.scrollService.currentPageObserval.subscribe(
        (activePageIndex: any) => {
          if (activePageIndex != null) {
            this.currentImageIndex = activePageIndex;
            this.getIndex(this.currentImageIndex);
          }
        }
      );
    this.subscriptionParentComponent =
      this.commonService.parentComponent.subscribe((flag) => {
        this.calledBy = flag;
      });
    this.activeAttributeIndexSubscription =
      this.commonService.activeAttributeIndex.subscribe((index) => {
        this.activeAttributeIndex = index;
      });
    // To get current active input
    this.activeAttributeSubscription =
      this.commonService.activeAttribute.subscribe((attiribute) => {
        this.activeAttribute = attiribute;
      });
    // change value for attribute input field
    this.subcriptionchangeTextAtrribute =
      this.commonService.changeTextAtrribute.subscribe((res) => {
        this.editTextBoxText = res;
        if (res) {
          this.isEditBox = true;
          this.editBoxDiv.nativeElement.style.display = 'block';

          if (
            this.document.edited_document_type_id_a != null ||
            this.document.edited_document_type_id_qc != null
          ) {
            this.oldEditText = 'NA';
          }
        }
      });
    this.clearBoundingBoxSubscription =
      this.commonService.clearBoundingBoxSubject.subscribe((labelName) => {
        if (this.editBoxDiv?.nativeElement) {
          if (labelName == 'hide' || labelName == undefined) {
            this.isEditBox = false;
            this.editBoxDiv.nativeElement.style.display = 'none';
          } else {
            this.isEditBox = true;
            this.editBoxDiv.nativeElement.style.display = 'block';
          }
        }

        this.clearAllBoundBox();
      });

    this.subcriptionHideEditBoxSubject =
      this.commonService.hideEditBoxSubject.subscribe((props: any) => {
        this.clearAllBoundBox();
        if (this.editBoxDiv?.nativeElement) {
          if (props.show) {
            this.isEditBox = props.show;

            this.editBoxDiv.nativeElement.style.top = props.editBoxYaxis;
            this.editBoxDiv.nativeElement.style.left = props.editBoxXaxis + '%';
            this.editBoxDiv.nativeElement.style.display = 'block';
          } else {
            this.editBoxDiv.nativeElement.style.display = 'none';
          }
        }

        if (
          this.document?.updatedAttributes[this.activeAttributeIndex]
            ?.category_details
        ) {
          this.editTextBoxText =
            this.document?.updatedAttributes[this.activeAttributeIndex][
              'category_details'
            ][0].value;
          this.oldEditText =
            this.document?.originAttributes[this.activeAttributeIndex][
              'category_details'
            ][0].value;
        }
        if (
          this.document?.edited_document_type_id_a != null ||
          this.document?.edited_document_type_id_qc != null
        ) {
          this.oldEditText = 'NA'; ///this.document.updatedAttributes[this.activeAttributeIndex]['category_details'][0].value;
        }
      });

    if (this.document) {
      this.documentTotalPages = this.document?.page_count;
      this.document?.isNewWindow
        ? (this.isNewWindow = true)
        : (this.isNewWindow = false);
    }
    this.getImages();
  }
  ngAfterViewInit() {
    this.editBoxDiv.nativeElement.style.display = 'none';
  }
  getImages() {
    this.imagesSubscription =
      this.commonService.documentImageObserval.subscribe((image) => {
        if (image) {
          this.imageBlobUrl.push(image);

          this.loadCanvasIntoLayer(image, this.imageBlobUrl.length - 1);
        }
      });
  }
  /***
   @desc Rotate Document
   */
  rotate() {
    let currentCanvasLayer = `#layer${this.currentImageIndex}`;
    let degree = 0;
    if (this.imagesRevisedDegree[currentCanvasLayer]) {
      if (this.imagesRevisedDegree[currentCanvasLayer] == 270) {
        this.imagesRevisedDegree[currentCanvasLayer] = 0;
      } else {
        this.imagesRevisedDegree[currentCanvasLayer] += 90;
      }
    } else {
      this.imagesRevisedDegree[currentCanvasLayer] = 90;
    }
    (<HTMLElement>(
      document.querySelector(`#layer${this.currentImageIndex}`)
    )).style.transform = `rotate(${this.imagesRevisedDegree[currentCanvasLayer]}deg)`;
  }
  /**
   @desc Zoom current Image 
   **/
  zoomIn(val: any) {
    let currentCanvasLayer = `#layer${this.currentImageIndex}`;
    if (this.imagesRevisedWidth[currentCanvasLayer]) {
      this.imagesRevisedWidth[currentCanvasLayer] *= this.ZOOM_IN_BY;
    } else {
      this.imagesRevisedWidth[currentCanvasLayer] =
        this.DEFAULT_IMG_WIDTH * this.ZOOM_IN_BY;
    }
    (<HTMLElement>document.querySelector(currentCanvasLayer)).style.width =
      this.imagesRevisedWidth[currentCanvasLayer] + '%';
  }
 /***
   @desc  Set the document default size for fit to screen
   */
  fitToScreen() {
    let currentCanvasLayer = `#layer${this.currentImageIndex}`;
    this.imagesRevisedWidth[currentCanvasLayer] = this.DEFAULT_IMG_WIDTH;
    (<HTMLElement>document.querySelector(currentCanvasLayer)).style.width =
      this.DEFAULT_IMG_WIDTH + '%';
  }
 /***
   @desc  Zoom out current Image
   */  
  zoomOut() {
    let currentCanvasLayer = `#layer${this.currentImageIndex}`;
    let canvas = document.querySelector(currentCanvasLayer);
    if (this.imagesRevisedWidth[currentCanvasLayer]) {
      this.imagesRevisedWidth[currentCanvasLayer] *= this.ZOOM_OUT_BY;
    } else {
      this.imagesRevisedWidth[currentCanvasLayer] =
        this.DEFAULT_IMG_WIDTH * this.ZOOM_OUT_BY;
    }
    (<HTMLElement>document.querySelector(currentCanvasLayer)).style.width =
      this.imagesRevisedWidth[currentCanvasLayer] + '%';
  }
  /***
   @desc Open document in new window
   */  
  openDocInNewWindow() {
    let document = this.commonService.getReviewDocument;
    localStorage.setItem('project_id', document.project_id);
    localStorage.setItem('document_id', document._id);
    if (this.calledBy == 'analyst') {
      this.webURL = window.location.href.split('analyst')[0];
    } else if (this.calledBy == 'qc') {
      this.webURL = window.location.href.split('qc')[0];
    }
    this.docCanvas = window.open(
      `${this.webURL}canvas`,
      'docCanvas',
      'toolbar=no, scrollbars=no, resizable=no, top=100, left=500, width=600, height=400'
    );
  }
  contextArray: any = [];
    /***
   @desc For access current component inside img onload, create reference of this
   */ 
  loadCanvasIntoLayer(blobData: any, index: number) {
    const canvas: any = document.getElementById('layer' + index);
    const context = canvas.getContext('2d');
    let component = this;
    const img = new Image();
    img.src = blobData;
    this.contextArray.push({ context: context, img: img });
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.width = component.DEFAULT_IMG_WIDTH + '%';
      if (!component.imagesRevisedWidth) {
        component.imagesRevisedWidth[`#layer${index}`] =
          component.DEFAULT_IMG_WIDTH;
      }
      context.drawImage(img, 0, 0);
      let actualWidth: any;
      let actualHeight: any;
      let width: any;
      let height: any;
      let scaleX: any;
      let scaleY: any;
      let startCoordinates: any,
        endCoordinates: any = [];
      canvas.addEventListener(
        'mousedown',
        function (e: any) {
          actualWidth = canvas?.getAttribute('width');
          actualHeight = canvas?.getAttribute('height');
          width = canvas?.offsetWidth;
          height = canvas?.offsetHeight;
          scaleX = parseInt(actualWidth) / width;
          scaleY = parseInt(actualHeight) / height;
          component.editBoxDiv.nativeElement.style.top = '0px';
          if (!component.isNewWindow) {
            if (
              !component?.activeAttribute?.className?.includes(
                component.docAttributeValueClass
              )
            ) {
              return;
            }
          }
          component.isMouseDown = true;
          startCoordinates = component.canvasMouseDown(canvas, e);
        },
        false
      );
      canvas.addEventListener(
        'mouseup',
        function (e: any) {
          for (let contextObj of component.contextArray) {
            contextObj.context.clearRect(0, 0, 0, 0);
            contextObj.context.drawImage(contextObj.img, 0, 0);
          }
          if (!component.isMouseDown) {
            return;
          }
          component.isMouseDown = false;
          if (startCoordinates.length && endCoordinates.length) {
            component.drawBoundaryBox(
              e,
              scaleX,
              scaleY,
              startCoordinates,
              endCoordinates,
              true
            );
          }
          startCoordinates = endCoordinates = [];
        },
        false
      );
      canvas.addEventListener(
        'mousemove',
        function (e: any) {
          if (!component.isNewWindow) {
            if (
              !component?.activeAttribute?.className?.includes(
                component.docAttributeValueClass
              )
            ) {
              return;
            }
          }
          if (!component.isMouseDown) {
            return;
          }
          component.currentImageIndex = index;
          endCoordinates = component.canvasMouseUp(canvas, e, startCoordinates);
          context.clearRect(0, 0, width, height);
          context.drawImage(img, 0, 0);
          component.editboxPageIndex = e.currentTarget.id.split('layer')[1];
          component.drawBoundaryBox(
            e,
            scaleX,
            scaleY,
            startCoordinates,
            endCoordinates
          );
        },
        false
      );
    };
  }
   /***
   @desc called on scroll of the document
   */ 
  onScroll(event: any) {
    if (!this.canScrollThumbnail) {
      return;
    }
    let eventReceived = event;
    var path =
      eventReceived.path ||
      (eventReceived.composedPath && eventReceived.composedPath());
    this.canScrollThumbnail = false;
    setTimeout(() => {
      this.canScrollThumbnail = true;
      let thumbnail = null;
      this.documentPreviewScrollHeight =
        document.getElementsByClassName('preview-wrapper')[0].scrollHeight;
      this.canvasHeight =
        this.documentPreviewScrollHeight / this.imageBlobUrl.length;

      if (path) {
        this.canvasHeight > 0
          ? (this.predictedCanvasIndex = Math.round(
              path[0].scrollTop / this.canvasHeight
            ))
          : '';
      }
      if (!this.canvasAutoScrollTo && this.documentPreviewScrollHeight !== 0) {
        thumbnail = <HTMLElement>(
          document.getElementById('thumb-image-' + this.predictedCanvasIndex)
        );
        if (thumbnail) {
          thumbnail.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'nearest',
          });
          // For scroll thershold purpose add + 1
          this.activeImg = this.predictedCanvasIndex + 1;
          this.scrollService.setActiveThambnail(this.activeImg);
        }
      }
    }, 500);
  }

  getCursorPosition(canvas: any, event: any) {
    const x = event.offsetX;
    const y = event.offsetY;
    return [x, y];
  }
   /***
   @desc get current index and scroll events
   */ 
  getIndex(index: any) {
    var pageid = 'layer' + index;
    this.scrollService.scrollToElementById(pageid, null, null);
  }
  /***
   @desc Showing Edit Input box in dynamic position logic Starts here
   */ 
  canvasMouseUp(canvas: any, event: any, startCoordinates: any) {
    this.top =
      this.currentImageIndex * canvas?.offsetHeight +
      // this.currentImageIndex * Math.round(window.screen.width * 0.0055) +
      this.currentImageIndex * 7.3 +
      event.offsetY +
      10 +
      'px';
    let startXposition = startCoordinates[0];
    let canvasWidth = canvas?.offsetWidth;

    let boundaryBoxStartingPostion = Math.round(
      (startXposition / canvasWidth) * 100
    );
    if (boundaryBoxStartingPostion < 5) {
      boundaryBoxStartingPostion = 5;
    } else if (boundaryBoxStartingPostion > 49) {
      boundaryBoxStartingPostion = 49;
    }
    this.left = boundaryBoxStartingPostion;
    return this.getCursorPosition(canvas, event);
  }
   /**
   * @desc Return starting position on canvas
   */
  canvasMouseDown(canvas: any, event: any) {
    this.isEditBox = false;
    this.editBoxDiv.nativeElement.style.display = 'none';
    this.editTextBoxText = '';
    return this.getCursorPosition(canvas, event);
  }
     /**
   * @desc Detecting that user is clicked on the document or drawn a line
   */
  drawBoundaryBox(
    event: any,
    scaleX: any,
    scaleY: any,
    startCoordinates: any,
    endCoordinates: any,
    extractText: boolean = false
  ) {
    if (endCoordinates?.toString() == startCoordinates?.toString()) {
      return;
    }
    let bounding = this.getBoundingBox(
      [startCoordinates[0] * scaleX, startCoordinates[1] * scaleY],
      [endCoordinates[0] * scaleX, endCoordinates[1] * scaleY]
    );

    this.scrollService.drawRectangle(
      event.target,
      bounding,
      null,
      false,
      extractText
    );
    if (extractText) {
      const httpRequestBody = {
        doc_id: this.document ? this.document._id : this.windowDocument._id,
        coordinates: bounding,
        page_no: parseInt(this.currentImageIndex) + 1,
      };
      this.getExtractedText(httpRequestBody);
    }
  }
    /**
   * @desc  Where this method is getting called in this file
   */
  getBoundingBox(startCoordinates: any, endCoordinates: any) {
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
  /**
   * @desc get extracted text from backend
   * **/
  getExtractedText(payload: any) {
    this.commonService.getBoundingBoxText(payload).subscribe((data: any) => {
      let results = data;
      if (results.extracted_text && results.extracted_text.length == 0) {
        this.toastService.add({
          type: 'warning',
          message: 'Could not extract value for the selected bounding box',
        });
        return;
      }
      let val = results.extracted_text.join(' ');
      this.editTextBoxText = val;

      this.isEditBox = true;
      this.editBoxDiv.nativeElement.style.top = this.top;
      this.editBoxDiv.nativeElement.style.left = this.left + '%';
      this.editBoxDiv.nativeElement.style.display = 'block';
      if (window.opener != null && !window.opener.closed) {
        var txtName =
          window.opener.document.getElementsByClassName('inputHighlight');
        if (txtName[0].value != '' || txtName[0].value != null) {
          this.oldEditText = txtName[0].value;
        } else {
          this.oldEditText = 'NA';
        }
        txtName[0].value = val;
      }
      if (
        this.document.updatedAttributes[this.activeAttributeIndex][
          'category_details'
        ][0].value != ''
      ) {
        this.oldEditText =
          this.document.originAttributes[this.activeAttributeIndex][
            'category_details'
          ][0].value;

        if (
          this.document.edited_document_type_id_a != null ||
          this.document.edited_document_type_id_qc != null
        ) {
          this.oldEditText = 'NA';
        }
      } else {
        this.oldEditText = 'NA';
      }
      this.document.updatedAttributes[this.activeAttributeIndex][
        'category_details'
      ][0].value = val;
      // Update Extracted text page No to original Array
      this.document.updatedAttributes[this.activeAttributeIndex][
        'category_details'
      ][0].page_no = payload.page_no;
      this.document.updatedAttributes[this.activeAttributeIndex][
        'category_details'
      ][0].location = data.coordinates;
      this.commonService.setCanvasExtractedDataValidation({
        "index": this.activeAttributeIndex,
        "value": val 
      });
    });
  }
 
  /**
   * @desc set extracted value to documents
   * **/
  editTextChange() {
    if (window.opener != null && !window.opener.closed) {
      var txtName =
        window.opener.document.getElementsByClassName('inputHighlight');
      txtName[0].value = this.editTextBoxText;
    }
    this.document.updatedAttributes[this.activeAttributeIndex][
      'category_details'
    ][0].value = this.editTextBoxText;    
  }

  editTextChangeValidation() {
    this.commonService.setCanvasExtractedDataValidation({
      "index": this.activeAttributeIndex,
      "value": '' 
    });
  }

  clearAllBoundBox() {
    for (let contextObj of this.contextArray) {
      contextObj.context.clearRect(0, 0, 0, 0);
      contextObj.context.drawImage(contextObj.img, 0, 0);
    }
  }
   /**
   * @desc  unsubscribe the subcribe method
   */
  ngOnDestroy(): void {
    this.subscriptionParentComponent.unsubscribe();
    this.commonService.documentImageObserval.next(null);
    this.ImageIndexSubscription.unsubscribe();
    this.imagesSubscription.unsubscribe();
    this.activeAttributeSubscription.unsubscribe();
    this.clearBoundingBoxSubscription.unsubscribe();
    this.subcriptionHideEditBoxSubject.unsubscribe();
    this.subcriptionchangeTextAtrribute.unsubscribe();
  }
}
