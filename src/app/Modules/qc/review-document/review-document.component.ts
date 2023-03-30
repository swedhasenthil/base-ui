import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-review-document',
  templateUrl: './review-document.component.html',
  styleUrls: ['./review-document.component.scss'],
})
export class ReviewDocumentComponent implements OnInit {
  document: any;

  constructor(
    private commonService: CommonService,
    public router: Router
  ) {
    // After proper routing delete below line
    this.commonService.setParentComponent('qc');
  }

  ngOnInit(): void {
    // Get selected Document from commonservice
    this.document = this.commonService.getReviewDocument;
    this.commonService.getImageFromBlob(this.document);
    if (this.document == undefined || null) {
      this.router.navigate(['/qc/my-work']);
    } else {
      this.document = this.commonService.getReviewDocument;
    }
  }
}
