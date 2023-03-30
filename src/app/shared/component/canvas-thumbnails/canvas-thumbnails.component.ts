import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-canvas-thumbnails',
  templateUrl: './canvas-thumbnails.component.html',
  styleUrls: ['./canvas-thumbnails.component.scss'],
})
export class CanvasThumbnailsComponent implements OnInit {
  @Input() document: any;

  /* Subscriptions starts here */
  imagesSubscription: Subscription;
  subscriptionsetActiveThambnail: Subscription;
  /* Subscriptions ends here */

  currentImage: any;
  currentImageIndex: any = 0;

  imageBlobUrl: any = [];

  constructor(
    private commonService: CommonService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.subscriptionsetActiveThambnail =
      this.scrollService.setActiveThambnailSubject.subscribe((currentIndex) => {
        if (currentIndex) {
          this.currentImageIndex = currentIndex - 1;
        }
      });
    this.getThumbnails();
  }

  /**
   * @desc subscribe image blob
   **/
  getThumbnails() {
    this.imagesSubscription =
      this.commonService.documentImageObserval.subscribe((image) => {
        if (image) {
          this.imageBlobUrl.push(image);
        }
      });
  }
/**
   * @desc  unsubscribe the subcribe method
   */
  ngDestroy() {
    this.commonService.documentImageObserval.next(null);
    this.imagesSubscription.unsubscribe();
    this.subscriptionsetActiveThambnail.unsubscribe();
  }
  /**
   * @desc  Set current index Observavle
   */
  setindex(index: any) {
    this.scrollService.setCurrentPage(index);
    this.currentImageIndex = index;
  }
  isShowHide = false;

  thumbShowHide() {
    this.isShowHide = !this.isShowHide;
  }
}
