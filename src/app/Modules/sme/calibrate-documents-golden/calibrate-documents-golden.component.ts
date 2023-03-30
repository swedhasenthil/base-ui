import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { SmeService } from '../sme.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

@Component({
  selector: 'app-calibrate-documents-golden',
  templateUrl: './calibrate-documents-golden.component.html',
  styleUrls: ['./calibrate-documents-golden.component.scss'],
})
export class CalibrateDocumentsGoldenComponent implements OnInit {
  [x: string]: any;

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  uploadDocumentListData: any = [];

  documentTypeName: any;
  trainingDocId: any;
  docType_id: any;

  constructor(
    private smeService: SmeService,
    private toastr: ToasterService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      order: [[0, 'desc']],
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
          targets: [6], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
        { targets: [3,4], type: 'date' }

      ],
    };

    if (this.smeService.metaDataTrainingDoc != null && this.smeService.metaDataTrainingDoc != undefined ) {
 
      this.documentTypeName =
        this.smeService.metaDataTrainingDoc?.documentTypeName;
      this.trainingDocId = this.smeService.metaDataTrainingDoc?.trainingDocId;
      this.docType_id = this.smeService.metaDataTrainingDoc?.docType_id;
      this.loadUplodDocuments();

    } else {
      this.router.navigate(['sme/calibrate-documents']);
    }

  }
  onUploadFailedGoldenDocData(files: File[], doc: any) {
    if (files.length === 0) {
      this.toastr.add({
        type: 'warning',
        message: 'Could not find file to upload',
      });
      return;
    }
    var formData = new FormData();
    formData.append('file', files[0]);
    formData.append('document_type_id', doc.doc_type_id);
    formData.append('golden_data_id', doc._id);
    this.smeService.addGoldenFailedDocumentData(formData).subscribe(
      (data: any) => {
        if (data['message']) {
          this.toastr.add({
            type: 'error',
            message: data['message'],
          });
        } else {
          this.toastr.add({
            type: 'success',
            message: 'Document is uploaded successfully',
          });
          this.smeService.getListGoldenDataDocument(this.docType_id).subscribe(
            (data) => {
              if (data) {
                this.uploadDocumentListData = data;
                this.rerender();
              }
            },
            (err) => {
            }
          );
        }
      },
      (err: any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        doc.file_name = files[0].name;
       
      }
    );
  }
  loadUplodDocuments() {
    this.smeService.getListGoldenDataDocument(this.docType_id).subscribe(
      (data) => {
        if (data) {
          this.uploadDocumentListData = data;
          this.rerender();
        }
      },
      (err: any) => {
      }
    );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      }
    });
    this.dtTrigger.next(null);
  }
  onDeleteDocumentIconClick(doc: any) {
    this.deleteDocumentName = doc.document_type_id;
    this.documentIdToDelete = doc._id;
  }

  onDeleteButtonClick() {
    this.smeService.deleteGoldenDocument(this.documentIdToDelete).subscribe(
      (dataResult: any) => {
        const deleteDocumentStatusResponse: any = dataResult;
        if (!deleteDocumentStatusResponse.error) {
          this.toastr.add({
            type: 'success',
            message: 'Document Deleted Successfully!',
          });
          this.deleteDocumentbtn.nativeElement.click();
          this.loadUplodDocuments();
        }
      },
      (err: any) => {
        this.toastr.add({
          type: 'error',
          message: 'Document type cannot be deleted',
        });
      }
    );
  }
}
