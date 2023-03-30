import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from './../../../../core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-document-buttons',
  templateUrl: './review-document-buttons.component.html',
  styleUrls: ['./review-document-buttons.component.scss'],
})
export class ReviewDocumentButtonsComponent implements OnInit {
  calledBy: any;
  saveBtn: any = true;
  rejectionReasonsArray: any[];
  rejectReasonValue: any;
  time = new Date();
  reviewTime: number;
  document: any;
  showDocumentTypeDropdown: boolean;
  documentTypeDataObjectArray: never[];
  manualUpdate: any = false;
  autoUpdate: any;
  project: any;
  submitButton: any = false;
  // save document payload

  saveDocument: any;
  taskAssignment: any;
  TimerValue: any;
  savedDocument: boolean;

  subscriptionParentComponent: Subscription;
  documentSubscription: Subscription;
  manualUpdateSubscription: Subscription;
  reviewTimeSubscription: Subscription;
  submitButtonSubscription: Subscription;
  saveButtonSubscription: Subscription;
  constructor(
    private commonService: CommonService,
    public sharedService: SharedService,
    private authService: AuthService,
    public toastService: ToasterService,
    public router: Router
  ) {
    this.commonService.setSaveButton(true);
  }

  ngOnInit(): void {
    this.subscriptionParentComponent =
      this.commonService.parentComponent.subscribe((flag) => {
        this.calledBy = flag;
      });
    // this.document = this.commonService.getReviewDocument;
    this.subscriptionParentComponent =
    this.commonService.parentComponent.subscribe((flag) => {
      this.calledBy = flag;
    });
    this.documentSubscription = this.commonService.document.subscribe((res) => {
      this.document =  res;
      if(this.document != null || this.document != undefined)  {
      // this.submit_for_review = this.document.submit_for_review
      }
      
    });
    this.manualUpdateSubscription = this.commonService.manualUpdate.subscribe(
      (value: any) => {
        this.manualUpdate = value;
      }
    );
    this.project = this.sharedService.currentProject;
    this.taskAssignment = this.project._value.taskAssignment;

    this.reviewTimeSubscription = this.sharedService.getReviewTime.subscribe(
      (data) => {
        this.TimerValue = data;
      }
    );
    this.submitButtonSubscription = this.commonService.submitButtons.subscribe(
      (data) => {
        this.submitButton = data;
      }
    );
    this.saveButtonSubscription = this.commonService.saveButtons.subscribe(
      (data) => {
        this.savedDocument = data;
      }
    );
  }
     /**
   * @desc dropdown list save  and reject
   */
  saveAndReject(name: any) {
    this.commonService.hideEditBox();
    if (name === 'save') {
      this.saveBtn = true;
    } else name === 'reject';
    {
      this.saveBtn = false;
    }
  }
    /**
   * @desc getting data for api to reason list
   */
  getReasonsList() {
    this.commonService.getReasonList().subscribe({
     next: (data: any) => {
        const rejectDocumentReasonsResponse: any = data;
        this.rejectionReasonsArray = new Array(
          ...rejectDocumentReasonsResponse
        );
      },
     error:   (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    }
    );
  }
  /**
   * @desc on change of the reason to reject a document
   */

  onRejectReasonSelect(inputValue: any) {
    this.commonService.hideEditBox();
    this.rejectReasonValue = inputValue;
  }
  /**
   * @desc reject the document 
   */

  rejectDocumentModalSubmit() {
    if (this.rejectReasonValue == undefined || null) {
      this.toastService.add({
        type: 'warning',
        message: 'Please select a resaon',
      });
    } else {
      this.reviewTime = this.TimerValue;
      const httpRequestBody = {
        id: this.document._id,
        role_id: localStorage.getItem('currentUserRoleId'),
        review_time: this.reviewTime,
        submit_for_review: this.document.submit_for_review,
        reason_for_rejection: this.rejectReasonValue,
      };
      this.commonService
        .rejectDocument(httpRequestBody)
        .subscribe((data: any) => {
          // this.enableGetTaskButton();
          this.showDocumentTypeDropdown = false;
          this.rejectReasonValue = '';
          this.documentTypeDataObjectArray = [];
          this.toastService.add({
            type: 'success',
            message: data.message,
          });
          this.router.navigate([`/${this.calledBy}/my-work`]);
        });
    }
  }
/**
   * @desc  save Document Click
   */
 
  docmentTypeId: any;
  onSaveDocumentClick() {

    this.docmentTypeId = this.document.document_type_id;
    if (this.document.edited_document_type_id_a != null) {
      this.docmentTypeId = this.document.edited_document_type_id_a;
    }
    if (this.document.edited_document_type_id_qc != null) {
      this.docmentTypeId = this.document.edited_document_type_id_qc;
    }

    this.reviewTime = this.TimerValue;
    const payload = {
      id: this.document._id,
      role_id: localStorage.getItem('currentUserRoleId'),
      edited_document_type_id: this.manualUpdate ? this.docmentTypeId : null,
      review_time: this.reviewTime,
      submit_for_review: this.document.submit_for_review,
      edited_details: this.document.updatedAttributes,
    };

    this.commonService.saveDocument(payload).subscribe(
      (data: any) => {
        const saveDocumentResponse: any = data;
        this.toastService.add({
          type: 'success',
          message: saveDocumentResponse.message,
        });
        this.savedDocument = true;
        this.commonService.setSaveButton(true);

        // this.closeModal();
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.savedDocument = false;
        this.commonService.setSaveButton(false);
      }
    );
  }
/**
   * @desc  submit task and document
 If newTask is true assign new document here itself.
If newTask true, but there's no task to assign redirect to analyst screen
   */
 
  submitAndGetTask(newTask: boolean = false) {
    this.reviewTime = this.TimerValue;

    this.document.updatedAttributes.forEach((attribute: any) => {
      attribute.has_error = false;
    });

    // Create Payload
    const payload = {
      id: this.document._id,
      role_id: localStorage.getItem('currentUserRoleId'),
      edited_document_type_id: this.manualUpdate
        ? this.document.document_type_id
        : null,
      review_time: this.reviewTime,
      submit_for_review: false,
      edited_details: this.document.updatedAttributes,
    };

    this.commonService.submitTaskAndDocument(payload).subscribe(
      (response: any) => {
        this.toastService.add({
          type: 'success',
          message: response.message,
        });
        this.router.navigate([`/${this.calledBy}/my-work`]);
        // Check newTask flag
        if (newTask) {
          this.commonService.onAutoAssignTask();
        }
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: err.error.message,
        });
      }
    );
  }

  navigate() {
    if (this.router.url == '/analyst/review-document') {
      this.router.navigate(['/analyst/my-work']);
    } else {
      this.router.navigate(['/qc/my-work']);
    }
  }

  submit() {
    this.commonService.hideEditBox();
  }
/**
   * @desc  unsubscribe the subcribe method
   */
  ngOnDestroy(): void {
    this.subscriptionParentComponent.unsubscribe();
    this.documentSubscription.unsubscribe();
    this.reviewTimeSubscription.unsubscribe();
    this.manualUpdateSubscription.unsubscribe();
    this.submitButtonSubscription.unsubscribe();
    this.saveButtonSubscription.unsubscribe();
  }
}
