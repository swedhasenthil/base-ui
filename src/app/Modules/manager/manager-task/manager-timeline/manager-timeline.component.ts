import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as moment from 'moment';
import { ManagerService } from '../../manager.service';
import { Subject } from 'rxjs';

const ANALYST_ROLE_IDS: any= [];
const QC_ROLE_IDS:any = [];
const SUCCESS_CODE = 'success';
const WARNING_CODE = 'warning';
const INPROGRESS_CODE = 'in_progress';
const ERROR_CODE:any = 'failed';
const NON_ASSIGNABLE_STATUSES = ['completed_qc', 'failed', 'in-process', 'pushed_to_target', 'uploaded'];

@Component({
  selector: 'app-manager-timeline',
  templateUrl: './manager-timeline.component.html',
  styleUrls: ['./manager-timeline.component.scss'],
})
export class ManagerTimelineComponent implements OnInit {
 documentTimeline:any;
 docmentLineTimeDetails:any;
 

  constructor(
    private authService: AuthService,
    private managerService: ManagerService,
    private fb: FormBuilder,
    public toastService:ToasterService,
    public sharedService:SharedService
  ) { 
   this.managerService.documentDetails.subscribe(res => {
    this.docmentLineTimeDetails = res;
    this.getDocumentTimeline(this.docmentLineTimeDetails)
   })

  }

  ngOnInit(): void {
  }

  /**
   * @desc status of document timeline
   */
  getDocumentTimeline(document: any) {

    this.managerService.getDocumentTimeline(document._id).subscribe((documentTimeline:any) => {
  
      this.documentTimeline = this.formatStagebasedDocumentTimeLog(documentTimeline);
      
      // 
  
    })
  }

  /**
   * @desc time format hms
   */
  convertDurationToHMSformat(duration: string) {
    const sec = parseInt(duration, 10); // convert value to number if it's string
    let hours: string | number   = Math.floor(sec / 3600); // get hours
    let minutes: string | number  = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds: string | number  = sec - (hours * 3600) - (minutes * 60); //  get seconds
  
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
  
    return (hours != "00" ? hours + "h " : '') + (minutes != "00" ? minutes + "m " : '') + (seconds != "00" ? seconds + "s" : '');
  }

/**
   * @desc formate for time log
   */
  formatStagebasedDocumentTimeLog = (res: any) => {
    // 
    const UPLOADED_STAGE = "uploaded";
    const SKENSE_STAGE = "skense";
    const ANALYST_STAGE = "analyst";
    const QC_STAGE = "qc";
    const COMPLETED_STAGE = "completed";
  
    let currentStage;
    let currentStatus;
    const statusesMapper:any = {
      "uploaded": 1,
      "in-process": 2,
      "failed": 3,
      "pending_a": 4,
      "pending_a_u": 5,
      "in_progress_a": 6,
      "rejected_a": 7,
      "pending_qc": 8,
      "pending_qc_u": 9,
      "in_progress_qc": 10,
      "rejected_qc": 11,
      "completed_qc": 12,
      "pushed_to_target": 13
    }
  
    let stages :any= {
      [UPLOADED_STAGE]: null,
      [SKENSE_STAGE]: null,
      [ANALYST_STAGE]: null,
      [QC_STAGE]: null,
      [COMPLETED_STAGE]: null
    }
  
    if(res.document.document_status.includes('pending') && res.document.user_id) {
      res.document.document_status += '_u';
    }
  
    // 
  
    const splitAnalystAndQCLogs = (docLogs: any[]) => {
      let aLogs: any[] = [];
      let qLogs: any[] = [];
      docLogs.forEach(docLog => {
  
        // 
  
        if(ANALYST_ROLE_IDS.includes(docLog.role_id)){
          aLogs.push(docLog);
        } else if(QC_ROLE_IDS.includes(docLog.role_id)){
          qLogs.push(docLog);
        }
      });
      return {aLogs, qLogs};
    }
  
    const {aLogs, qLogs} = splitAnalystAndQCLogs(res.logs);
  
    if(aLogs.length && aLogs[aLogs.length-1].status == 'rejected_a') {
      res.document.document_status = 'rejected_a';
    }
  
    if(qLogs.length && qLogs[qLogs.length-1].status == 'rejected_qc') {
      res.document.document_status = 'rejected_qc';
    }
  
    const getSkenseStatusColorCode = (stage: string, docStatus: string | number) => {
      if(stage == SKENSE_STAGE) {
        if(statusesMapper[docStatus] > 3) {
          return SUCCESS_CODE;
        } else if(statusesMapper[docStatus] == 3) {
          return ERROR_CODE;
        } else if(statusesMapper[docStatus] == 2) {
          return INPROGRESS_CODE;
        }
      } else if(stage == ANALYST_STAGE) {
        if(statusesMapper[docStatus] > 7) {
          return SUCCESS_CODE;
        } else if(statusesMapper[docStatus] == 7) {
          return ERROR_CODE;
        } else if(statusesMapper[docStatus] == 6) {
          return INPROGRESS_CODE;
        } else if(statusesMapper[docStatus] == 5) {
          return INPROGRESS_CODE;
        }
      } else if(stage == QC_STAGE) {
        if(statusesMapper[docStatus] > 11) {
          return SUCCESS_CODE;
        } else if(statusesMapper[docStatus] == 11) {
          return ERROR_CODE;
        } else if(statusesMapper[docStatus] == 10) {
          return INPROGRESS_CODE;
        } else if(statusesMapper[docStatus] == 9) {
          return INPROGRESS_CODE;
        }
  
      } else if(stage == COMPLETED_STAGE) {
        if(statusesMapper[docStatus] >= 12) {
          return SUCCESS_CODE;
        }
      }
      return ''
    }
  
    const setStage = (doc: { document_status: string; uploaded_timestamp: any; last_modified_timestamp: any; }) => {
      currentStatus = doc.document_status;
      let docStatus = doc.document_status;
      if(statusesMapper[docStatus] >= 1) {
        currentStage = UPLOADED_STAGE;
        stages[UPLOADED_STAGE] = {};
        stages[UPLOADED_STAGE].createdAt = doc.uploaded_timestamp;
        stages[UPLOADED_STAGE].color_code = SUCCESS_CODE;
      }
  
      if(statusesMapper[docStatus] >= 2) {
        currentStage = SKENSE_STAGE;
        stages[SKENSE_STAGE] = {};
        stages[SKENSE_STAGE].createdAt = doc.uploaded_timestamp;
        stages[SKENSE_STAGE].color_code = getSkenseStatusColorCode(SKENSE_STAGE, docStatus);
  
        // if this stage was success by default next stage will be in progress
        if (stages[SKENSE_STAGE].color_code == SUCCESS_CODE) {
          stages[ANALYST_STAGE] = {};
          stages[ANALYST_STAGE].color_code = INPROGRESS_CODE;
        }
      }
  
      if(statusesMapper[docStatus] >= 5) {
        currentStage = ANALYST_STAGE;
        stages[ANALYST_STAGE] = {};
        stages[ANALYST_STAGE].logs = aLogs;
        stages[ANALYST_STAGE].color_code = getSkenseStatusColorCode(ANALYST_STAGE, docStatus);
  
        // if this stage was success by default next stage will be in progress
        if (stages[ANALYST_STAGE].color_code == SUCCESS_CODE) {
          stages[QC_STAGE] = {};
          stages[QC_STAGE].color_code = INPROGRESS_CODE;
        }
      }
  
      if(statusesMapper[docStatus] >= 9 || qLogs.length) {
        currentStage = QC_STAGE;
        stages[QC_STAGE] = {};
        stages[QC_STAGE].logs = qLogs;
        stages[QC_STAGE].color_code = getSkenseStatusColorCode(QC_STAGE, docStatus);
      }
  
      // Just show QC log
  
      if(statusesMapper[docStatus] >= 12) {
        currentStage = COMPLETED_STAGE;
        stages[COMPLETED_STAGE] = {};
        stages[COMPLETED_STAGE].status = doc.document_status;
        stages[COMPLETED_STAGE].createdAt = doc.last_modified_timestamp;
        stages[COMPLETED_STAGE].color_code = getSkenseStatusColorCode(COMPLETED_STAGE, docStatus);
      }
  
      // If document status is pushed to target then show last active time stamp with label auto in qc stage
      if(doc.document_status == 'pushed_to_target') {
        const lastAlog = aLogs[aLogs.length - 1];
        stages[QC_STAGE].logs = [
          {
            pickedAt: lastAlog.last_action_timestamp,
            review_time: null,
            user_id: {
              user_name: "auto"
            }
          }
        ];
      }
    }
  
    setStage(res.document)
    return stages;
  }
  
  /**
   * @desc sformat dat  h mm ss
   */
  formatDate(dateValue: any) {
    return moment(dateValue).format('MMMM Do YYYY, h:mm:ss a');
  }

  }
  
  

