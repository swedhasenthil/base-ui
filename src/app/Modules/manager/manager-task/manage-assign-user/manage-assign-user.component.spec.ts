import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ManagerService } from '../../manager.service';
import { ManageAssignUserComponent } from './manage-assign-user.component';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

describe('ManageAssignUserComponent', () => {
  let component: ManageAssignUserComponent;
  let fixture: ComponentFixture<ManageAssignUserComponent>;

 
  let managerService: ManagerService;
  let authService: AuthService;
  let toastService: ToasterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAssignUserComponent ],
      imports: [HttpClientModule],
      providers: [ManagerService, AuthService, ToasterService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAssignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAssignUserComponent);
    component = fixture.componentInstance;
    managerService = TestBed.inject(ManagerService);
    authService = TestBed.inject(AuthService);
    toastService = TestBed.inject(ToasterService);
    spyOn(managerService, 'fetchUsersOfGivenRoleAndProject').and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getRoles', () => {
    expect(component.getRoles).toBeDefined();
  });  

  it('should set roles property and sort it correctly', () => {
    const mockDocument = { 
      _id: '123', 
      user_id: { _id: '456' },
      document_status: 'status_qc'
    };
    const mockObservable = of([{ is_locked: true }]);
    spyOn(managerService, 'fetchADocumentById').and.returnValue(mockObservable);
  
    component.rolesForDocsWaitingForQcReview = [    { role_name: 'role1' },    { role_name: 'role3' },    { role_name: 'role2' }  ];
    component.rolesForDocsWaitingForAnalystReview = [    { role_name: 'role4' },    { role_name: 'role6' },    { role_name: 'role5' }  ];
  
    component.configureAssignmentLookup(mockDocument);
  
    expect(component.roles).toBeDefined();
    expect(component.roles.length).toBe(3);
    expect(component.roles[0].role_name).toBe('role1');
    expect(component.roles[1].role_name).toBe('role2');
    expect(component.roles[2].role_name).toBe('role3');
  });

  it('should invoke reassign API if user_id is defined', () => {
    // Arrange
    const updatedDoc = { someProperty: 'someValue' };
    spyOn(managerService, 'reAssignUserToThisDocument').and.returnValue(of(updatedDoc));
    spyOn(toastService, 'add');
    spyOn(component.sharedService, 'getAllNotificationsOfUser');
  
    const payload = {
      'document_id': 123,
      'user_id': 456,
      'role_to_be_assigned': 789,
      'force_reassign': true
    };
    component.selectedDocument = {
      _id: 123,
      user_id: {
        _id: 456
      }
    };
    component.selectedUserId = 456;
    component.selectedRoleId = 789;
    component.selectedForce = true;
  
    // Act
    component.assignOrReassign();
  
    // Assert
    expect(managerService.reAssignUserToThisDocument).toHaveBeenCalledWith(payload);
    expect(toastService.add).toHaveBeenCalledWith({
      type: 'success',
      message: "User has been re-assigned to this document"
    });
    expect(component.sharedService.getAllNotificationsOfUser).toHaveBeenCalledWith(false);
  });
    
  it('should invoke assign API if user_id is not defined', () => {
    // Arrange
    const updatedDoc = { someProperty: 'someValue' };
    spyOn(managerService, 'assignUserToThisDocument').and.returnValue(of(updatedDoc));
    spyOn(toastService, 'add');
    spyOn(component.sharedService, 'getAllNotificationsOfUser');
  
    const payload = {
      'document_id': 123,
      'user_id': 456,
      'role_to_be_assigned': 789
    };
    component.selectedDocument = {
      _id: 123
    };
    component.selectedUserId = 456;
    component.selectedRoleId = 789;
  
    // Act
    component.assignOrReassign();
  
    // Assert
    expect(managerService.assignUserToThisDocument).toHaveBeenCalledWith(payload);
    expect(toastService.add).toHaveBeenCalledWith({
      type: 'success',
      message: "User has been assigned to this document"
    });
    expect(component.sharedService.getAllNotificationsOfUser).toHaveBeenCalledWith(true);
  }); 

  it('should fetch assignees for selected role and project', () => {
    const roleId = 1;
    const assignees = [{ id: 1, name: 'User 1' }];
    spyOn(authService, 'isNotAuthenticated').and.returnValue(false);
    spyOn(component, 'getFilteredAssignees').and.returnValue(assignees);

    component.fetchUserForThisRoleForAProject({ target: { value: roleId } });

    expect(managerService.fetchUsersOfGivenRoleAndProject).toHaveBeenCalledWith(roleId, component.selectedProjectId);
    expect(component.assignees).toEqual(assignees);
  });  

  it('should handle server error', () => {
    const error = { status: 500, error: { message: 'Internal Server Error' } };
    spyOn(authService, 'isNotAuthenticated').and.returnValue(false);
    spyOn(component, 'getFilteredAssignees').and.returnValue([]);
    spyOn(toastService, 'add');

    component.fetchUserForThisRoleForAProject({ target: { value: 1 } });

    expect(managerService.fetchUsersOfGivenRoleAndProject).toHaveBeenCalledWith(1, component.selectedProjectId);
    expect(component.assignees).toEqual([]);  
  });


});
