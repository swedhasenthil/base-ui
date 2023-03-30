import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';

@Component({
  selector: 'app-calibrate-documents-training',
  templateUrl: './calibrate-documents-training.component.html',
  styleUrls: ['./calibrate-documents-training.component.scss'],
})
export class CalibrateDocumentsTrainingComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  uploadDocumentListData: any = [];

  documentTypeName: any;
  trainingDocId: any;
  docType_id: any;

  @ViewChild('deleteDocumentbtn') deleteDocumentbtn: ElementRef;

  constructor(
    private smeService: SmeService,
    private toastr: ToasterService,
    private router: Router
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

    if (this.smeService.metaDataTrainingDoc) {
      this.documentTypeName =
        this.smeService.metaDataTrainingDoc?.documentTypeName;
      this.trainingDocId = this.smeService.metaDataTrainingDoc?.trainingDocId;
      this.docType_id = this.smeService.metaDataTrainingDoc?.docType_id;
      this.loadUplodDocuments();

    } else {
      this.router.navigate(['sme/calibrate-documents']);
    }

  }

  loadUplodDocuments() {
    this.smeService.getListTrainingDocument(this.docType_id).subscribe(
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
  deleteDocumentName: any;
  documentIdToDelete: any;
  onDeleteDocumentIconClick(doc: any) {
    this.deleteDocumentName = doc.document_type_id;
    this.documentIdToDelete = doc._id;
  }

  onDeleteButtonClick() {
    this.smeService.deleteTrainingDocument(this.documentIdToDelete).subscribe(
      (dataResult: any) => {
        const deleteDocumentStatusResponse: any = dataResult;
        if (!deleteDocumentStatusResponse.error) {
          this.loadUplodDocuments();
          this.toastr.add({
            type: 'success',
            message: 'Document Deleted Successfully!',
          });
          this.deleteDocumentbtn.nativeElement.click();
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
