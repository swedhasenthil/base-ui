import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  // scroll view positions
  SCROLL_TO_START = 'start';
  SCROLL_TO_CENTER = 'center';
  SCROLL_TO_END = 'end';

  BOUNDARY_BOX_TRACE_STROKE_COLOR = '#00000050'; // Gray
  BOUNDARY_BOX_CURRENT_VAL_STROKE_COLOR = '#f6aa004f'; // Orange
  BOUNDARY_BOX_CURRENT_VAL_FILL_COLOR = '#f6aa004f'; // Orange
  BOUNDARY_BOX_ORIGIN_VAL_STROKE_COLOR = '#ff03037a'; // Red
  BOUNDARY_BOX_ORIGIN_VAL_FILL_COLOR = '#FF0000'; // Red

  constructor(private router: Router, private commonService: CommonService) {}
  private overlay = new Subject<boolean>();
  private PREVIEW_IMAGE_OPTIONS = {
    SAME_WINDOW: 'Same Window',
    NEW_WINDOW: 'New Window',
  };
  private overlayType = new Subject<string>();
  public currentPageObserval = new BehaviorSubject<any>(null);
  public setActiveThambnailSubject = new BehaviorSubject<any>(null);

  setCurrentPage(index: number) {
    this.currentPageObserval.next(index);
  }

  setActiveThambnail(index: number) {
    this.setActiveThambnailSubject.next(index);
  }

  scrollTo(path: string) {
    const { url, elementId } = this.__getUrlAndElementId(path);
    if (url) {
      this.router.navigate([url]);
      if (elementId) {
        this.scrollToElementById(elementId, null, null);
      }
    }
  }

  private __getUrlAndElementId(path: string) {
    const splits = path.split('#');
    return {
      url: splits[0],
      elementId: splits[1],
    };
  }
  ovserlayStatus$ = this.overlay.asObservable();
  ovserlayType$ = this.overlayType.asObservable();

  // Service message commands
  activateOverlay(val: any, type: any) {
    this.overlay.next(val);
    if (val) {
      this.overlayType.next(type);
    } else {
      this.overlayType.next('');
    }
  }
  getProjectPreviewImageOptions() {
    return this.PREVIEW_IMAGE_OPTIONS;
  }

  scrollToElementById(id: string, verticalScroll: any, horizontalScroll: any) {
    const element = this.__getElementById(id);
    this.scrollToElement(element, verticalScroll, horizontalScroll);
  }

  private __getElementById(id: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`#${id}`);
    return element;
  }

  scrollToElement(
    element: HTMLElement,
    verticalScroll: any,
    horizontalScroll: any
  ) {
    if (verticalScroll && horizontalScroll) {
      element.scrollIntoView({
        block: verticalScroll,
        inline: horizontalScroll,
      });
    } else {
      element.scrollIntoView({});
    }
  }

  getScrollValues(dataLocation: any, canvas: any) {
    let verticalScroll = null;
    let horizontalScroll = null;
    let verticalScrollPercent = null;
    let horizontalScrollPercent = null;

    if (!dataLocation) {
      return { verticalScroll, horizontalScroll };
    }
    verticalScrollPercent = Math.round(
      (dataLocation.split(',')[1] / canvas.height) * 100
    );
    horizontalScrollPercent = Math.round(
      (dataLocation.split(',')[0] / canvas.width) * 100
    );
    if (horizontalScrollPercent <= 35) {
      horizontalScroll = this.SCROLL_TO_START;
    } else if (horizontalScrollPercent <= 70) {
      horizontalScroll = this.SCROLL_TO_CENTER;
    } else {
      horizontalScroll = this.SCROLL_TO_END;
    }
    if (verticalScrollPercent <= 35) {
      verticalScroll = this.SCROLL_TO_START;
    } else if (verticalScrollPercent <= 70) {
      verticalScroll = this.SCROLL_TO_CENTER;
    } else {
      verticalScroll = this.SCROLL_TO_END;
    }
    return { verticalScroll, horizontalScroll };
  }
  drawRectangle(
    canvas: any,
    boundingBox: any,
    colorCode: any,
    fillColor?: any,
    fill: boolean = false
  ) {
    // this.commonService.hideEditBox(true);
    const ctx = canvas.getContext('2d');
    const width = Math.abs(boundingBox[0] - boundingBox[2]) + 10;
    const height = Math.abs(boundingBox[1] - boundingBox[7]) + 6;
    ctx.beginPath();
    ctx.rect(boundingBox[0], boundingBox[1], width, height);
    if (fill) {
      ctx.fillStyle = fillColor
        ? fillColor
        : this.BOUNDARY_BOX_CURRENT_VAL_FILL_COLOR;
      ctx.fill();
      ctx.setLineDash([]);
      if (!colorCode) {
        colorCode = this.BOUNDARY_BOX_CURRENT_VAL_STROKE_COLOR;
      }
    } else {
      ctx.setLineDash([15]);
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = colorCode
      ? colorCode
      : this.BOUNDARY_BOX_TRACE_STROKE_COLOR;
    ctx.stroke();
  }
}
