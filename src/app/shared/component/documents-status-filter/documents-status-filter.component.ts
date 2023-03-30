import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-documents-status-filter',
  templateUrl: './documents-status-filter.component.html',
  styleUrls: ['./documents-status-filter.component.scss'],
})
export class DocumentsStatusFilterComponent implements OnInit {
  selectedStatus: any;
  _listOfDocumentStatus: any;
  /* Subscriptions varables start */
  subscriptionstausListObserval: Subscription;
  subscriptionRefresh: Subscription;
  /* Subscriptions varables end */

  @Output() selectedDocumentStatus = new EventEmitter();
  subscriptionDocumentStatus: Subscription;
  @Input() set listOfDocumentStatus(documentStatus: any) {
    this._listOfDocumentStatus = [
      { name: 'All', status: 'all' },
      ...documentStatus,
    ];
  }

  constructor(
    public sharedService: SharedService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.subscriptionstausListObserval =
      this.commonService.stausListObserval.subscribe((list) => {
        if (list) {
          this._listOfDocumentStatus = list;
          this.validateFilter(list);
        }
      });

    this.subscriptionRefresh = this.commonService.refreshTableSubject.subscribe(
      (data) => {
        if (this._listOfDocumentStatus) {
          this.validateFilter(this._listOfDocumentStatus);
        }
      }
    );

    this.subscriptionDocumentStatus = this.commonService.selectStatus.subscribe(
      (data) => {
        if (data) {
          this.selectedStatus = data[0].name;
        }
      }
    );
  }

  /**
   *@desc Bind selected document status
   *@param docuemntStatus
   */
  selectDocumentStatus(docuemntStatus: any) {
    if (docuemntStatus) {
      this.selectedStatus = docuemntStatus.name;
      this.selectedDocumentStatus.emit(this.selectedStatus);
      this.sharedService.setStatus(docuemntStatus);
    }
  }
  /**
   * @desc  unsubscribe the subcribe method
   */
  ngOnDestroy(): void {
    this.subscriptionstausListObserval.unsubscribe();
    this.subscriptionRefresh.unsubscribe();
    this.subscriptionDocumentStatus.unsubscribe();
  }
/**
   *@desc validate filter
   *@param docuemntStatus
   */
  validateFilter(documentStatus: any) {
    var defaultSelectIndex = 0;
    let isHaveDefaultIndex: boolean = false;
    if (documentStatus) {
      documentStatus.every((status: any, index: number) => {
        if (status.name == 'Pending Review') {
          defaultSelectIndex = index;
        }
        if (status.default) {
          isHaveDefaultIndex = true;
          this.selectedStatus = status.name;
          this.selectedDocumentStatus.emit(status);
          this.sharedService.setStatus(status);

          return false;
        }
        return true;
      });
    }
    if (!isHaveDefaultIndex) {
      let status = documentStatus[defaultSelectIndex];
      this.selectedStatus = status.name;
      this.selectedDocumentStatus.emit(status);
      this.sharedService.setStatus(status);
    }
  }
}
