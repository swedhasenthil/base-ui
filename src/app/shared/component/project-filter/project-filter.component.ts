import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { CommonService } from '../../services/common.service';
import { SharedService } from '../../../shared/shared.service';


@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss'],
})
export class ProjectFilterComponent implements OnInit {
  selectedProjectName: any;
  selectproject: any;
  allProjects: any = [];

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    public sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.projectsList();
  }
  /**
   @desc getting list of projests form backend
   **/
  projectsList() {
    this.commonService
      .getProjectsList({ role_id:localStorage.getItem('currentUserRoleId') })
      .subscribe(
        (data) => {
          if (data) {
            this.allProjects = data;
            this.allProjects = this.allProjects.map((project: any) => {
              let tempProject: any = {};
              tempProject['id'] = project._id;
              tempProject['previewImage'] = project.preview_image;
              tempProject['projectName'] = project.project_name;
              tempProject['taskAssignment'] = project.task_assignment;
              tempProject['timerDisplay'] = project.timer_display;
              return tempProject;
            });
          }
          this.selectproject = this.allProjects[0];
          this.selectedProjectName = this.selectproject.projectName;
          this.sharedService.project=this.allProjects[0];
           this.sharedService.setProject(this.selectproject); 
        }
      );
  }
 /**
   @desc on filter the project name
   @param project
   **/
  onProjectChange(project: any) {
    this.sharedService.project=project.projectName;
    this.selectedProjectName = project.projectName;
    this.sharedService.setProject(project);
  }
}
