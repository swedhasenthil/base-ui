import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../auth.service';
import { formatDate, Location } from '@angular/common';
import { CommonService } from 'src/app/shared/services/common.service';
import { Conditional } from '@angular/compiler';
import { LoginService } from 'src/app/Modules/login/login.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  ROLES = [
    'Admin',
    'SME',
    'Manager',
    'Analyst L1',
    'Analyst L2',
    'QC L1',
    'QC L2',
    'Doc Specialist',
  ];

  routePath: any;

  userName: any;
  userId: any;
  // roleSme: any;
  // showMore: any;

  notifications: boolean;
  notificationMessages: any[];
  notificationLength: number;

  role: any;
  roleName: any;
  userRoles: any;

  // smeScreenList: any;
  reviewTime: any;
  timeDate: any;

  docId: any;
  documentId: any;
  document: any;
  docType: any = [];
  selectedDocumentType: any;
  currentDocumentTypeVar: any;
  dataTypeList: any;
  projectDocumentTypes: unknown[];

  isAnalyst: boolean = false;
  isQc: boolean = false;
  isSme: boolean = false;
  isAdmin: boolean = false;
  isManager: boolean = false;

  show: any = 3;
  shows: boolean = true;
  footer: boolean = true;
  displayList: any = false;
  unReadMessagesCount: any = 0;
  @ViewChild('configProjects') configProjects: ElementRef;
  @ViewChild('calibrateDocuments') calibrateDocuments: ElementRef;
  @ViewChild('referenceData') referenceData: ElementRef;
  @ViewChild('cognitiveApi') cognitiveApi: ElementRef;
  @ViewChild('managerTask') managerTask: ElementRef;
  @ViewChild('dashboard') dashboard: ElementRef;
  @ViewChild('reports') reports: ElementRef;
  @ViewChild('manageResources') manageResources: ElementRef;
  @ViewChild('manageProject') manageProject: ElementRef;
  @ViewChild('manageApi') manageApi: ElementRef;
  @ViewChild('mywork') mywork: ElementRef;
  timerDisplay_status: any;
  documentTypeChangeIndicator: boolean;
  manualUpdate: boolean;
  autoUpdate: boolean;
  attributes: any = [];
  changedDocumentTypeAttributes: any = [];
  documentTypeDataObjectArray: any;
  currentDocumentTypeId: any;
  manualAndAuto: any;
  routerPage: string;
  isAdimnItems: boolean = false;
  isSmeItems: boolean = false;
  isManagerItems: boolean = false;
  adminMenuSubjectSubcription: Subscription;
  smeMenuSubjectSubcription: Subscription;
  managerMenuSubjectSubcription: Subscription;
  constructor(
    public router: Router,
    public sharedService: SharedService,
    public _authService: AuthService,
    private _location: Location,
    public commonService: CommonService,
    public service: LoginService
  ) {
    this.routePath = router.url;

    this.userId = localStorage.getItem('currentUserId');

    this.router.events.subscribe((currentRoute: any) => {
      if (currentRoute instanceof NavigationStart) {
        currentRoute.url.includes('analyst')
          ? (this.isAnalyst = true)
          : (this.isAnalyst = false);
        currentRoute.url.includes('qc')
          ? (this.isQc = true)
          : (this.isQc = false);
        currentRoute.url.includes('sme')
          ? (this.isSme = true)
          : (this.isSme = false);
        currentRoute.url.includes('manager')
          ? (this.isManager = true)
          : (this.isManager = false);
        currentRoute.url.includes('admin')
          ? (this.isAdmin = true)
          : (this.isAdmin = false);
      }

      this.sharedService.headerSubject.subscribe((res) => {
        this.isAnalyst = false;
        this.isQc = false;
        this.displayList = false;
      });
      if (this.sharedService.getHeaderDocumentType == true) {
        this.document = this.commonService.getReviewDocument;
        this.selectedDocumentType = this.document.documentTypeName;

        this.projectDocumentTypes = Object.values(
          this.document.projectDocumentTypesObject
        );

        this.sharedService.headerSubject.subscribe((res) => {
          this.isAnalyst = false;
          this.isQc = false;
          this.displayList = false;
        });
      }

      this.notifications = true;
      this.footer = true;
    });

    this.role = localStorage.getItem('currentUserRoleName');
  }

  ngAfterViewChecked() {
    if (this.router.url === '/sme/calibrate-documents') {
      this.activeClass(this.configProjects);
    }
    if (this.router.url === '/sme/calibrate-documents') {
      this.activeClass(this.calibrateDocuments);
    }
    if (this.router.url === '/sme/reference-data-management') {
      this.activeClass(this.referenceData);
    }
    if (this.router.url === '/sme/cognitive-apis') {
      this.activeClass(this.cognitiveApi);
    }
    if (this.router.url === '/manager/reports') {
      this.activeClass(this.reports);
    }
    if (this.router.url === '/manager/dashboard') {
      this.activeClass(this.dashboard);
    }
    if (this.router.url === '/manager/manager-task') {
      this.activeClass(this.managerTask);
    }
    if (this.router.url === '/admin/manage-resources') {
      this.activeClass(this.manageResources);
    }
    if (this.router.url === '/admin/manage-project') {
      this.activeClass(this.manageProject);
    }
    if (this.router.url === '/admin/manage-api') {
      this.activeClass(this.manageApi);
    }
    if (this.router.url === '/analyst/my-work') {
      this.activeClass(this.mywork);
    }
  }

  ngOnInit(): void {
    this.service.getUserID.subscribe((res: any) => {
      this.userId = res;
      localStorage.setItem('notId', this.userId);
      this.getAllNotifications(false);
    });

    this.sharedService.allNotifications.subscribe((res: any) => {
      this.notificationMessages = res;
      this.notificationLength = res?.length;
    });
    this.sharedService.readMessageCount.subscribe((res: any) => {
      this.unReadMessagesCount = res;

      if (this.unReadMessagesCount === null) {
        this.unReadMessagesCount = 0;
      }
    });

    this.adminMenuSubjectSubcription =
      this.sharedService.addminMenuSubject.subscribe(() => {
        this.isAdimnItems = true;
      });
    this.smeMenuSubjectSubcription =
      this.sharedService.smeMenuSubject.subscribe(() => {
        this.isSmeItems = true;
      });
    this.managerMenuSubjectSubcription =
      this.sharedService.managerMenuSubject.subscribe(() => {
        this.isManagerItems = true;
      });
    this.userName = localStorage.getItem('user_name');
    this.userId = localStorage.getItem('currentUserId');
    this.role = localStorage.getItem('currentUserRoleName');
    this.roleName = localStorage.getItem('currentUserRoleName');
    this.isAdimnItems = false;
    this.isSmeItems = false;
    this.isManagerItems = false;

    this.sharedService.getProject.subscribe((data) => {
      this.timerDisplay_status = data.timerDisplay;
    });
  }
  ngDoCheck() {
    this.userName = localStorage.getItem('user_name');
    this.userId = localStorage.getItem('currentUserId');
    this.role = localStorage.getItem('currentUserRoleName');
    this.displayList = localStorage.getItem('displayList');
    this.documentId = localStorage.getItem('documentId');
    this.dataTypeList = localStorage.getItem('documentTypesArray');
    this.timeDate = localStorage.getItem('reviewTime');
    this.reviewTime = JSON.parse(this.timeDate);
  }
  ngAfterViewInit() {
    this.docType = JSON.parse(this.dataTypeList);

    for (let index = 0; index < this.docType && this.docType.length; index++) {
      const element = this.docType[index];
      if (
        element.document_type_id.document_type == this.currentDocumentTypeVar
      ) {
        this.docId = element.document_type_id._id;
      }
    }
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  getUserName() {
    this.userName = localStorage.getItem('user_name');
  }

  goToScreen(rolename: any) {
    this.setRoleId(rolename);
    if (rolename == 'Admin') {
      this.router.navigate(['/admin/landing']);
      this.role = rolename;
      localStorage.setItem('currentUserRoleName', rolename);
      this.userName = localStorage.getItem('user_name');
    }
    if (rolename == 'Analyst L1' || rolename == 'Analyst L2') {
      this.role = rolename;
      this.router.navigate(['/analyst/my-work']);
      localStorage.setItem('currentUserRoleName', rolename);
      this.userName = localStorage.getItem('user_name');
    }
    if (rolename == 'SME') {
      this.role = rolename;
      this.router.navigate(['/sme/landing']);
      localStorage.setItem('currentUserRoleName', rolename);
      this.userName = localStorage.getItem('user_name');
    }
    if (rolename == 'QC L1' || rolename == 'QC L1') {
      this.role = rolename;
      this.router.navigate(['/qc/my-work']);
      localStorage.setItem('currentUserRoleName', rolename);
      this.userName = localStorage.getItem('user_name');
    }
    if (rolename == 'Manager') {
      this.role = rolename;
      this.router.navigate(['/manager/manager-landing']);
      localStorage.setItem('currentUserRoleName', rolename);
      this.userName = localStorage.getItem('user_name');
    }
    if (rolename == 'Doc Specialist') {
      this.role = rolename;
      this.router.navigate(['/doc-specialist']);
      localStorage.setItem('currentUserRoleName', rolename);
      this.userName = localStorage.getItem('user_name');
    }
  }

  setRoleId(roleName: any) {
    let role =
      this.userRoles &&
      this.userRoles.find((element: any) => {
        if (element.role_name == roleName) {
          return element;
        }
      });
    localStorage.setItem('currentUserRoleId', role._id);
  }
  getAllNotifications(markAsRead?: boolean) {
    // this.userId = localStorage.getItem('notId');
    this.userId = localStorage.getItem('currentUserId');

    if (this.userId !== null) {
      this.sharedService.getAllNotificationsOfUser(markAsRead);
    }
  }
  getAllUserRoles() {
    this.sharedService.getCurrentUserRoles({ user_id: this.userId }).subscribe(
      (data: any) => {
        this.userRoles = data;

        localStorage.setItem(
          'rolesList',
          this.userRoles.map((role: any) => role.role_name)
        );
      },
      (err) => {
        // if (this.authService.isNotAuthenticated(err.status)) {
        //   this.authService.clearCookiesAndRedirectToLogin();
        //   return;
        // }
        // this.toastr.error('Error');
        // this.overlay.activateOverlay(false, '');
      }
    );
  }

  logout() {
    localStorage.removeItem('currentUserRoleName');
    localStorage.removeItem('user_name');
    localStorage.clear();

    this._authService.logout();
    // this.router.navigate(['login']);
  }
  //called on change of dropdown values
  changeDocumentType(value: any, router: any) {
    // this.selectedDocumentType = inputValue;
    this.selectedDocumentType = value;
    this.routerPage = router;
    this.sharedService.tooggleModal('documentTypeChangeModal', 'show');
    for (
      let index = 0;
      index < this.document.projectDocumentTypes.length;
      index++
    ) {
      const element = this.document.projectDocumentTypes[index];
      if (element.document_type_id.document_type == this.selectedDocumentType) {
        this.docId = element.document_type_id._id;
      }
    }
  }

  documentTypeValueUnchanged() {
    if (this.manualAndAuto === 'auto') {
      if (this.routerPage === 'analyst') {
        this.router.navigate(['/analyst/my-work']);
      } else {
        this.router.navigate(['/qc/my-work']);
      }
    } else this.manualAndAuto === 'manual';
    {
      this.document.updatedAttributes = [];
      this.changedDocumentTypeAttributes = [];
      this.document.projectDocumentTypes.forEach((element: any) => {
        if (
          element.document_type_id.document_type === this.selectedDocumentType
        ) {
          this.currentDocumentTypeId = element.document_type_id._id;
          element.attributes.forEach((attr: any) => {
            const selectedDocumentType = this.selectedDocumentType;
            const json = {
              [selectedDocumentType]: {
                category_details: [
                  {
                    location: [],
                    confidence_score: 1,
                    page_no: '',
                    value: '',
                    isColor: 'true',
                  },
                ],
                category: attr.attribute_name,
                edited: false,
                editedByAnalyst: false,
                has_error: false,
              },
            };
            this.attributes = json;
            this.changedDocumentTypeAttributes.push(
              this.attributes[this.selectedDocumentType]
            );
          });
        }
      });

      console.log('Changed Attributes :: ', this.changedDocumentTypeAttributes);
      this.document.updatedAttributes = this.changedDocumentTypeAttributes;
      this.document.originAttributes = this.changedDocumentTypeAttributes;
      this.document.documentTypeName = this.selectedDocumentType;
      //this.document.document_type_id = this.docId;
      this.document.edited_document_type_id_a = this.docId;
      this.manualUpdate = true;
      this.commonService.setManualUpdate(this.manualUpdate);
      this.commonService.setDocument(this.document);
      this.manualAndAuto = '';
    }
    this.commonService.hideEditBox(false);
  }

  activeClass(event: any) {
    const activeClass = document.getElementsByClassName(
      'skn-header-nav-navitem-active'
    );

    for (var i = 0; i < activeClass.length; i++) {
      activeClass[i].classList.add('skn-header-nav-navitem');
      activeClass[i].classList.remove('skn-header-nav-navitem-active');
    }
    if (event?.target) {
      event.target.className = 'skn-header-nav-navitem-active';
    } else {
      if (event?.nativeElement) {
        event.nativeElement.className = 'skn-header-nav-navitem-active';
      }
    }
  }
  increaseShow(event: any) {
    event.stopPropagation();
    this.shows = false;
    this.show = this.notificationMessages.length;
  }
  decreaseShow(event: any) {
    event.stopPropagation();
    this.shows = true;
    this.show = 3;
  }

  backClicked() {
    this.commonService.hideEditBox();
    this._location.back();
  }
  hideEditBox() {
    this.commonService.hideEditBox();
  }
  cancelChangeDocumentType() {
    this.selectedDocumentType = this.document.documentTypeName;
    this.docId = this.document.document_type_id;
  }
  ngOnDestroy() {
    this.adminMenuSubjectSubcription.unsubscribe();
    this.smeMenuSubjectSubcription.unsubscribe();
    this.managerMenuSubjectSubcription.unsubscribe();
  }
}
