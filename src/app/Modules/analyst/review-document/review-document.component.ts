import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/shared.service';
@Component({
  selector: 'app-review-document',
  templateUrl: './review-document.component.html',
  styleUrls: ['./review-document.component.scss'],
})
export class ReviewDocumentComponent implements OnInit {
  document: any;
  project: any;
  isCanvasVisible: boolean = true;
  webURL: any;
  docCanvas: any;
  constructor(
    private commonService: CommonService,
    private sharedService: SharedService,
    public router: Router
  ) {
    /*** 
   * @desc  After proper routing delete below line
  */
    this.commonService.setParentComponent('analyst');
  }
 /*** 
   * @desc  Get selected Document from commonservice
  */
  ngOnInit(): void {
    this.document = this.commonService.getReviewDocument;
    if (this.document == undefined || null) {
      this.router.navigate(['/analyst/my-work']);
    } else {
      this.project = this.sharedService.project;
      if (this.project.previewImage === 'New Window') {
        this.isCanvasVisible = false;
        localStorage.setItem('project_id', this.document.project_id);
        localStorage.setItem('document_id', this.document._id);
        this.webURL = window.location.href.split('analyst')[0];
        this.docCanvas = window.open(
          `${this.webURL}canvas`,
          'docCanvas',
          'toolbar=no, scrollbars=no, resizable=no, top=100, left=500, width=600, height=400'
        );
      }
      this.commonService.getImageFromBlob(this.document);
    }
  }

  ngOnDestroy(): void {
    this.commonService.setDocument(null);
  }
}
