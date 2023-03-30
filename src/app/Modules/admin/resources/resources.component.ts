import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChildren, ViewChild, ElementRef,
  QueryList,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  UntypedFormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
// import { OverlayService } from 'src/app/services/overlay.service';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { LoaderService } from '../../../shared/services/loader.service';
/* import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop'; */
import { AuthService } from 'src/app/core/auth.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  searchUsergroupUsers: any;
  searchOtherUsers: any;
  userGroupsData: any=[];
  filteredUserGroupsData: any;
  userDomainsData: any;
  userData: any;
  otherUserData: any;
  rolesObject: any = [];
  skillsObject = {};
  groupsObjectById: any;
  groupsObjectByName: any = [];
  domainsObject: any = [];
  addUserForm: UntypedFormGroup;
  createGroupForm: UntypedFormGroup;
  createDuplicateGroupForm: UntypedFormGroup;
  deleteUserGroupId = '';
  deleteUserGroupName = '';
  deleteUserId = '';
  deleteUserName = '';
  clickedUserEmpId = '';
  clickedUserUsername = '';
  clickedUserEmailId = '';
  clickedUserId = '';
  loggedUser: string;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();
  selectedItem: any;
  role_ids: any = [];
  role_idsInEditUser: any = [];
  public multiple_userandrole: any[] = [
    {
      group: '',
      role: 0,
    },
  ];
  public multiple_grouprolesinedituser: any[] = [
    {
      group: '',
      role: '',
    },
  ];
  userList: any;
  duplicateUserGroupName: any;
  duplicateUserGroupId: any;
  duplicateUserGroupDomainId: any;
  editUserGroupForm: UntypedFormGroup;
  editUserForm: UntypedFormGroup;
  editUserGroupObject: any = [];
  editUserObject = {};
  userGroupName = '';
  userGroupIdForUserStatus: any;
  addUserInGroupForm: UntypedFormGroup;
  itemsarray: any[];
  itemsarray1: any[];
  selecteditems: any[];
  selectedRowIds: Set<number> = new Set<number>();
  selectedRowIds1: Set<number> = new Set<number>();
  checkUserGroupName = '';
  dropdownList: any;
  selectedItems = [];
  dropdownSettings = {};
  groupToRemove: any;
  isdisabled: boolean = false;
  userGroupId: any;
  userGroupIdInEditUser: any;
  groupId_and_roleId = {};
  groupId_and_roleIdInEditUser: any = {};
  clone = {};
  groupAndRolesArray: any = [];
  groupAndRolesArrayInEditUser: any = [];
  nextgroupAndRolesArray: any = [];
  objCount: number = 0;
  objCountInEditUser: number = 0;
  selectedUserListInOtherUsers: any = [];
  selectedOtherUsers: any;
  selectedGroupUsers: any;
  totalUserCount: any;
  tempUserList: any;
  userToAdded: any;
  userToAddedIds: any;
  userToRemoved: any;
  userToRemovedIds: any;
  selectedUserGroupId = '';
  clickedUserGroupsAndRoles: any;
  clickedUserProjectArray: any;
  clickedUsersGroupId: '';
  clickedUsersRoleIds: any = [];
  clickedUsersGroupIdAndRoleIds: any = [];
  addUserGroupAndRoleFlagInEditUser: boolean = false;
  validEditedUserData = true;

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  selectedGroups: any = [];
  formInvalid: any = false;
  selectAll: boolean = true;
  existingGroupsOfUserToBeEdited: any = [];
  selecteduserGroupName: any
  userGroupList: boolean;
  userListData: boolean;
  term: any;
  isCheckLeft: boolean = false;
  disableLeft: boolean = false;
  disableRight: boolean = false;
  // leftChekedAttributes:any=[];
  selectedColumn: any[];
  isCheckAll: any = false;
  isCheckAlls: any = false;
  leftAttributeList: any = [];
  rightAttributeList: any = [];

  leftChekedAttributes: any = [];
  rightChekedAttributes: any = [];
  user: any;

  @ViewChildren("checkbox") checkbox: any;
  @ViewChildren("checkboxRight") checkboxRight: any;

  @ViewChildren('leftCheckedBoxs') leftCheckedBoxs: any;
  @ViewChildren('rightCheckedBoxs') rightCheckedBoxs: any;
  @ViewChild('leftAllCheckBox') leftAllCheckBox: ElementRef;
  @ViewChild('rightAllCheckBox') rightAllCheckBox: ElementRef;
  @ViewChild('cancalModal') cancalModal: ElementRef;
  @ViewChild('cancelCreateNewgroup') cancelCreateNewgroup: ElementRef;
  @ViewChild('cancelAddNewUser') cancelAddNewUser: ElementRef;
  editRow: boolean;

  constructor(
    private http: HttpClient,
    // private overlay: OverlayService,
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private adminService: AdminService,
    private authService: AuthService,
    public toastService: ToasterService,
    private loaderService: LoaderService,
    private sharedService:SharedService
  ) {
    this.getUserGroupsFromBackend();
    /* this.titleService.setTitle('Skense - Admin'); */
  }

  ngOnInit(): void {
    this.sharedService.adminMenuChanges();
    this.dtOptions[0] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
      scrollX: true, scrollCollapse: true,
      columnDefs: [{
        'targets': [6], // column index (start from 0)
        'orderable': false, // set orderable false for selected columns
      }],
    };
  
    // this.loggedUser = localStorage.getItem('user');
    this.selecteduserGroupName = "User Groups";
    this.userGroupList = true;
    this.userListData = false;
    this.addUserForm = new UntypedFormGroup({
      employeeId: new UntypedFormControl(null, [Validators.required]),
      userName: new UntypedFormControl(null, [Validators.required]),
      emailId: new UntypedFormControl(null, [Validators.required, Validators.email]),
      // assignRole: new FormControl(null, [Validators.required]),
      assignGroupDropdown: new UntypedFormControl(null, [Validators.required]),
    });
    this.createGroupForm = new UntypedFormGroup({
      groupName: new UntypedFormControl(null, [Validators.required]),
      domainDropdown: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
    });
    this.editUserGroupForm = this.fb.group({
      editGroupName: [null, [Validators.required]],
      editdomainDropdown: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
 
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'role_name',
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.addNewUsergroup();
  }


  // get all roles
  getRolesFromBackend() {
    this.adminService.getRoles().subscribe(
      (data) => {
        this.dropdownList = data;
        const rolesDataArray: any = data;
        rolesDataArray.forEach((element: any) => {
          this.rolesObject[element.role_name] = element._id;
        });
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
      }
    );
  }

  // Get user-groups
  getUserGroupsFromBackend() {
   
  this.loaderService.show();
    this.adminService.getUserGroups().subscribe(
      (data) => {
        this.userGroupsData = data;
        this.rerender();
        this.filteredUserGroupsData = this.userGroupsData;
        const userGroupDataArray: any = data;
        this.groupsObjectById = [];
        this.loaderService.hide();
        userGroupDataArray.forEach((element: any) => {
          if (element._id) {
            this.groupsObjectById[element._id] = element.user_group_name;
            this.groupsObjectByName[element.user_group_name] = element._id;
          }
        });
      },

      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
      }
    );

  }

  // on click of users count
  onUserListInGroupNumberClick(usergroup: any) {
    this.userGroupIdForUserStatus = usergroup._id;
    this.userGroupName = usergroup.user_group_name;
    this.userList = usergroup.users;
  }

  //on change toggle between of group status
  changeGroupStatus(inputElement: any, project: any) {
    const request = {
      id: project._id,
      status: '',
    };
    if (inputElement.checked) {
      request['status'] = 'active';
    } else {
      request['status'] = 'inactive';
    }
    this.adminService.editUserGroup(request).subscribe(
      (dataResult) => {
        const updateUserGroupStatusResponse: any = dataResult;
        if (!updateUserGroupStatusResponse.error) {
          this.toastService.add({
            type: 'success',
            message: "User group status updated Succesfully!"
          })
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User group status cannot update'
        });
      }
    );
  }

  //on change toggle between of user status at group level
  onUserStatusChangeForGroup(inputElement: any, user: any) {
    const request = {
      user_id: user._id,
      group_id: this.userGroupIdForUserStatus,
      status: '',
    };

    if (inputElement.checked) {
      request['status'] = 'active';
    } else {
      request['status'] = 'inactive';
    }
    this.adminService.userStatusForGroup(request).subscribe(
      (data) => {
        const updateUserStatusResponse: any = data;
        if (!updateUserStatusResponse.error) {
          this.toastService.add({
            type: 'success',
            message: "User status updated Succesfully!"
          })

        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User status cannot update'
        });
      }
    );
  }


  // Get Domain
  getDomainsFromBackend() {
    this.adminService.getDomain().subscribe(
      (data) => {
        this.userDomainsData = data;
        const domainResponseDataArray: any = data;
        domainResponseDataArray.forEach((element: any) => {
          this.domainsObject[element.domain_name] = element._id;
        });
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });

      }
    );
  }


  // on cancel button click of create group form
  createGroupFormCancelClick() {
    this.createGroupForm.reset();
  }

  // on cancel button click of create duplicate group form
  createDulicateGroupFormCancelClick() {
    this.createDuplicateGroupForm.reset();
  }

  // on submit button click of add new user group
  onCreateGroupSubmit() {
    const httpRequestBody = {
      user_group_name: this.createGroupForm.value.groupName,
      domain_id: this.domainsObject[this.createGroupForm.value.domainDropdown],
      description: this.createGroupForm.value.description,
      status: 'active',
    };
    this.adminService.createUserGroups(httpRequestBody).subscribe(
      (data) => {
        const createGroupResponse: any = data;
        if (createGroupResponse.error) {
          this.toastService.add({
            type: 'error',
            message: 'User Group already exists. Try with a different name!'
          });
        } else {
          this.toastService.add({
            type: 'success',
            message: "User Group Created Succesfully!"
          })
        }
        this.cancelCreateNewgroup.nativeElement.click();
        this.getUserGroupsFromBackend();
        this.createGroupForm.reset();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User group name already exists'
        });
      }
    );
  }

  // on click of submit in add user form
  onAddUserSubmit() {
    if (this.objCount == 0 || this.objCount == 1) {
      this.groupAndRolesArray.push(this.groupId_and_roleId);
    }

    if (this.objCount == 2) {
      this.groupAndRolesArray = this.groupAndRolesArray;
    }

    const httpRequestBody = {
      employee_id: this.addUserForm.value.employeeId,
      user_name: this.addUserForm.value.userName,
      email_id: this.addUserForm.value.emailId,
      groups_and_roles: this.groupAndRolesArray,
      status: 'active',
    };
    this.adminService.addUser(httpRequestBody).subscribe(
      (data) => {
        const addUserResponse: any = data;
        if (addUserResponse.error) {
          this.toastService.add({
            type: 'error',
            message: 'User cannot be created. ' + addUserResponse.message
          });
        } else {
          this.toastService.add({
            type: 'success',
            message: "User Created Succesfully!"
          })
        }
        this.cancelAddNewUser.nativeElement.click();
        this.getUsersFromBackend();
        this.getUsergroups();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User cannot be created.'
        });
        this.getUsersFromBackend();
        this.getUsergroups();
      }
    );
  }

  // on click of user group tab, on cross icon/cancel button of add user form
  getUsergroups() {
    this.addUserForm.reset();
    // this.getUserGroupsFromBackend();
  }

  // on click users tab
  /* getUsers() {
    this.getUsersFromBackend();
  } */



  // Get Users
  getUsersFromBackend() {
    // this.overlay.activateOverlay(true, 'sk-circle');
    this.loaderService.show();

    this.dtOptions[1] = {
      order: [[0, 'desc']],
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, 'All'],
      ],
      scrollY: '150vh', /// This is resulting in an error. Appears to be a DataTables bug
      scrollX: true, scrollCollapse: true,
      columnDefs: [{
        'targets': [5], // column index (start from 0)
        'orderable': false, // set orderable false for selected columns
      }],
    };
    this.adminService.getUser().subscribe(
      (data) => {
        this.userData = data;
        this.rerender();
        // Remove rejected users
        this.userData = this.userData.filter(
          (user: any) => user.status !== 'rejected'
        );
        /* setTimeout(() => {
          this.overlay.activateOverlay(false, '');
        }, 500); */
        this.loaderService.hide();

      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
      }
    );
  }

  checkEmpty() {
    var errorMsg = '';
    if (
      this.addUserForm.value.employeeId == null ||
      this.addUserForm.value.employeeId == ''
    ) {
      errorMsg += 'Employee ID, \n';
    }
    if (
      this.addUserForm.value.userName == null ||
      this.addUserForm.value.userName == ''
    ) {
      errorMsg += 'User Name, \n';
    }
    if (
      this.addUserForm.value.emailId == null ||
      this.addUserForm.value.emailId == ''
    ) {
      errorMsg += 'Emai ID, \n';
    } else {
      const email =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!email.test(String(this.addUserForm.value.emailId).toLowerCase())) {
        errorMsg += 'email ID, \n';
      }
    }
    let group = this.multiple_userandrole.filter((item) => item.group == '');
    if (group.length > 0) {
      errorMsg += 'Select Group, \n';
    }
    let Role = this.multiple_userandrole.filter((item) => item.role == 0);
    if (Role.length > 0) {
      errorMsg += 'Select Role, \n';
    }
    if (errorMsg != '') {
      this.formInvalid = false;
      return false;
    } else {
      return this.formInvalid = true;
    }
  }


  // on click of +(plus) icon in add user form
  adduserandrole() {
    this.multiple_userandrole.push({
      group: '',
      role: 0,
    });
    this.groupAndRolesArray.push(this.groupId_and_roleId);
    this.role_ids = [];
    this.objCount = 1;
 
    this.checkEmpty();
  }

  // on click of -(minus) icon in add user form
  removeuserandrole(i: number) {
    this.multiple_userandrole.splice(i, 1);
    this.groupAndRolesArray.splice(i, 1);
    this.objCount = 2;
    this.updateSelectedGroups(null, i);
    this.checkEmpty();
  }


  // on change og group dropdown
  selectedGroupInDropdown(event: any, i: any) {
    const userGroupName = this.addUserForm.value.assignGroupDropdown;
    this.userGroupId = this.groupsObjectByName[userGroupName];
    this.updateSelectedGroups(event, i);
    this.multiple_userandrole[i].group = this.userGroupId;
    this.checkEmpty();
  }

  // called when the function is getting called
  updateSelectedGroups(event: any, index: any) {
    if (event) {
      this.selectedGroups[index] = event.target.value;
    } else {
      this.selectedGroups[index] = null;
    }
    this.userGroupsData.forEach((group: any) => {
      if (
        Object.values(this.selectedGroups).indexOf(group.user_group_name) != -1
      ) {
        group.isdisabled = true;
      } else {
        group.isdisabled = false;
      }
    });
  }


  // called on where this.rerender() called
  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      }
    });
    this.dtTrigger.next(null);
    this.dtTrigger1.next(null);
  }


  // on click of duplicate group icon click
  onCreateDuplicateGroupIconClick(usergroup: any) {
    this.duplicateUserGroupName = usergroup.user_group_name + ' - copy';
    this.duplicateUserGroupId = usergroup._id;
    this.duplicateUserGroupDomainId = usergroup.domain_id._id;
  }

  // on submit button click of duplicate group form
  onCreateDuplicateGroupSubmit() {
    // this.overlay.activateOverlay(true, 'sk-circle');
    const httpRequestBody = {
      user_group_name: this.duplicateUserGroupName,
      domain_id: this.duplicateUserGroupDomainId,
      ref_group: this.duplicateUserGroupId,
    };
    this.adminService.createDuplicateUserGroups(httpRequestBody).subscribe(
      (data) => {
        const createDuplicateGroupResponse: any = data;
        if (!createDuplicateGroupResponse.error) {
          // this.overlay.activateOverlay(false, '');

          this.toastService.add({
            type: 'success',
            message: "User Group Created Succesfully!"
          })
        }
        this.getUserGroupsFromBackend();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        // this.overlay.activateOverlay(false, '');

        this.toastService.add({
          type: 'error',
          message: 'User group name already exists'
        });
        this.getUserGroupsFromBackend();
      }
    );
  }

  // Delete User Group
  onDeleteGroupIconClick(userGroup: any) {
    this.deleteUserGroupId = userGroup._id;
    this.deleteUserGroupName = userGroup.user_group_name;
  }
  // on delete user group button click
  onDeleteGroupClick() {
    this.adminService.deleteUserGroup({ user_group_id: this.deleteUserGroupId })
      .subscribe(
        (data) => {
          const deleteUsergroupResponse: any = data;
          if (!deleteUsergroupResponse.error) {
            this.toastService.add({
              type: 'success',
              message: "User Group deleted Succesfully!"
            })
          }
          this.getUserGroupsFromBackend();
        },
        (err) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          this.toastService.add({
            type: 'error',
            message: 'User group cannot delete'
          });
          this.getUserGroupsFromBackend();
        }
      );
  }

  // on click of edit group icon click
  onCreateEditGroupIconClick(usergroup: any) {
    this.editUserGroupObject = usergroup;
    this.checkUserGroupName = usergroup.user_group_name;
    this.editUserGroupForm.patchValue({
      editGroupName: usergroup.user_group_name,
    });
    this.editUserGroupForm.patchValue({
      editdomainDropdown: usergroup.domain_id._id,
    });
    this.editUserGroupForm.patchValue({ description: usergroup.description });
  }


  // on click of submit button edit user group form
  onEditUserGroupSubmit() {
    // this.overlay.activateOverlay(true, 'sk-circle');
    // Edit Call
    if (this.editUserGroupForm.value.editGroupName == this.checkUserGroupName) {
      const request = {
        id: this.editUserGroupObject['_id'],
        description: this.editUserGroupForm.value.description,
        domain_id: this.editUserGroupForm.value.editdomainDropdown,
      };
      this.adminService.editUserGroup(request).subscribe(
        (data) => {
          this.ngOnInit();
          /* setTimeout(() => {
            this.overlay.activateOverlay(false, '');
          }, 500); */
        },
        (err) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          /* setTimeout(() => {
            this.overlay.activateOverlay(false, '');
          }, 500); */
          this.toastService.add({
            type: 'error',
            message: 'User group name already exists'
          });
        }
      );
    } else {
      const request = {
        id: this.editUserGroupObject['_id'],
        user_group_name: this.editUserGroupForm.value.editGroupName,
        description: this.editUserGroupForm.value.description,
        domain_id: this.editUserGroupForm.value.editdomainDropdown,
      };
      this.adminService.editUserGroup(request).subscribe(
        (data) => {
          this.ngOnInit();
          /* setTimeout(() => {
            this.overlay.activateOverlay(false, '');
          }, 500); */
        },
        (err) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
          /* setTimeout(() => {
            this.overlay.activateOverlay(false, '');
          }, 500); */
          this.toastService.add({
            type: 'error',
            message: 'User group name already exists'
          });
        }
      );
    }
  }

  onProjectChange(value: any) {
    if (value == 1) {
      this.userGroupList = true;
      this.userListData = false;
      this.selecteduserGroupName = "User Groups";
      this.getUserGroupsFromBackend();
    } else {
      this.userGroupList = false;
      this.userListData = true;
      this.selecteduserGroupName = "Users";
      this.getUsersFromBackend();
    }
  }

  // on project count click
  onProjectCountClick(user: any) {
    this.adminService.getUserDetailsbyId({ user_id: user._id }).subscribe(
      (data) => {
        const updateUserGroupStatusResponse: any = data;
        this.clickedUserEmpId = updateUserGroupStatusResponse.employee_id;
        this.clickedUserUsername = updateUserGroupStatusResponse.user_name;
        this.clickedUserEmailId = updateUserGroupStatusResponse.email_id;
        this.clickedUserProjectArray = updateUserGroupStatusResponse.projects;
 
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'Something went wrong, could not process your request'
        });
      }
    );
  }

  // Delete User
  onDeleteUserIconClick(user: any) {
    this.deleteUserId = user._id;
    this.deleteUserName = user.user_name;
  }

  // on delete user button click
  onDeleteUserClick() {
    this.adminService.deleteUser({ user_id: this.deleteUserId }).subscribe(
      (data) => {
        const deleteUserResponse: any = data;
        if (!deleteUserResponse.error) {
          this.toastService.add({
            type: 'success',
            message: "User deleted Succesfully!"
          })
        }
        this.getUsersFromBackend();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User cannot delete'
        });
        this.getUsersFromBackend();
      }
    );
  }

  // on click of edit icon of user
  onEditUserIconClick(user: any) {
    this.selectedGroups = {};
    this.existingGroupsOfUserToBeEdited = [];
    this.multiple_grouprolesinedituser = [];
    this.editUserObject = user;
    this.clickedUserId = user._id;
    this.clickedUserEmpId = user.employee_id;
    this.clickedUserUsername = user.user_name;
    this.clickedUserEmailId = user.email_id;
    this.clickedUserGroupsAndRoles = JSON.parse(
      JSON.stringify(user.groups_and_roles)
    );
    this.clickedUserGroupsAndRoles.forEach((e: any, i: any) => {
      this.selectedGroups[i] = e.group.user_group_name;
    });
    this.userGroupsData.forEach((group: any) => {
      if (
        Object.values(this.selectedGroups).indexOf(group.user_group_name) != -1
      ) {
        group.isdisabled = true;
      } else {
        group.isdisabled = false;
      }
    });
    this.clickedUserGroupsAndRoles.forEach((e: any) => {
      this.existingGroupsOfUserToBeEdited.push(e.group.user_group_name);
    });
    this.groupId_and_roleIdInEditUser = {};
  }
  updateUserGroups(groupId: any, index: any) {
 
    let selectedGroupName = this.getSelectedGroupNameKey(groupId.target.value);
    this.selectedGroups[index] = selectedGroupName;
    this.updateGroupSelectionFlag(
      this.existingGroupsOfUserToBeEdited[index],
      selectedGroupName
    );
    this.existingGroupsOfUserToBeEdited[index] = selectedGroupName;
  }

  deleteSelectedUserGroup(index: any) {
    delete this.selectedGroups[index];
  }



  getSelectedGroupNameKey(groupId: any) {
    return this.userGroupsData.find((group: any) => group._id == groupId)
      .user_group_name;
  }

  updateGroupSelectionFlag(prevGroupName: any, curGroupName: any) {
    this.userGroupsData.forEach((e: any) => {
      if (e.user_group_name == prevGroupName) {
        e.isdisabled = false;
      }
      if (e.user_group_name == curGroupName) {
        e.isdisabled = true;
      }
    });
  }

  //on change of option in usergroup dropdown
  selectedGroupInDropdownInEditUser(id: any, index: any) {
    let prevGroupName = null;
    let curGroupName = null;
    let selectedGroupIndex = -1;
    this.userGroupIdInEditUser = id.target.value;
    curGroupName = this.getSelectedGroupNameKey(id.target.value);
    selectedGroupIndex =
      this.existingGroupsOfUserToBeEdited.length - 1 + index + 1;
    if (
      !(
        Object.keys(this.selectedGroups).length ==
        this.existingGroupsOfUserToBeEdited.length
      )
    ) {
      prevGroupName = this.selectedGroups[selectedGroupIndex];
    }
    this.selectedGroups[selectedGroupIndex] = curGroupName;
    this.updateGroupSelectionFlag(prevGroupName, curGroupName);
    // if(this.clickedUsersGroupIdAndRoleIds[index]){
    //   this.clickedUsersGroupIdAndRoleIds[index]["group"] = id;
    // }else{
    //  this.groupId_and_roleIdInEditUser["group"] = id;
    // }
    this.isEditUserDataValid();
  }

  isEditUserDataValid() {
    this.validEditedUserData = true;

    if (this.clickedUsersGroupIdAndRoleIds) {
      this.clickedUsersGroupIdAndRoleIds.forEach((element: any) => {
        if (!element.group || !element.roles || element.roles.length == 0) {
          this.validEditedUserData = false;
        }
      });
    }

    if (this.clickedUserGroupsAndRoles) {
      this.clickedUserGroupsAndRoles.forEach((element: any) => {
        if (
          !element.group ||
          !element.group._id ||
          !element.roles ||
          element.roles.length == 0
        ) {
          this.validEditedUserData = false;
        }
      });
    }

    if (
      Object.keys(this.groupId_and_roleIdInEditUser).length > 0 &&
      (this.groupId_and_roleIdInEditUser != '' ||
        this.groupId_and_roleIdInEditUser['roles'].length > 0)
    ) {
      if (
        !this.groupId_and_roleIdInEditUser['group'] ||
        !this.groupId_and_roleIdInEditUser['roles'] ||
        this.groupId_and_roleIdInEditUser['roles'].length == 0
      ) {
        this.validEditedUserData = false;
      }
    }
    return this.validEditedUserData;
  }

  //on select of roles in edit user
  onItemSelectInEditUser(item: any) {
    this.role_idsInEditUser.push(item._id);
    this.groupId_and_roleIdInEditUser = {
      roles: this.role_idsInEditUser,
      group: this.userGroupIdInEditUser,
    };
    this.isEditUserDataValid();
  }

  //on deselect of roles in edit user
  onDeSelectInEditUser(roleToRemove: any) {
    this.role_idsInEditUser = this.role_idsInEditUser.filter(
      (item: any) => item !== roleToRemove._id
    );
    this.groupId_and_roleIdInEditUser = {
      group: this.userGroupIdInEditUser,
      roles: this.role_idsInEditUser,
    };
    this.isEditUserDataValid();
  }


  //on click of delete icon
  removeUsersGroupAndRoleInEditUser(i: any) {
    this.multiple_grouprolesinedituser.splice(i, 1);
    this.clickedUsersGroupIdAndRoleIds.splice(i, 1);
    this.objCountInEditUser = 2;

    let prevGroupName = null;
    let selectedGroupIndex = -1;
    selectedGroupIndex = this.existingGroupsOfUserToBeEdited.length - 1 + i + 1;
    if (
      !(
        Object.keys(this.selectedGroups).length ==
        this.existingGroupsOfUserToBeEdited.length
      )
    ) {
      prevGroupName = this.selectedGroups[selectedGroupIndex];
    }
    this.updateGroupSelectionFlag(prevGroupName, null);
    this.deleteSelectedUserGroup(selectedGroupIndex);
    this.isEditUserDataValid();
    this.editRow = true;
  }

  //on click of + (plus) icon
  addUsersGroupAndRoleInEditUser() {
    this.multiple_grouprolesinedituser.push({
      group: '',
      role: '',
    });
    if (Object.keys(this.groupId_and_roleIdInEditUser).length != 0) {
      this.clickedUsersGroupIdAndRoleIds.push(
        this.groupId_and_roleIdInEditUser
      );
    }
    this.groupId_and_roleIdInEditUser = {
      group: '',
      role: [],
    };
    this.role_idsInEditUser = [];
    this.objCountInEditUser = 1;
    this.isEditUserDataValid();
  }

  // on click of delete icon
  removeUsersGroupAndRole(i: number) {
    this.updateGroupSelectionFlag(this.existingGroupsOfUserToBeEdited[i], null);
    this.existingGroupsOfUserToBeEdited.splice(i, 1);
    this.clickedUserGroupsAndRoles.splice(i, 1);
    this.clickedUsersGroupIdAndRoleIds.splice(i, 1);
    this.objCountInEditUser = 2;
    this.deleteSelectedUserGroup(i);
  }


  //on click of submit button of edit user
  onEditUserSubmit() {
    if (
      this.clickedUsersGroupIdAndRoleIds.length > 0 &&
      !this.clickedUsersGroupIdAndRoleIds[0].roles
    ) {
      this.clickedUsersGroupIdAndRoleIds =
        this.clickedUsersGroupIdAndRoleIds.splice(1);
    }
    this.clickedUserGroupsAndRoles.forEach((e: any) => {
      this.clickedUsersGroupId = e.group._id;
      e.roles.forEach((r: any) => {
        this.clickedUsersRoleIds.push(r._id);
      });
      this.clickedUsersGroupIdAndRoleIds.push({
        roles: this.clickedUsersRoleIds,
        group: this.clickedUsersGroupId,
      });
      this.clickedUsersRoleIds = [];
    });
    if (this.objCountInEditUser == 0) {
      if (Object.keys(this.groupId_and_roleIdInEditUser).length > 0) {
        this.clickedUsersGroupIdAndRoleIds.push(
          this.groupId_and_roleIdInEditUser
        );
      }
    }
    if (this.objCountInEditUser == 1) {
      if (Object.keys(this.groupId_and_roleIdInEditUser).length != 0) {
        this.clickedUsersGroupIdAndRoleIds.push(
          this.groupId_and_roleIdInEditUser
        );
      }
    }

    if (this.objCountInEditUser == 2) {
      this.clickedUsersGroupIdAndRoleIds = this.clickedUsersGroupIdAndRoleIds;
    }

    const request = {
      groups_and_roles: this.clickedUsersGroupIdAndRoleIds,
      user_id: this.clickedUserId,
    };

    this.clickedUsersGroupIdAndRoleIds = [];

    this.adminService.editUserGroupAndRoles(request).subscribe(
      (data) => {
        const addUserResponse: any = data;
        if (addUserResponse.error) {
          this.toastService.add({
            type: 'error',
            message: 'User cannot be Updated. ' + addUserResponse.message
          });
          this.getUsersFromBackend();
        } else {
          this.toastService.add({
            type: 'success',
            message: "User Updated Succesfully!"
          })
          this.getUsersFromBackend();
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User cannot be Update. ' + err.error.message
        });
        this.getUsersFromBackend();
      }
    );
  }

  //on change toggle between of user status
  onUserStatusChange(inputElement: any, user: any) {
    let request = {
      status: '',
      user_id: ''
    };
    if (inputElement.checked) {
      request['status'] = 'active';
    } else {
      request['status'] = 'inactive';
    }
    request['user_id'] = user._id;
    this.adminService.userStatus(request).subscribe(
      (data) => {
        const updateUserStatusResponse: any = data;
        if (!updateUserStatusResponse.error) {
          this.toastService.add({
            type: 'success',
            message: "User status updated Succesfully!"
          })
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User status cannot update'
        });
      }
    );
  }


  // on select of roles in multiselect dropdown
  onItemSelect(item: any, i: any) {
    this.role_ids.push(item._id);
    this.groupId_and_roleId = {
      group: this.userGroupId,
      roles: this.role_ids,
    };
    this.multiple_userandrole[i].role = this.multiple_userandrole[i].role + 1;
    this.checkEmpty();
  }

  // on deselect of roles in multi-select dropdown
  onDeSelect(roleToRemove: any, i: any) {
    this.role_ids = this.role_ids.filter((item: any) => item !== roleToRemove._id);
    this.multiple_userandrole[i].role = this.role_ids.length;
    this.groupId_and_roleId = {
      group: this.userGroupId,
      roles: this.role_ids,
    };
    this.checkEmpty();
  }



  onSelectAll(items: any, i: any) {
    items.forEach((element: any) => {
      this.role_ids.push(element._id);
    });
    this.groupId_and_roleId = {
      group: this.userGroupId,
      roles: this.role_ids,
    };
    this.multiple_userandrole[i].role = items.length;
    this.checkEmpty();
  }

  // on click of add user in group icon click
  onCreateUserInGroupIconClick(usergroup: any) {

    this.leftAttributeList = [];
    this.rightAttributeList = [];
    this.rightChekedAttributes = [];
    this.leftChekedAttributes = [];

    if (this.leftAllCheckBox && this.rightAllCheckBox) {
      this.leftAllCheckBox.nativeElement.checked = false;
      this.rightAllCheckBox.nativeElement.checked = false;
    }

    this.userGroupName = usergroup.user_group_name;
    this.selectedUserGroupId = usergroup._id;
    this.rightAttributeList = JSON.parse(JSON.stringify(usergroup.users));
    this.tempUserList = this.rightAttributeList.map((obj: any) => ({ ...obj }));
    this.totalUserCount = this.userData.length;
    this.leftAttributeList = this.userData.filter(({ user_name: id1 }: any) => !this.rightAttributeList.some(({ name: id2 }: any) => id2 === id1));
  }


  selectLeftAll(event: any) {
    //  var checkedAll = event.target.checked;
    this.selectedColumn = [];
    if (event.checked) {
      this.isCheckAll = true;
      this.isCheckLeft = true;
    }
    else {
      this.isCheckAll = false
      this.isCheckLeft = false;
    }
    if (this.isCheckAll) {
      this.disableLeft = true
      this.leftAttributeList.forEach((item: any) => this.leftChekedAttributes.push(item))

      this.checkbox._results.forEach((element: any) => {
        element.nativeElement.checked = true;
      })
    }
    else {
      this.leftChekedAttributes = [];
      this.checkbox._results.forEach((element: any) => {
        element.nativeElement.checked = false;
      })
    }
  }

  onChangeLeft(name: any, event: any, index: any) {
    if (event.checked) {
      this.disableLeft = true
      this.isCheckLeft = true;
      this.leftChekedAttributes.push(name);
    }
    else {
      this.disableLeft = false
      var Index = this.leftChekedAttributes.findIndex((value: any) => value.user_name == name.user_name);
      this.leftChekedAttributes.splice(Index, 1)

      if (this.leftChekedAttributes.length == 0) {
 
        this.isCheckLeft = false
      }

    }

  }

  val_2: any = [];

  addAtributes() {
    this.leftChekedAttributes.forEach((item: any) => {
      var check = this.rightAttributeList.some((event: any) => event.name == item.user_name);
      if (!check) {
        var data = {
          "name": item.user_name,
          "email": item.email_id,
          "status": item.status,
          "_id": item._id
        }

        this.val_2.push(item);
        this.rightAttributeList.push(data);
        var Index = this.leftAttributeList.findIndex((val: any) => val.user_name == item.user_name);
        this.leftAttributeList.splice(Index, 1)

      }


    });
    this.leftChekedAttributes = [];
    this.isCheckLeft = false;
    this.isCheckAll = false;
  }

  val: any = []

  removeAttributes() {
    this.rightChekedAttributes.forEach((item: any) => {
      var check = this.leftAttributeList.some((event: any) => event.user_name == item.name);

      if (!check) {
        var data = {
          "user_name": item.name,
          "email_id": item.email,
          "status": item.status,
          "_id": item._id
        }
        this.val.push(item);
        this.leftAttributeList.push(data);
        var Index = this.rightAttributeList.findIndex((event: any) => event.name == item.name);
        this.rightAttributeList.splice(Index, 1)


      }
    });
    this.rightChekedAttributes = [];
    this.disableRight = false;
    this.isCheckAlls = false;
  }

  selectRightAll(event: any) {
    //  var checkedAll = event.target.checked;
    this.selectedColumn = [];
    if (event.checked) {
      this.isCheckAlls = true;
    }
    else {
      this.isCheckAlls = false
    }
    if (this.isCheckAlls) {
      this.disableRight = true
      this.rightAttributeList.forEach((item: any) => this.rightChekedAttributes.push(item))
      this.checkboxRight._results.forEach((element: any) => {
        element.nativeElement.checked = true;
      })
    }
    else {
      this.disableRight = false
      this.rightChekedAttributes = [];
      this.checkboxRight._results.forEach((element: any) => {
        element.nativeElement.checked = false;
      })
    }

  }

  onChangeRight(name: any, event: any, index: any) {
    if (event.checked) {
      this.disableRight = true
      this.rightChekedAttributes.push(name);
      // this.selectAll()
    }
    else {
      var Index = this.rightChekedAttributes.findIndex((value: any) => value.name == name.name);
      this.rightChekedAttributes.splice(Index, 1)
      if (this.rightChekedAttributes.length == 0) {
        this.disableRight = false
      }
    }
  }

  addAndRemoveUsers() {
    this.userToAdded = this.val_2.filter(({ name: id1 }: any) => !this.tempUserList.some(({ name: id2 }: any) => id2 === id1));
    this.userToAddedIds = this.userToAdded.map((a: any) => a._id);
    this.userToRemoved = this.val.filter(({ user_name: id1 }: any) => !this.tempUserList.some(({ name: id2 }: any) => id2 === id1));
    this.userToRemovedIds = this.userToRemoved.map((a: any) => a._id);

    let addedUser = this.rightAttributeList.map((item: any) => item._id);
    let deletedUser = this.leftAttributeList.map((item: any) => item._id)

    const httpRequestBody = {
      users_to_be_added: addedUser,
      users_to_be_removed: deletedUser,
      user_group_id: this.selectedUserGroupId,
    };


    this.adminService.addAndRemoveUserInGroup(httpRequestBody).subscribe(
      (data) => {
        const createUserInGroupResponse: any = data;
        if (!createUserInGroupResponse.error) {
          this.toastService.add({
            type: 'success',
            message: "User Added/Removed Succesfully!"
          })
        }
        this.getUserGroupsFromBackend();
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastService.add({
          type: 'error',
          message: 'User cannot Created'
        });
        this.getUserGroupsFromBackend();
      }
    );
  }
  ngOnDestroy(): void {
    /// throw new Error('Method not implemented.');
    this.dtTrigger.unsubscribe();
    this.dtTrigger1.unsubscribe();
  }
  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    this.dtTrigger.next(null);
    this.dtTrigger1.next(null);

  }

addNewUsergroup(){
  this.getRolesFromBackend();
  this.getUsersFromBackend();
 this.getDomainsFromBackend();
}
  addNewUser(){
    this.getRolesFromBackend();
    this.getUsersFromBackend();
   this.getDomainsFromBackend();
    this.multiple_userandrole = [
      {
        group: '',
        role: 0,
      },
    ];
  }

}


