import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { AuthService } from 'src/app/core/auth.service';
import { SmeService } from '../sme.service';

@Component({
  selector: 'app-calibrate-documents-review',
  templateUrl: './calibrate-documents-review.component.html',
  styleUrls: ['./calibrate-documents-review.component.scss'],
})
export class CalibrateDocumentsReviewComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject();
  documentTypeName: string;
  trainingDocId: string;
  docType_id: string;
  reviewDataDocuments: any;
  loginUser: any;
  deleteDocumentName = '';
  documentIdToDelete = '';
  public dropdownSettings = {};
  dropdownList: any = [];
  statusFilter: any = [];
  arrStatus: any = [];
  public selectedItems: any = [];
  statusObject: any = {};
  public formGroup: FormGroup;
  public loadContent: boolean = false;
  public value = 'Pending';
  appliedFilter: any;
  constructor(
    private smeService: SmeService,
    private toastr: ToasterService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.smeService.metaDataTrainingDoc) {
      this.documentTypeName =
        this.smeService.metaDataTrainingDoc?.documentTypeName;
      this.trainingDocId = this.smeService.metaDataTrainingDoc?.trainingDocId;
      this.docType_id = this.smeService.metaDataTrainingDoc?.docType_id;
      this.getStatusFromBackend();
      this.getReviewDataList('?status=1&status=2');
    } else {
        this.router.navigate(['sme/calibrate-documents']);
        }
    this.loginUser = this.authService.getCurrentUserId();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      allowSearchFilter: true,
    };
    this.selectedItems = [
      { id: 1, value: 'Pending' },
      { id: 2, value: 'In progress' },
    ];
    this.formGroup = this.fb.group({
      value: [this.selectedItems],
    });
  }
  getStatusFromBackend() {
    this.dropdownList = this.smeService.listStatusesOfReviewDoc();
  }
  get f() {
    return this.formGroup.controls;
  }
  public onFilterChange(item: any) {}
  public onDropDownClose(item: any) {}
  public onItemSelect(item: any) {}
  public onDeSelect(item: any) {}
  public onSelectAll(items: any) {}
  public onDeSelectAll(items: any) {}

  public onClickFilter() {
    let filter = '?';
    if (!this.formGroup.value?.value?.length) {
      this.toastr.add({
        type: 'warning',
        message: 'Please select at-least one Status to filter',
      });
      return;
    }

    if (this.formGroup.value?.value?.length == 5) {
      this.getReviewDataList('');
    } else {
      this.formGroup.value?.value.forEach(
        (item: { id: any }, index: number) => {
          if (index == this.formGroup.value?.value.length - 1) {
            filter += `status=${item.id}`;
          } else {
            filter += `status=${item.id}&`;
          }
        }
      );
      this.getReviewDataList(filter);
    }
    this.appliedFilter = filter;
  }

  viewReviewDocData(doc: any) {
    if (this.loginUser == doc.assignee._id) {
      this.smeService.reviewDocumentId = doc._id;
      this.router.navigate(['sme/calibrate/review-data/document']);
    } else {
      this.toastr.add({
        type: 'error',
        message: 'Could not process the request',
      });
    }
  }

  assignAndViewReviewDocData(evt: any, doc: any) {
    const httpRequestBody = {
      review_document_id: doc._id,
    };
    this.smeService.assignReviewDataToUser(httpRequestBody).subscribe(
      (data: any) => {
        if (data) {
          this.smeService.reviewDocumentId = doc._id;
          this.router.navigate(['sme/calibrate/review-data/document']);
        }
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: 'Could not process the request',
        });
        doc.status = 'In progress';
      }
    );
  }

  onBack() {
    this.router.navigateByUrl('sme/calibrate');
  }

  onDeleteDocumentIconClick(doc: any) {
    this.deleteDocumentName = doc.document_type_id;
    this.documentIdToDelete = doc._id;
  }

  onDeleteButtonClick() {
    this.smeService.deleteReviewDocument(this.documentIdToDelete).subscribe(
      (dataResult: any) => {
        const deleteDocumentStatusResponse: any = dataResult;
        if (!deleteDocumentStatusResponse.error) {
          this.toastr.add({
            type: 'success',
            message: 'Document is deleted Successfully!',
          });
          this.getReviewDataList(this.appliedFilter);
        }
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: 'Could not delete document',
        });
        this.getReviewDataList(this.appliedFilter);
      }
    );
  }

  getReviewDataList(filter: any) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      scrollX: true,
      scrollCollapse: true,
      columnDefs: [
        {
          targets: [6], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
        { targets: [3,4], type: 'date' }

      ],
    };

    this.smeService.listReviewDataDocs(this.docType_id, filter).subscribe(
      (data: any) => {
        if (data) {
          var tempStatus = [];
          this.reviewDataDocuments = data;
        }
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }

  formatStatus(status: any) {
    if (status == 'Moved to Golden') {
      return 'Moved to GDS';
    } else if (status == 'Moved to Training') {
      return 'Moved to TDS';
    } else {
      return status;
    }
  }
}
