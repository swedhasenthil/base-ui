import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CanvasThumbnailsComponent } from '../../canvas-thumbnails/canvas-thumbnails.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { AuthService } from './../../../../core/auth.service';
import * as moment from 'moment';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Subscription, take } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-attribute-input-types',
  templateUrl: './attribute-input-types.component.html',
  styleUrls: ['./attribute-input-types.component.scss'],
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
export class AttributeInputTypesComponent implements OnInit {
  @Input() attributeDetails: any;
  @Input() attributeIndex: any;
  @Input() attributeClass: any;
  attributeCategoryDetails: any;

  // Current document
  document: any = [];
  originDocumentAttributes: any;
  updatedDocumentAttributes: any;
  orginalUpdatedDocumentAttributes: any;
  documentId: any;
  editedByAnalystOrQC: string = 'editedByAnalyst';
  editableIndex: any;
  // Input style relavent variables
  docAttributeValueClass = 'doc-attribute-value';
  // Input type related variables
  isInputDate: boolean = false;
  isInputAmount: boolean = false;
  isInputDropdownlists: boolean = false;
  isInputRadioLists: boolean = false;
  isInputTextarea: boolean = false;

  // Categories the attributes based on condition
  categoryClass: any = '';

  // To highlight Select input
  activeAttributeIndex: any;
  activeAttributeIndexSubscription: any;

  // To get Select input
  activeAttribute: any;
  activeAttributeSubscription: any;

  dataLocation: string;
  dataPage: string;
  boundingBox: any;
  pageIndex: any;

  BOUNDARY_BOX_ORIGIN_VAL_STROKE_COLOR = '#ff03037a'; // Red
  BOUNDARY_BOX_ORIGIN_VAL_FILL_COLOR = '#ff03037a'; // Red
  // For canvas Image load
  imageResponse: any;

  // Canvas Default controlls
  ZOOM_IN_BY: number = 1.2; // Existing + 20%
  ZOOM_OUT_BY: number = 1 / 1.2; // Reverse previoulastClickedElements zoom in
  DEFAULT_IMG_WIDTH: number = 34;

  images: any = [];
  imagesRevisedWidth: any = {};
  imagesRevisedDegree: any = {};
  documentPreviewScrollHeight: any;
  canvasHeight: any = 0;
  /* Subscriptions starts here */
  imagesSubscription1: Subscription;
  ImageIndexSubscription = new Subscription();
  /* Subscriptions ends here */

  currentImage: any;
  currentImageIndex: any = 0;
  activeImg: any;
  data: any;
  highlight: any;
  attributeValue: any;
  editIconLabel: any;
  disableButton: boolean;
  hasError: any;
  highConfidence: any;
  lowConfidence: any; // originData: any;
  attributeEditValue: any;
  documentSubscription: Subscription;
  editSubscription: Subscription;
  editableIndexSubscription: Subscription;
  canvasExtractedDataValidationSubscription: Subscription;
  datepipe: any;
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private toastr: ToasterService,
    public scrollService: ScrollService // public canvas : CanvasDocumentComponent
  ) {}

  ngOnInit(): void {
    this.commonService.setEditLabel(false);
    this.activeAttributeIndexSubscription =
      this.commonService.activeAttributeIndex.subscribe((index) => {
        this.activeAttributeIndex = index;
      });
    this.canvasExtractedDataValidationSubscription =
      this.commonService.canvasExtractedDataValidation.subscribe((data) => {
        if(this.attributeIndex==data.index){
          this.validateInputField(data.index, data.value);
          this.validateDocument(this.documentId, this.updatedDocumentAttributes);  
        }
             
      });

    this.documentSubscription = this.commonService.document.subscribe((res) => {
      this.document = res;
      if (this.document !== null && this.document !== undefined) {
        this.originDocumentAttributes = this.document.originAttributes;
        this.updatedDocumentAttributes = this.document.updatedAttributes;
        this.documentId = this.document._id;
      }
    }); // Get origin and updated attributes from document object
    // This properties prepared in list-document.component.ts file

    this.editSubscription = this.commonService.editLabel.subscribe((res) => {
      this.editIconLabel = res;
      if (res === false) {
        this.commonService.setSaveButton(true);
      } else {
        this.commonService.setSaveButton(false);
      }
    });
    this.editableIndexSubscription = this.commonService.EditableIndex.subscribe(
      (data: any) => {
        this.editableIndex = data;
      }
    );

    if (
      this.attributeDetails != null &&
      this.attributeDetails != undefined &&
      this.attributeDetails != ''
    ) {
      this.attributeCategoryDetails = this.attributeDetails.category_details[0];
      var newstr = this.attributeDetails.category.toLowerCase();

      var dateVlaue = newstr.split(' ').find((word: string) => word === 'date');
      switch (dateVlaue) {
        case 'date':
          this.attributeCategoryDetails['isDate'] = 'true';
          var timestamp = Date.parse(this.attributeCategoryDetails.value);
          if (isNaN(timestamp) == false) {
            try {
              this.attributeCategoryDetails.value = this.datepipe.transform(
                this.attributeCategoryDetails.value,
                'dd-MMM-yyyy'
              );
            } catch (error) {}
          }
      }
      this.inputTypeChecker();
      this.categoryAttribute();
      // there is no attributes we wirte submit button is disable
      // Setup default 1 for reset Active Thambnail
      this.scrollService.setActiveThambnail(1);
    }
  }
  /**
   * @desc checkin the input type value
   */
  inputTypeChecker() {
    if (this.attributeCategoryDetails.isDate) {
      this.isInputDate = true;
    } else if (this.attributeCategoryDetails.isAmount) {
      this.isInputAmount = true;
    } else if (this.attributeCategoryDetails.dropdownlists) {
      this.isInputDropdownlists = true;
    } else if (this.attributeCategoryDetails.radioLists) {
      this.isInputRadioLists = true;
    } else {
      this.isInputTextarea = true;
    }
  }
  /**
   * @desc on click of no, i want to manually fill the data button
   */
  
  documentTypeValueUnchanged() {}
   /**
   * @desc Attribute input relavent functions start here
   */
  getStyle(index: any) {
    if (index === this.attributeIndex) {
      return 'grey';
    } else {
      return '';
    }
  }
  highlightRow(index: any) {
    if (index != this.editableIndex) {
      this.editableIndex = -1;
      // this.commonService.setEditableIndex("-1")
    }
    if (index === this.attributeIndex) {
      this.commonService.setActiveAttributeIndex(index);
    }
  }
 /**
   * @desc Showing edit input box from top calculation starts here
   */ 
   animate(index: any, pageNo: any, category: any) {
    if (!pageNo) {
      this.commonService.clearBoundIngBox('hide');
      return;
    }
    this.commonService.clearBoundIngBox();
    if (index != this.editableIndex) {
      this.editableIndex = -1;
    }
    let animateDetails = {
      data: category,
      pageNo: pageNo,
      index: index,
    };
    localStorage.setItem('animate', JSON.stringify(animateDetails));
    this.activeAttributeIndex = index;
    this.dataLocation = '';
    this.dataPage = '';
    var pageid = '0';
    if (pageNo > 0) {
      pageid = 'layer' + (pageNo - 1);
      this.activeImg = pageNo - 1;
      this.dataLocation =
        this.updatedDocumentAttributes[
          index
        ].category_details[0].location.toString();
      this.dataPage =
        this.updatedDocumentAttributes[index].category_details[0].page_no;
    }
    this.boundingBox = this.dataLocation;
    this.pageIndex = this.dataPage;
    if (this.boundingBox == '0,0,0,0,0,0,0,0' || this.boundingBox == '') {
      return;
    }
    let canvas = document.querySelectorAll('canvas')[this.pageIndex - 1];
    let boundaryBoxStartLocationX = this.dataLocation
      ? parseInt(this.dataLocation.split(',')[0])
      : 0;
    let boundaryBoxEndLocationX = this.dataLocation
      ? parseInt(this.dataLocation.split(',')[6])
      : 0;
    let boundaryBoxEndLocationY = this.dataLocation
      ? parseInt(this.dataLocation.split(',')[7])
      : 0;

    let calculatedIndex =
      boundaryBoxEndLocationX + boundaryBoxEndLocationY * canvas?.offsetHeight;
    let calculatedHeightInPixels = calculatedIndex / canvas?.height;
    var editBoxY =
      (pageNo - 1) * canvas?.offsetHeight +
      // (pageNo - 1) * Math.round(window.screen.width * 0.0055) +
      (pageNo - 1) * 7.3 +
      calculatedHeightInPixels +
      10 +
      'px';
    // Showing edit input box from top calculation ends here

    // From left calculation starts here
    let canvasWidth = canvas?.width;

    let boundaryBoxStartingPostion = Math.round(
      (boundaryBoxStartLocationX / canvasWidth) * 100
    );
    if (boundaryBoxStartingPostion < 5) {
      boundaryBoxStartingPostion = 5;
    } else if (boundaryBoxStartingPostion > 49) {
      boundaryBoxStartingPostion = 49;
    }
    this.commonService.hideEditBox(true, editBoxY, boundaryBoxStartingPostion);
    let { verticalScroll, horizontalScroll } =
      this.scrollService.getScrollValues(this.dataLocation, canvas);
    this.scrollService.setActiveThambnail(pageNo);
    this.scrollService.setCurrentPage(pageNo - 1);
    this.scrollService.scrollToElementById(
      pageid,
      verticalScroll,
      horizontalScroll
    );
    this.scrollService.drawRectangle(
      canvas,
      this.dataLocation.split(','),
      null,
      false,
      true
    );
    // If we have old value in originData, show in boundary box with red color
    let currentField = this.updatedDocumentAttributes[index];
    if (currentField.editedByAnalyst) {
      let extractedDataPageNo =
        this.originDocumentAttributes[index].category_details[0].page_no;
      let extractedDataLocation =
        this.originDocumentAttributes[index].category_details[0].location;
      this.scrollService.drawRectangle(
        document.querySelectorAll('canvas')[extractedDataPageNo - 1],
        extractedDataLocation.map((n: any) => parseInt(n, 10)),
        this.BOUNDARY_BOX_ORIGIN_VAL_FILL_COLOR,
        this.BOUNDARY_BOX_ORIGIN_VAL_STROKE_COLOR,
        true
      );
    }
    return;
  }
  validateDocument(documentId: any, updatedDocumentAttributes: any) {
    let payload = { ...this.document };
    payload.details = updatedDocumentAttributes;
    payload.document_id = documentId;
    this.commonService.validDocument(payload).subscribe(
      (data: any) => {
        this.updatedDocumentAttributes.forEach((attribute: any, index: any) => {
          if (attribute) {
            attribute.has_error = data[index].has_error;
          }
        });
        this.categoryAttribute();
        this.commonService.enableSubmitButton(this.updatedDocumentAttributes);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }

  validateInputTypeDate(index: any, event: any, attribute: any) {
    const formattedDate = moment(event).format('DD-MMM-YYYY');
    attribute.category_details[0].value = formattedDate;
    if (
      attribute.category_details[0].value ===
      this.originDocumentAttributes[index].category_details[0].value
    ) {
      this.document.updatedAttributes[index]['editedByAnalyst'] = false;
      this.document.updatedAttributes[index]['edited'] = false;
    } else {
      this.document.updatedAttributes[index]['editedByAnalyst'] = false;
      this.document.updatedAttributes[this.activeAttributeIndex][
        'category_details'
      ][0].value = event.target.value;
    }
    this.attributeCategoryDetails = this.attributeDetails.category_details[0];
  }
  updateAttributeValue(
    index: number,
    attribute: any,
    event: any,
    attributeType: string
  ) {
    switch (attributeType) {
      case 'date': {
        const formattedDate = moment(event).format('DD-MMM-YYYY');
        attribute.category_details[0].value = formattedDate;
        this.validateInputField(index, formattedDate);
        this.commonService.seteditTextValue(
          this.attributeCategoryDetails.value
        );
        break;
      }
      case 'Amount': {
        this.editableIndex = -1;
        this.validateInputField(index, event.target.value);
        break;
      }
      case 'Textarea': {
        this.editableIndex = -1;
        this.validateInputField(index, event.target.value);
        break;
      }
      case 'Radio': {
        // To Hide Old Input edit box
        this.commonService.hideEditBox(false);
        this.editableIndex = -1;
        this.validateInputField(index, event.target.value);
        break;
      }
      case 'Dropdown': {
        // To Hide Old Input edit box
        this.commonService.hideEditBox(false);
        break;
      }
      case 'updateDropdown': {
        break;
      }
    }
    if(attribute.category.indexOf('ChatGPT')<0)
    this.validateDocument(this.documentId, this.updatedDocumentAttributes);
  }
  validateInputField(index: any, event: any) {
    if (
      event === this.originDocumentAttributes[index]?.category_details[0]?.value
    ) {
      this.updatedDocumentAttributes[index]['editedByAnalyst'] = false;
      this.updatedDocumentAttributes[index]['edited'] = false;
      this.commonService.setEditLabel(false);
    } else {
      this.updatedDocumentAttributes[index]['editedByAnalyst'] = true;
      this.commonService.setEditLabel(true);
      this.commonService.setSaveButton(false);
    }
  }
    /**
   * @desc  Only ASCII charactar in that range allowed
   */
  onlyNumberKey(event: any) {
    var ASCIICode = event.which ? event.which : event.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
    return true;
  }
   /**
   * @desc Attribute input relavent functions end here
   */
  categoryAttribute() {
    this.categoryClass = '';
    this.hasError = '';
    this.lowConfidence = '';
    this.highConfidence = '';
    if (this.attributeDetails.has_error == true) {
      this.categoryClass += ' input-has-error';
      this.hasError = ' error-cnf';
    } else if (this.attributeCategoryDetails.isColor === 'true') {
      this.categoryClass = ' input-high-confidence';
      this.highConfidence = ' skn-attr-high-cnf';
    } else if (this.attributeCategoryDetails.isColor === 'false') {
      this.categoryClass = ' input-low-confidence';
      this.lowConfidence = ' skn-attr-low-cnf';
    }

    if (this.attributeDetails.mandatory == true) {
      this.categoryClass += 'input-mandatory';
    }
  }
    /**
   * @desc  Edit text attribute value
   */
  editTextAttributeChange() {
    if (window.opener != null && !window.opener.closed) {
      var txtName =
        window.opener.document.getElementsByClassName('inputAtrributes');
      txtName[0].value = this.attributeEditValue;
    } else {
      this.document.updatedAttributes[this.activeAttributeIndex][
        'category_details'
      ].value = this.attributeCategoryDetails.value;
      this.commonService.seteditTextValue(this.attributeCategoryDetails.value);
    }
  }
    /**
   * @desc  get response from ChatGPT API for cetgory names containing ChatGPT
   */
    getChatGPTResponse() {

    let payload = { text: this.attributeDetails.category_details[0]?.value };

    this.commonService.getChatGPTResponse(payload).subscribe(
      (data: any) => {
        this.attributeDetails.category_details[0].value =data.text.replaceAll("\n", "");
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }
   /**
   * @desc  unsubscribe the subcribe method
   */
  ngOnDestroy(): void {
    this.ImageIndexSubscription.unsubscribe();
    this.documentSubscription.unsubscribe();
    this.editSubscription.unsubscribe();
    this.editableIndexSubscription.unsubscribe();
  }
}
