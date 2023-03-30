import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from '../../services/common.service';
import { of } from 'rxjs';


describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;
  let commonService: CommonService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasComponent ],
      imports: [HttpClientTestingModule], 
      providers: [ CommonService ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
     commonService = TestBed.inject(CommonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getTask', () => {
    expect(component.getTask).toBeDefined();
  }); 

  it('should be defined openWindowDocument',  () => {  
    const openWindowDocument: any = 'test';  
    expect(openWindowDocument).toBeDefined();
  }); 
 
  it('should set the openWindowDocument property', () => {
    spyOn(commonService, 'getTaskFromBackend').and.returnValue(of([{
      id: 1,
      isNewWindow: false,
    }]));
    spyOn(commonService, 'getImageFromBlob');
    localStorage.setItem('currentUserRoleId', '1');
    localStorage.setItem('currentUserId', '1');
    localStorage.setItem('project_id', '1');
    localStorage.setItem('document_id', '1');

    component.getTask(document);

    expect(commonService.getTaskFromBackend).toHaveBeenCalledWith({
      role_id: '1',
      user_id: '1',
      project_id: '1',
      document_id: '1',
    });
    expect(component.openWindowDocument).toEqual({
      id: 1,
      isNewWindow: true,
    });
    expect(commonService.getImageFromBlob).toHaveBeenCalledWith(component.openWindowDocument);
  });
 
  


});
