import { async, ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ProjectFilterComponent } from './project-filter.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from '../../services/common.service';

// import * as Rx from 'rxjs';
import {of} from 'rxjs';
import { delay, subscribeOn } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { SharedService } from '../../shared.service';
const APIEndpoint = environment.APIEndpoint;


const mockArray = [
  {      
    "task_assignment": "Manual",
    "timer_display": true,
    "submit_docs_for_review": false,
    "analyst_bypass": true,
    "preview_image": "Same Window",
    "qc_percent": 100,
    "state": "Pause",
    "_id": "5eea09d156170c00532b268c",
    "project_name": "Demo Project",
    "start_date": "2020-06-17T12:17:01.036Z",
    "project_description": "Classification and digitization of shipping documents ",
    "document_source": "ggshgakjks",
    "destination": "//sources/output",
    "user_group_id": "5f4679c4f60a4d5f9f586b58",
    "status": "active",
    "review_status": false
  },
];


describe('ProjectFilterComponent', () => {
  let component: ProjectFilterComponent;
  let fixture: ComponentFixture<ProjectFilterComponent>;

  let httpTestingController: HttpTestingController;
  let commonservice:CommonService;
  let sharedService: SharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectFilterComponent ],
      imports: [HttpClientTestingModule],
      providers:[CommonService, SharedService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFilterComponent);
    component = fixture.componentInstance;
    commonservice = TestBed.inject(CommonService);
    sharedService = TestBed.inject(SharedService);

    // component = new ProjectFilterComponent(sharedService); // create an instance of the component with the shared service injected


    fixture.detectChanges();  
  
  }); 

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined projectsList', () => {
    expect(component.projectsList).toBeDefined();
  }); 

  it('should be defined allProjects', () => {
    expect(component.allProjects).toBeDefined();
  }); 


  it('should call projectsList on component Init', () => {
    const myMethodSpy = spyOn(component, 'projectsList').and.callThrough();
    component.ngOnInit();
    expect(myMethodSpy).toHaveBeenCalled();
  });

  it('should set the selected project name and call setProject method', () => {
    const sharedServiceSpy = jasmine.createSpyObj('SharedService', ['setProject']);
    component.sharedService = sharedServiceSpy;

    const project = {
      projectName: 'Demo Project'
    };
    component.onProjectChange(project);
    expect(component.selectedProjectName).toEqual('Demo Project');
    expect(sharedServiceSpy.setProject).toHaveBeenCalledWith(project);
  }); 
  
  it('should get list of projects from backend', () => {
    const mockProjects = [
      {
        _id: '1',
        preview_image: 'preview1',
        project_name: 'project1',
        task_assignment: 'task1',
        timer_display: 'timer1'
      },
      {
        _id: '2',
        preview_image: 'preview2',
        project_name: 'project2',
        task_assignment: 'task2',
        timer_display: 'timer2'
      }
    ];

    spyOn(commonservice, 'getProjectsList').and.returnValue(of(mockProjects));

    component.ngOnInit();

    expect(component.allProjects).toEqual([
      {
        id: '1',
        previewImage: 'preview1',
        projectName: 'project1',
        taskAssignment: 'task1',
        timerDisplay: 'timer1'
      },
      {
        id: '2',
        previewImage: 'preview2',
        projectName: 'project2',
        taskAssignment: 'task2',
        timerDisplay: 'timer2'
      }
    ]);
    expect(component.selectproject).toEqual({
      id: '1',
      previewImage: 'preview1',
      projectName: 'project1',
      taskAssignment: 'task1',
      timerDisplay: 'timer1'
    });
    expect(component.selectedProjectName).toEqual('project1');
    expect(sharedService.project).toEqual({
      id: '1',
      previewImage: 'preview1',
      projectName: 'project1',
      taskAssignment: 'task1',
      timerDisplay: 'timer1'
    });    
  }); 

  it('should set the project name and call setProject on the shared service', () => {
    const fakeProject = { projectName: 'Test Project' }; 
    component.onProjectChange(fakeProject);
    
    expect(sharedService.project).toBe(fakeProject.projectName);
    expect(component.selectedProjectName).toBe(fakeProject.projectName);
  });

});
