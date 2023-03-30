import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ReportService,Download } from '../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  getAllProjects: any[];
  selectedProject: any;
  selectedProjectId: any;
  getTaskFlag: any;
  documentListFlag: any;
  displayTimerFlag: any;
  loggedUser: any;
  loggedInUsername: any;
  docCanvas: any;
  groupPerformances: any;
  isDefault: boolean;
  getAllProject: any[];
  roleId: any;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  disabledDates = [
    new Date('2022-11-09'),
    new Date('2022-12-09')
  ];
  individualPerformance: any;
  fromDate = new Date();
  minDates: moment.Moment;
  toDate: any;
  reports: any = [
    {
      name: 'Documents',
      url: '/download/documents',
      download: false,
    }
  ]
  finalReports: any = [
    {
      name: 'final output',
      url: '/download/time-calculation',
      download: false
    }
  ]
  finalOpReports: any = [
    {
      name: 'Final Report',
      url: '/download/book-keeping',
      download: false
    }
  ]
  documentReports: any = [
    {
      name: 'My Document',
      url: '/download/textextracteddata',
      download: false,
    }
  ]
  download$: Observable<Download>;
  report: any = false;
  reportOutput: any = false;
  reportFinal: any = false;
  reportDocumnet: any = false;
  selectedProjectName: any;

  constructor(   private authService: AuthService,public router: Router,
    private reportService:ReportService) {
      this.roleId = localStorage.getItem("currentUserRoleId")
      this.minDate.setDate(this.minDate.getDate());
      this.maxDate.setDate(this.maxDate.getDate());
      this.bsRangeValue = [this.bsValue, this.maxDate];
      this.fromDate.setHours(0, 0, 0, 0); //set from date to midnight
  
      this.reportService.minDate().subscribe((response: any) => {
        this.minDates = moment(response[0].min_date);
      });
     }

    /**
   * @desc getting the today date 
   */
  ngOnInit(): void {
    this.getListDocuments();
    this.groupPerformance();
    this.getIndividualPerformanceDetails();
   
  }

  /**
   * @desc display list of documents
   */
   getListDocuments() {
    this.reportService.getProjectsList({ role_id: this.roleId })
      .subscribe((data: any) => {
        if (data) {
          this.getAllProjects = data;
          this.getAllProjects = this.getAllProjects.map((project: any) => {
            let tempProject: any = {};
            tempProject['id'] = project._id;
            tempProject['previewImage'] = project.preview_image;
            tempProject['projectName'] = project.project_name;
            tempProject['taskAssignment'] = project.task_assignment;
            tempProject['timerDisplay'] = project.timer_display;
            return tempProject;
          });

        }
        this.selectedProject = this.getAllProjects[0];
        this.selectedProjectName = this.selectedProject.projectName;
        this.selectedProjectId = this.selectedProject.id;
        this.groupPerformance();
        this.getIndividualPerformanceDetails();
        if (this.getAllProjects[0].taskAssignment == 'Auto') {
          this.getTaskFlag = true;
        } else {
          this.documentListFlag = true;
        }
        if (this.getAllProjects[0].timerDisplay == true) {
          this.displayTimerFlag = true;
        } else {
          this.displayTimerFlag = false;
        }
        this.loggedUser = localStorage.getItem('user');
        this.loggedInUsername = localStorage.getItem('userName')
          ? localStorage.getItem('userName')
          : 'default user';
        if (this.docCanvas) {
          this.docCanvas.close();
        }
      },
        (err) => {
 
        }
      );
  }
  /**
   * @desc getting group performance data
   */
  groupPerformance() {
    this.reportService.getGroupPerformance({ role_id: this.roleId, project_id: this.selectedProjectId }).subscribe((data: any) => {
      this.groupPerformances = data
    })
  }
/**
   * @desc filter the project name.
   * @param event
   */
  onProjectChange(event: any) {
  this.selectedProjectName = event.projectName
    this.selectedProject = event;
    this.selectedProjectId = event.id;
    if (event.taskAssignment == 'Auto') {
      this.documentListFlag = false;
      this.getTaskFlag = true;
    } else {
      this.getTaskFlag = false;
      this.documentListFlag = true;
      this.isDefault = false;
      this.groupPerformance();
    }
    if (event.timerDisplay == true) {
      this.displayTimerFlag = true;
    } else {
      this.displayTimerFlag = false;
    }
    this.authService.setCurrentProjectId(this.selectedProjectId);
  }
  onTimePeriodChange() {
  }
/**
   * @desc getting individual performance details
   * @param reportData
   */
  getIndividualPerformanceDetails() {
    const httpRequestBody = {
      role_id: this.roleId,
      user_id: localStorage.getItem("currentUserId"),
      project_id: this.selectedProjectId
    };
    this.reportService.getIndiviualPerformance(httpRequestBody).subscribe(
      {
    next:(data: any) => {
        this.individualPerformance = data;
 
        setTimeout(() => {
        }, 500);
      },
    error:(err:any) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    }
    );
  }

  /**
   * @desc download document 
   * @param reportData
   */
  download(reportData: any) {
    var name = reportData.name;
    var url = reportData.url;
    const httpRequestBody = {
      from_date: this.fromDate,
      to_date: this.bsValue,
    };
 
    this.download$ = this.reportService.download(httpRequestBody, url, name)
    if (name === 'Documents') {
      this.report = true
      this.reports.map((report: any) => (report.download = false));
    }
    if (name === 'final output') {
      this.reportOutput = true;
      this.finalReports.map((report: any) => (report.download = false));
    }
    if (name === 'finals output') {
      this.reportFinal = true
      this.finalOpReports.map((report: any) => (report.download = false));
    }
    if (name === 'My Document') {
      this.reportDocumnet = true
      this.documentReports.map((report: any) => (report.download = false));
    }
  }


}
