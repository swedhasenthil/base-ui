import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTaskComponent } from './manager-task.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { ManagerService } from '../manager.service';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

describe('ManagerTaskComponent', () => {
  let component: ManagerTaskComponent;
  let fixture: ComponentFixture<ManagerTaskComponent>; 
  let managerService: ManagerService;

  beforeEach(async () => {
   
    await TestBed.configureTestingModule({
      declarations: [ ManagerTaskComponent ],
      imports: [HttpClientTestingModule,
        FormsModule, 
        ReactiveFormsModule, 
      ], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTaskComponent);
    component = fixture.componentInstance;
    managerService = TestBed.inject(ManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load MenuChanges as expect', () => {
    const sharedService = TestBed.inject(SharedService);
    spyOn(sharedService, 'managerMenuChanges');
    
    component.ngOnInit();

    expect(sharedService.managerMenuChanges).toHaveBeenCalled();
  });

  it('should call listProjects method of ManagerService with the correct arguments', () => {
    const roleId = 'someRoleId';
    spyOn(localStorage, 'getItem').and.returnValue(roleId);
    spyOn(managerService, 'listProjects').and.callThrough(); 
  
    component.ngOnInit();
  
    expect(managerService.listProjects).toHaveBeenCalledWith({ role_id: roleId });
  });  

  it('should set documents and docStatusMetaData properties when getProjectDocument succeeds', () => {
    const response = {
      data: [{ id: 1, is_locked: false, document_status: 'in_progress_a' }],
      meta_data: { total_documents: 1 }
    };
    spyOn(managerService,'getProjectDocument').and.returnValue(of(response));
    component.getDocumentsOfProject();
    expect(component.documents).toEqual(response.data);
    expect(component.docStatusMetaData).toEqual(response.meta_data);
  });

  it('should show a message when there are no documents in queue', () => {
    const response = {
      data: [],
      meta_data: { total_documents: 0 }
    };
    spyOn(managerService,'getProjectDocument').and.returnValue(of(response));
    
    spyOn(component.toastService, 'add');
    component.getDocumentsOfProject();
    expect(component.toastService.add).toHaveBeenCalledWith({
      type: 'info',
      message: 'No documents in queue'
    });
  });

  it('should show an error message when getProjectDocument fails', () => {
    spyOn(managerService,'getProjectDocument').and.returnValue(throwError({ status: 500 }));
    spyOn(component.authService, 'isNotAuthenticated').and.returnValue(false);
    spyOn(component.authService, 'clearCookiesAndRedirectToLogin');
    spyOn(component.toastService, 'add');
    component.getDocumentsOfProject();
    expect(component.toastService.add).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error'
    });
    expect(component.authService.isNotAuthenticated).toHaveBeenCalledWith(500);
    expect(component.authService.clearCookiesAndRedirectToLogin).not.toHaveBeenCalled();
  });

  it('should clear cookies and redirect to login page when getProjectDocument fails with 401 status code', () => {
    spyOn(managerService,'getProjectDocument').and.returnValue(throwError({ status: 401 }));
    spyOn(component.authService, 'isNotAuthenticated').and.returnValue(true);
    spyOn(component.authService, 'clearCookiesAndRedirectToLogin');
    spyOn(component.toastService, 'add');
    component.getDocumentsOfProject();
    expect(component.authService.isNotAuthenticated).toHaveBeenCalledWith(401);
    expect(component.authService.clearCookiesAndRedirectToLogin).toHaveBeenCalled();
    expect(component.toastService.add).not.toHaveBeenCalled();
  });  

});
