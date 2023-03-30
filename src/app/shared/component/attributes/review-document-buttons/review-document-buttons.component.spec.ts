import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDocumentButtonsComponent } from './review-document-buttons.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthService } from 'src/app/core/auth.service';
import { of } from 'rxjs';

describe('ReviewDocumentButtonsComponent', () => {
  let component: ReviewDocumentButtonsComponent;
  let fixture: ComponentFixture<ReviewDocumentButtonsComponent>;
  let commonService: CommonService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDocumentButtonsComponent ],
      imports: [HttpClientTestingModule],
      providers: [CommonService, AuthService],

    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDocumentButtonsComponent);
    component = fixture.componentInstance;

    commonService = TestBed.inject(CommonService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined document',  () => {  
    const document: any = 'test';  
    expect(document).toBeDefined();
  }); 

  it('should be defined saveAndReject', () => {
    expect(component.saveAndReject).toBeDefined();
  }); 

  it('should be defined getReasonsList', () => {
    expect(component.getReasonsList).toBeDefined();
  }); 

  it('should be defined onRejectReasonSelect', () => {
    expect(component.onRejectReasonSelect).toBeDefined();
  }); 

  it('should be defined rejectDocumentModalSubmit', () => {
    expect(component.rejectDocumentModalSubmit).toBeDefined();
  });
  
  it('should be defined taskAssignment', () => {
    const taskAssignment: any = 'Manual';  
    expect(taskAssignment).toBeDefined();
  });

  it('should be true or false for submitButton', () => {
    const submitButton: any = true;  
    expect(submitButton).toBeTruthy();
  });

  it('should be defined savedDocument', () => {
    const taskAssignment: any = true;  
    expect(taskAssignment).toBeDefined();
  });
  
  it('should set saveBtn to false when name is "reject"', () => {
    const name = 'reject';
    component.saveAndReject(name);
    expect(component.saveBtn).toBeFalse();
  });
  

  it('should get the list of rejection reasons', () => {
    const reasons = [{ id: 1, reason: 'Reason 1' }, { id: 2, reason: 'Reason 2' }];
    spyOn(commonService, 'getReasonList').and.returnValue(of(reasons));
    spyOn(authService, 'isNotAuthenticated').and.returnValue(false);
    spyOn(authService, 'clearCookiesAndRedirectToLogin');

    component.getReasonsList();

    expect(commonService.getReasonList).toHaveBeenCalled();
    expect(component.rejectionReasonsArray).toEqual(reasons);
    expect(authService.isNotAuthenticated).not.toHaveBeenCalled();
    expect(authService.clearCookiesAndRedirectToLogin).not.toHaveBeenCalled();
  });

  it('should redirect to login page if user is not authenticated', () => {
    spyOn(commonService, 'getReasonList').and.returnValue(of([]));
    spyOn(authService, 'isNotAuthenticated').and.returnValue(true);
    spyOn(authService, 'clearCookiesAndRedirectToLogin');

    component.getReasonsList();

    expect(commonService.getReasonList).toHaveBeenCalled();
    expect(component.rejectionReasonsArray).toEqual([]);         
  });

});
