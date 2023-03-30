import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  time = new Date();
  interval: any;
  reviewTime: any;
  public document: any;
  timerDisplay_status: any;
  public time_value: any

  constructor(public commonService: CommonService,
    public sharedService: SharedService,
    public datePipe: DatePipe
  ) { }
  /**
   @desc getting document review time
   */
  ngOnInit(): void {
    this.pauseTimer();
    this.resetTimer();
    this.sharedService.getProject.subscribe(data => {
      this.timerDisplay_status = data.timerDisplay;
    });
    this.document = this.commonService.getReviewDocument;
    if (this.document !== null && this.document !== undefined) {
      this.startTimer(this.document.review_time)
    }
  }
  /**
     @desc start timer to increamnet
     @param review_time_value
     */
  startTimer(review_time_value: any) {
    if (review_time_value) {
      const d = review_time_value;
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      const mDisplay: any = m > 0 ? m + (m === 1 ? '' : '') : '';
      const sDisplay: any = s > 0 ? s + (s === 1 ? '' : '') : '';
      this.time.setUTCHours(0, mDisplay, sDisplay, 0);
      this.interval = setInterval(() => {
        this.time.setSeconds(this.time.getSeconds() + 1);
        this.sharedService.setReviewTime(this.time.getTime() / 1000);

        const output = document.getElementById('demo');
        if (output) {
          this.time_value = this.datePipe.transform(this.time, 'mm:ss');
          output.innerHTML = this.time_value;
        }
      }, 1000);
    } else {
      this.time.setUTCHours(0, 0, 0, 0);
      var times = 0
      this.interval = setInterval(() => {
        this.time.setMinutes(0)
        this.time.setSeconds(times++);
        this.sharedService.setReviewTime(this.time.getTime() / 1000);
        const output = document.getElementById('demo');

        if (output) {
          this.time_value = this.datePipe.transform(this.time, 'mm:ss');
          output.innerHTML = this.time_value;
        }
      }, 1000);
    }
  }
  /**
     @desc pause timer 
     */
  pauseTimer() {
    clearInterval(this.interval);
  }
  /**
     @desc where this method is getting called in this file
       */
  resetTimer() {
    this.reviewTime = this.time.getTime() / 1000;
    this.time.setMinutes(0);
    this.time.setSeconds(0);
  }
  /**
     @desc clear timer
       */
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
