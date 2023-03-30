import { Component, OnInit, QueryList } from '@angular/core';
import { elementAt, Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { SmeService } from '../sme.service';
import { ToasterService } from '../../../core/toaster/toaster.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-reference-data-management',
  templateUrl: './reference-data-management.component.html',
  styleUrls: ['./reference-data-management.component.scss'],
})
export class ReferenceDataManagementComponent implements OnInit {
  refrenceDataList: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dataList: boolean;
  duplicateDocumentName: string;
  duplicateAttributes: any;
  attributesArray: any = [
    {
      key: '',
      value: '',
    },
  ];
  addDocumentForm: FormGroup<any>;
  editDocumentForm: FormGroup;
  clickedEditedDocumentId: any;
  clickedAttributesData: any = [
    {
      key: '',
      value: '',
    },
  ];
  deleteDocumentName: any;
  documentIdToDelete: any;

  constructor(
    public authService: AuthService,
    public smeService: SmeService,
    private fb: FormBuilder,
    public toastr: ToasterService,
    private sharedService:SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.smeMenuChanges();
    this.getReferenceData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      retrieve: true,
      scrollX: true,
      scrollCollapse: true,
      columnDefs: [
        {
          targets: [5], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
        {
          targets:[1],type:'date'
        }
      ],
    };
    this.addDocumentForm = new FormGroup({
      document_type: new FormControl('', [Validators.required]),
    });

    this.editDocumentForm = this.fb.group({
      editDocumentName: [null, [Validators.required]],
    });
  }
  // list out reference data
  getReferenceData() {
    this.smeService.getReferenceData().subscribe(
      (data) => {
        const result: any = data;
        this.refrenceDataList = result;
 
        this.dataList = true;
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: 'Error',
        });
      }
    );
  }
 
  // duplicate document on icon click

  duplicateDocumentClick(document: any) {
 
    this.duplicateDocumentName = document.reference_data_name + ' - copy';
    this.duplicateAttributes = document.values;
  }

  //  duplicate document button on click

  duplicateDocumentSubmit() {
    const duplicateValues = {
      reference_data_name: this.duplicateDocumentName,
      values: this.duplicateAttributes,
    };
    this.smeService.addReferenceData(duplicateValues).subscribe(
      (data: any) => {
        const addDuplicateDocumentResponse: any = data;
        if (addDuplicateDocumentResponse.error) {
          this.toastr.add({
            type: 'error',
            message: 'Custom Data cannot be created',
          });
        } else {
          window.location.reload();
          this.toastr.add({
            type: 'success',
            message: 'Custom Data Created Succesfully!',
          });
        }
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
        this.getReferenceData();
      }
    );
  }
  //on click of +(plus) icon
  addAttributeRow() {
    this.attributesArray.push({
      key: '',
      value: '',
    });
  }

  // on click add new reference data
  onAddDocumentSubmit() {
    const addNewDocument = {
      reference_data_name: this.addDocumentForm.get('document_type')?.value,
      values: this.attributesArray,
    };
 
    this.smeService.addReferenceData(addNewDocument).subscribe(
      (data) => {
        const addDocumentResponse: any = data;
        if (addDocumentResponse.error) {
          this.toastr.add({
            type: 'error',
            message: 'Custom Data cannot be created',
          });
        } else {
          this.toastr.add({
            type: 'success',
            message: 'Custom Data Created Succesfully!',
          });
        }
        window.location.reload();
        this.getReferenceData();
        this.addDocumentForm.reset();
        this.resetDocument();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
        this.getReferenceData();
        this.addDocumentForm.reset();
        this.resetDocument();
      }
    );
  }

  //on click of edit icon on document list
  onEditDocument(doc: any) {
    const getClickedDocumentResponse: any = doc;
    this.clickedEditedDocumentId = doc._id;
    this.clickedAttributesData = getClickedDocumentResponse.values;
    this.editDocumentForm.patchValue({
      editDocumentName: getClickedDocumentResponse.reference_data_name,
    });
  }
  //on click of +(plus) icon in edit document form
  addAttributeRowOfEdit() {
    this.clickedAttributesData.push({
      key: '',
      value: '',
    });
  }
  removeAttributeRow(i: any) {
    this.attributesArray.splice(i, 1);
  }

  editRemoveAttributeRow(i: any) {
    this.clickedAttributesData.splice(i, 1);
  }
  resetRowOfEdit() {
 
    this.editDocumentForm.reset();
    this.clickedAttributesData = [];
    this.clickedAttributesData.push({
      key: '',
      value: '',
    });
  }
  //on click of submit in edit document form
  onClickEditDocument() {
    let hasError = false;
    if (hasError) {
      this.toastr.add({
        type: 'error',
        message: 'Custom Data name cannot be empty',
      });
      return;
    }
 
    
    const request = {
      reference_data_id: this.clickedEditedDocumentId,
      reference_data_name: this.editDocumentForm.get('editDocumentName')?.value,
      values: this.clickedAttributesData.filter( (element : any) => {
        return element.key != '' && element.value != ''
      }),
    };
    this.clickedAttributesData = request.values;

    this.smeService.updateRefrenceData(request).subscribe(
      (dataResult) => {
        const updateDocumentStatusResponse: any = dataResult;
        if (!updateDocumentStatusResponse.error) {
          this.toastr.add({
            type: 'success',
            message: 'Custom Data Updated Succesfully!',
          });
          window.location.reload();
          this.ngOnInit();
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: 'Custom Data cannot be created',
        });
        this.ngOnInit();
      }
    );
 
  }

  //on click of delete icon in document list
  onDeleteDocument(doc: any) {
    this.deleteDocumentName = doc.reference_data_name;
    this.documentIdToDelete = doc._id;
  }

  //on click of delete button of document
  deleteDocument() {
    this.smeService
      .deleteReferenceData({ reference_data_id: this.documentIdToDelete })
      .subscribe(
        (dataResult) => {
          const deleteDocumentStatusResponse: any = dataResult;
          if (!deleteDocumentStatusResponse.error) {
            this.toastr.add({
              type: 'success',
              message: 'Custom Data Deleted Succesfully!',
            });
            window.location.reload();
            this.ngOnInit();
          }
        },
        (err) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          this.toastr.add({
            type: 'error',
            message: 'Document cannot delete',
          });
          this.ngOnInit();
        }
      );
  }

  //on change the status of document
  onChangeDocumentStatus(ev: any, doc: any) {
    let request: any = {};
    if (ev.checked) {
      request['isActive'] = true;
    } else {
      request['isActive'] = false;
    }
    request['reference_data_id'] = doc._id;
 

    this.smeService.updateRefrenceData(request).subscribe(
      (dataResult) => {
        const updateDocumentStatusResponse: any = dataResult;
 
        if (!updateDocumentStatusResponse.error) {
          this.toastr.add({
            type: 'success',
            message: 'Status changed Succesfully!',
          });
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: 'Custom Data Status cannot be created',
        });
      }
    );
  }
  resetDocument() {
    this.attributesArray = [];
    this.addDocumentForm.reset();
    this.attributesArray.push({
      key: '',
      value: '',
    });
  }
}
