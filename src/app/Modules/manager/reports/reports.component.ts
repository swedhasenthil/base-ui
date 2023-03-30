import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ManagerService } from '../manager.service';
import * as Highcharts from 'highcharts';
import { SharedService } from 'src/app/shared/shared.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  selectedProjectName: any;
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

  constructor(private api: ManagerService,private sharedService:SharedService) {   this.projectsList = JSON.parse(
    localStorage.getItem('currentUserProjectsArray')!
  );
  this.minDate.setDate(this.minDate.getDate());
  this.maxDate.setDate(this.maxDate.getDate());
  this.bsRangeValue = [this.bsValue, this.maxDate];
 
}
  showBackButton: any;
  donut1: any;
  donut2: any;
  donut3: any;
  donut4: any;
  donut5: any;
  averageTimeSpentAnalystChart: any;
  averageTimeSpentQCChart: any;
  analystAccuracyChart: any;
  reasonsToRejectChart: any;
  dailyVolumeChart: any;
  timeperiod = {
    startDate: { _d: new Date() },
    endDate: { _d: new Date() },
    firstLoad: true,
  };
  analystReport = [
    {
      user_group: 'NA',
      group_sla: 'NA',
      group_performance: 'NA',
      individual_sla: 'NA',
      average_sla: 'NA',
      data: [{ user: 'NA', review_count: 'NA' }],
    },
  ];
  QCReport = [
    {
      user_group: 'NA',
      group_sla: 'NA',
      group_performance: 'NA',
      individual_sla: 'NA',
      average_sla: 'NA',
      data: [{ user: 'NA', review_count: 'NA' }],
    },
  ];

  projectsList: any ;
  selectedprojectId: any;
  ngOnInit(): void {
    this.sharedService.managerMenuChanges();
    this.selectedProjectName = "reviews"
      this.projectsList = JSON.parse(
        localStorage.getItem('currentUserProjectsArray')!
      );
 

      if(this.projectsList != null && this.projectsList != undefined)  {
      this.selectedprojectId = this.projectsList[0].id;
      }

    //load chart
    this.loadRibbon();
    this.loadPieChart();
    this.loadTableData();

  }
  onProjectChange(event: any) {
    this.selectedprojectId = event.target.value;
    this.selectedProjectName = event.target.value
    this.ngOnInit();
  }

  onTimePeriodChange() {
    // const fromDate = this.timeperiod.startDate._d;
    // this.fromDate = fromDate.toISOString();
    // const toDate = this.timeperiod.endDate._d;
    // this.toDate = toDate.toISOString();
    // if (!this.timeperiod.firstLoad) this.ngOnInit();
  }

  getRenderFunction(data:any) {
    data.chart.events.render = function () {
      let centerX = this.plotWidth / 2 + this.plotLeft,
        centerY = this.plotHeight / 2 + this.plotTop;
      const text = this.renderer
        .text(data.series[0].data[0].y + ' %', centerX, centerY)
        .attr({
          align: 'center',
        })
        .add();
    };
  }

  loadRibbon() {
    const filters = {
      project_id: this.selectedprojectId,
      from_upload_date: this.fromDate,
      to_upload_date: this.toDate,
      type: 'donut',
    };
    this.api.getDocumentsProccessed(filters).subscribe((result: any) => {
      const data: any = result;
      this.getRenderFunction(data);
 
      this.donut1 = new Chart(data);
 
    });
    this.api.getPagesProccessed(filters).subscribe((result: any) => {
      const data: any = result;
      this.getRenderFunction(data);
      this.donut2 = new Chart(data);
    });
    this.api.getStraightThroughProcessing(filters).subscribe((result: any) => {
      const data: any = result;
      this.getRenderFunction(data);
      this.donut3 = new Chart(data);
    });
    this.api.machineLevelAccuracyAnalyst(filters).subscribe((result: any) => {
      const data: any = result;
      this.getRenderFunction(data);
      this.donut4 = new Chart(data);
    });
    this.api.machineLevelAccuracyQC(filters).subscribe((result: any) => {
      const data: any = result;
      this.getRenderFunction(data);
      this.donut5 = new Chart(data);
    });
  }

  loadPieChart() {
    const filters = {
      project_id: [this.selectedprojectId],
      from_upload_date: this.fromDate,
      to_upload_date: this.toDate,
      type: 'pie',
    };
    this.api.reasonsToReject(filters).subscribe((result: any) => {
      const data: any = result;
      this.reasonsToRejectChart = new Chart(data);
    });
  }

  loadTableData() {
    this.api.getRoles().subscribe((result) => {
      const data: any = result;
      const analystRoleID = data.find((role: { role_name: string | string[]; }) =>
        role.role_name.includes('Analyst')
      )._id;
      const QCRoleID = data.find((role: { role_name: string | string[]; }) => role.role_name.includes('QC'))._id;
      const filters = {
        project_id: [this.selectedprojectId],
        from_upload_date: this.fromDate,
        to_upload_date: this.toDate,
        role_id: analystRoleID,
        type: 'line',
      };
      this.api.analystAccuracy(filters).subscribe((result: any) => {
        const data: any = result;
        if (typeof data.yAxis !== 'undefined')
          data.yAxis[0].title.text = 'Analyst Accuracy (%)';
        this.analystAccuracyChart = new Chart(data);
      });

      //analyst
      this.api.dailyPerformancereport(filters).subscribe((result: any) => {
        const data: any = result;
        if (data.length > 0) this.analystReport = data;
      });
      this.api.averageTimeSpent(filters).subscribe((result: any) => {
        const data: any = result;
        if (typeof data.yAxis !== 'undefined')
          data.yAxis[0].title.text = 'Average Time Spent (Mins)';
        this.averageTimeSpentAnalystChart = new Chart(data);
      });

      //QC
      filters.role_id = QCRoleID;
      this.api.dailyPerformancereport(filters).subscribe((result: any) => {
        const data: any = result;
        if (data.length > 0) this.QCReport = data;
      });
      this.api.averageTimeSpent(filters).subscribe((result: any) => {
        const data: any = result;
        if (typeof data.yAxis !== 'undefined')
          data.yAxis[0].title.text = 'Average Time Spent (Mins)';
        this.averageTimeSpentQCChart = new Chart(data);
      });

      //daily volume
      filters.type = 'combined';
      this.api.dailyVolume(filters).subscribe((result: any) => {
        const data: any = result;
        if (typeof data.yAxis !== 'undefined')
          data.yAxis[0].title.text = 'Documents Count';
        this.dailyVolumeChart = new Chart(data);
      });
    });
  }

}

