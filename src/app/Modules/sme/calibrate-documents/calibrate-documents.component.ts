import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-calibrate-documents',
  templateUrl: './calibrate-documents.component.html',
  styleUrls: ['./calibrate-documents.component.scss'],
})
export class CalibrateDocumentsComponent implements OnInit {
  // @ViewChildren(DataTableDirective)
  @ViewChild('cancelAddDocModel') cancelAddDocModel: ElementRef;
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  //  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  calibrateDocumentsList: any = [];
  modelApiData: any = [];
  modelApiAttributeList: any = [];
  refrenceDataList: any = [];
  duplicateDocumentName: string;
  header: string = '';
  addDocumentForm: any = {
    id: null,
    documentName: '',
    modelApi: '',
    attributesArray: [
      {
        attribute_name: '',
        model_attribute_name: '',
        data_type: '',
        reference_data_id: null,
      },
    ],
  };
  datatypesarray: any = [
    'Text',
    'Alphanumeric',
    'Date',
    'Alpha',
    'Boolean',
    'Numeric',
    'Amount',
    'Reference Data',
  ];
  @ViewChild('closeDuplicateModel') closeDuplicateModel: ElementRef;
  @ViewChild('deleteDocumentbtn') deleteDocumentbtn: ElementRef;
  @ViewChild('openAddDocumentModel') openAddDocumentModel: ElementRef;
  attributesArray: any;
  selectedModelApis: any;
  calibrateDocuments: boolean;
  updateButton: boolean = false;
  submitButton: boolean;
  isValid: boolean;

  constructor(
    public smeService: SmeService,
    public toastr: ToasterService,
    private router: Router,
    private sharedService:SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.smeMenuChanges();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      retrieve: true,
      scrollX: true, scrollCollapse: true,
      columnDefs: [
        {
          targets: [8], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
        { targets: [1], type: 'date' }

      ],
    };
    this.loadDocuments();
    this.isValid=true;
  }
 /***
   * @desc list out calibrate document
   */
  loadDocuments() {
    this.smeService.getCalibrateDocumentsList().subscribe(
      (res: any) => {
        this.calibrateDocumentsList = res;

        this.calibrateDocuments = true;
        this.dtTrigger.next(null);

      },
      (error) => {
        this.toastr.add({
          type: 'error',
          message: error.error.message,
        });
      }
    );
  }
/***
   * @desc list out the training Document data
   */
  onUploadTrainingDocData(file: any, doc: any) {
    if (file.files.length === 0) {
      this.toastr.add({
        type: 'warning',
        message: 'Could not find file to upload',
      });
      return;
    }
    var formData = new FormData();
    formData.append('file', file.files[0]);
    formData.append('document_type_id', doc._id);
    this.smeService.addTrainingDocumentData(formData).subscribe(
      (data: any) => {
        if (data['message']) {
          this.toastr.add({
            type: 'error',
            message: data['message'],
          });
        } else {
          doc.training_data_docs_count += 1;
          this.toastr.add({
            type: 'success',
            message: 'Document is uploaded successfully',
          });
        }
      },
      (err: any) => {
        this.toastr.add({
          type: 'error',
          message: 'Could not upload the document',
        });
      }
    );
  }
  /***
   * @desc list out the Golden Document data
   */
  onUploadGoldenDataDoc(file: any, doc: any) {
    if (file.files.length === 0) {
      this.toastr.add({
        type: 'warning',
        message: 'Could not find file to upload',
      });
      return;
    }
    var formData = new FormData();
    formData.append('file', file.files[0]);
    formData.append('document_type_id', doc._id);
    this.smeService.addGoldenDocumentData(formData).subscribe(
      (data: any) => {
        if (data['message']) {
          this.toastr.add({
            type: 'error',
            message: data['message'],
          });
        } else {
          doc.golden_data_docs_count += 1;
          this.toastr.add({
            type: 'success',
            message: 'Document is uploaded successfully',
          });
        }
      },
      (err: any) => {
        this.toastr.add({
          type: 'error',
          message: 'Could not upload the document',
        });
      }
    );
  }
 /***
   * @desc verify the duplicate Document list
   */
  duplicateModelApi: any;
  duplicateAttributes: any;
  duplicateDocument(document: any) {
    this.duplicateDocumentName = document.document_type + '_copy';
    this.duplicateModelApi = document.versioned_model_api;
    this.duplicateAttributes = document.attributes;
  }
 /***
   * @desc change document status active or inactive
   */
  onChangeDocumentStatus(ev: any, doc: any) {
    let request: any = {};
    if (ev.checked) {
      request['isActive'] = true;
    } else {
      request['isActive'] = false;
    }
    request['document_type_id'] = doc._id;
    this.smeService.updateDocumentStatus(request).subscribe(
      (dataResult: any) => {
        const updateDocumentStatusResponse: any = dataResult;
        if (!updateDocumentStatusResponse.error) {
          window.location.reload();
          this.toastr.add({
            type: 'success',
            message: 'Document Status Succesfully!',
          });
        }
      },
      (err: any) => {
        this.toastr.add({
          type: 'error',
          message: 'Document Status cannot update',
        });
      }
    );
  }

  /***
   * @desc on click of create document button of duplicate document modal
   */
  createDuplicateDocument() {
    if (this.duplicateDocumentName == '') {
      this.toastr.add({
        type: 'warning',
        message: 'Enter document Name',
      });
      return;
    }

    const httpRequestBody = {
      document_type: this.duplicateDocumentName,
      versioned_model_api: this.duplicateModelApi,
      attributes: this.duplicateAttributes,
    };
    this.smeService.addDocument(httpRequestBody).subscribe(
      (data: any) => {
        const addDuplicateDocumentResponse: any = data;
        if (addDuplicateDocumentResponse.error) {
          this.toastr.add({
            type: 'error',
            message: 'Document cannot be created',
          });
        } else {
          window.location.reload();
          this.toastr.add({
            type: 'success',
            message: 'Document Created Succesfully!',
          });
        }
      },
      (err: any) => {
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
      }
    );
  }
  documentIdToDelete: any;
  deleteDocumentName: string;
  deleteDocument(document: any) {
    this.deleteDocumentName = document.document_type;
    this.documentIdToDelete = document._id;
    this.smeService.setDocumentFrom(document,this.updateButton);
  }


  loadModelApi() {
    this.smeService.getListOfModelApi().subscribe(
      (res) => {
        this.modelApiData = res;
        this.selectedModelApis = this.modelApiData[0].modelApi.name;
      },
      (error) => {
        this.toastr.add({
          type: 'error',
          message: error.error.message,
        });
      }
    );
  }

  modelApidropdownChange(selectedmodelApi: any) {
 
    this.setModalAtribute(selectedmodelApi);
  }


  //get reference data list
  getReferenceData() {
    this.smeService.getReferenceData().subscribe((data) => {
      const result: any = data;
      this.refrenceDataList = result;
    });
  }


  addNewAtribute() {
    this.addDocumentForm['attributesArray'].push({
      attribute_name: '',
      model_attribute_name: '',
      data_type: '',
      reference_data_id: null,
    });
  }
  removeAttributeRow(i: number) {
    this.addDocumentForm['attributesArray'].splice(i, 1);
  }

  btnAddDocument() {
    this.header = 'Add New Document Type';
    this.updateButton = false;
    this.submitButton = true;
    if (!this.isEdit) {
      this.addDocumentForm = {
        documentName: '',
        modelApi: '',
        attributesArray: [
          {
            attribute_name: '',
            model_attribute_name: '',
            data_type: '',
            reference_data_id: null,
          },
        ],
      };
    }
    this.smeService.setDocumentFrom(this.addDocumentForm,this.updateButton);
  }

  setModalAtribute(selectedmodelApi: any) {
    let selectedModel = this.modelApiData.filter((item: any) => {
      if (item._id == selectedmodelApi) {
        return item;
      }
    });
    if (selectedModel.length > 0) {
      this.modelApiAttributeList = selectedModel[0]['attributes'];
    }
  }
 /***
   * @desc click edit icon and we create particular document form array list
   */
  isEdit: boolean = false;
  btnEdit(document: any) {
    this.isEdit = true;
    this.updateButton = true;
    if (document?.versioned_model_api?._id) {
      this.setModalAtribute(document.versioned_model_api._id);
    }
    this.addDocumentForm = {
      documentName: document.document_type,
      modelApi: document?.versioned_model_api?._id
        ? document?.versioned_model_api?._id
        : null,
      attributesArray: document.attributes,
      id: document._id,
    };
    this.isEdit = false;
    this.header = 'Edit Document Type';
    this.smeService.setDocumentFrom(this.addDocumentForm,this.updateButton);

  }

  setDocTypeMetaData(document: any) {
    this.smeService.metaDataTrainingDoc = {
      trainingDocId: document?.training_document?.id,
      documentTypeName: document?.document_type,
      docType_id: document?._id,
    };
  }
/***
   * @desc navigate to calibrate-documents-training'
   */
  onListTrainingDocumentsData(document: any) {
    this.setDocTypeMetaData(document);
    this.router.navigate(['sme/calibrate-documents-training']);  
  }
 /***
   * @desc navigate to calibrate-documents-Golden'
   */
  listGoldenDataSetDocs(document: any) {
    this.setDocTypeMetaData(document);
    this.router.navigate(['sme/calibrate-documents-Golden']);  
  }
 /***
   * @desc navigate to calibrate-documents-review'
   */
 onListReviewDocumentsData(document: any) {
  this.setDocTypeMetaData(document);
  this.router.navigate(['sme/calibrate-documents-review']);
}
}
