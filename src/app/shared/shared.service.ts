import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { CommonService } from './services/common.service';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
const APIEndpoint = environment.APIEndpoint;

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  headerSubject = new Subject<any>();
  public editDataDetails: any = [];
  headerDocumentType: any;
  _project: any;
  userId: any;
  notificationLength: any;
  notificationMessages: any[];
  unReadMessagesCount: any;
  constructor(
    public httpClient: HttpClient,
    public authService: AuthService,
    public commonService: CommonService,
    private datepipe: DatePipe
  ) {}

  hideAnalystMenu() {
    this.headerSubject.next(null);
  }

  public currentProject = new BehaviorSubject(this.editDataDetails);
  public OrchestrationProject = new BehaviorSubject(null);
  public currentAssignee = new BehaviorSubject(this.editDataDetails);
  public currentStatus = new BehaviorSubject(this.editDataDetails);
  public currentReviewTime = new BehaviorSubject(this.editDataDetails);
  public allNotifications = new BehaviorSubject(null);
  public readMessageCount = new BehaviorSubject(null);
  public addminMenuSubject = new BehaviorSubject<any>(null);
  public smeMenuSubject = new BehaviorSubject<any>(null);
  public managerMenuSubject = new BehaviorSubject<any>(null);
  getNotifications(userId: any) {
    return this.httpClient.get(
      environment.baseUrl + '/users/' + userId + '/notifications'
    );
  }
  deleteAllNotificationsOfAUser(userId: any, dateTime: any) {
    return this.httpClient.delete(
      environment.baseUrl +
        `/notifications?user_id=${userId}&latestnotificationdatetime=${dateTime}`
    );
  }
  deleteNotification(notificationId: any) {
    return this.httpClient.delete(
      environment.baseUrl + `/notifications/${notificationId}`
    );
  }
  getCurrentUserRoles(body: any) {
    return this.httpClient.post(environment.baseUrl + `/users/roles/v1`, body);
  }
  tooggleModal($id: any, $action: any) {
    return $(`#${$id}`).modal($action);
  }

  //for project
  setProject(project: any) {
    this.currentProject.next(project);
  }
  setOrchestrationProject(project: any) {
    this.OrchestrationProject.next(project);
  }

  get getProject() {
    return this.currentProject;
  }

  //for project
  setReviewTime(reviewTime: any) {
    this.currentReviewTime.next(reviewTime);
  }
  get getReviewTime() {
    return this.currentReviewTime;
  }

  //for assignee
  setAssignee(assignee: any) {
    this.currentAssignee.next(assignee);
  }
  adminMenuChanges() {
    this.addminMenuSubject.next(null);
  }
  smeMenuChanges() {
    this.smeMenuSubject.next(null);
  }
  managerMenuChanges() {
    this.managerMenuSubject.next(null);
  }
  //for Status
  setStatus(status: any) {
    this.currentStatus.next(status);
  }
  setNotification(notification: any) {
    this.allNotifications.next(notification);
  }
  setReadMessageCount(value: any) {
    this.readMessageCount.next(value);
  }
  //  for header
  set setHeaderDocumentType(event: any) {
    this.headerDocumentType = event;
  }
  get getHeaderDocumentType() {
    return this.headerDocumentType;
  }

  set project(project: any) {
    this._project = project;
  }

  get project() {
    return this._project;
  }
  applyDocumentTypeSettings(
    documentAttributes: any,
    documentTypeSettings: any
  ) {
    if (documentTypeSettings.length > 0) {
      // Get document Type Attribute settings
      let documentTypeAttributesSettings = documentTypeSettings[0].attributes;

      documentTypeAttributesSettings.forEach((attributeSettings: any) => {
        const thresholdValue: any = attributeSettings.threshold;
        let confidenceScoreValue: any;

        // Apply document attribute settings to all matched attributes
        documentAttributes.every((attribute: any) => {
          if (attributeSettings.attribute_name === attribute.category) {
            attribute = this.attributeInputTypeSettingsValidator(
              attribute,
              attributeSettings
            );

            confidenceScoreValue =
              attribute.category_details[0].confidence_score;
            if (confidenceScoreValue >= thresholdValue) {
              attribute.category_details[0]['isColor'] = 'true';
            } else {
              attribute.category_details[0]['isColor'] = 'false';
            }
            return false;
          }
          return true;
        });
      });
    }

    return documentAttributes;
  }
  attributeInputTypeUpperAndLowerLimitValidator(
    attribute: any,
    attributeSettings: any
  ) {
    attribute.category_details[0]['isNumber'] = 'true';

    if (attributeSettings.lower_limit && !attributeSettings.upper_limit) {
      if (attribute.category_details[0].value < attributeSettings.lower_limit) {
        delete attribute.category_details[0]['upper_limit'];
        attribute.category_details[0]['lower_limit'] =
          attributeSettings.lower_limit;
      } else {
        delete attribute.category_details[0]['lower_limit'];
      }
    } else if (
      !attributeSettings.lower_limit &&
      attributeSettings.upper_limit
    ) {
      delete attribute.category_details[0]['lower_limit'];
      if (attribute.category_details[0].value > attributeSettings.upper_limit) {
        attribute.category_details[0]['upper_limit'] =
          attributeSettings.upper_limit;
      } else {
        delete attribute.category_details[0]['upper_limit'];
      }
    } else if (attributeSettings.lower_limit && attributeSettings.upper_limit) {
      if (
        attribute.category_details[0].value < attributeSettings.lower_limit ||
        attribute.category_details[0].value > attributeSettings.upper_limit
      ) {
        attribute.category_details[0]['lower_limit'] =
          attributeSettings.lower_limit;
        attribute.category_details[0]['upper_limit'] =
          attributeSettings.upper_limit;
      } else {
        delete attribute.category_details[0]['upper_limit'];
        delete attribute.category_details[0]['lower_limit'];
      }
    }

    return attribute;
  }

  attributeInputTypeSettingsValidator(attribute: any, attributeSettings: any) {
    if (attribute.category && attributeSettings._id) {
      switch (attributeSettings.data_type) {
        case 'Reference Data':
          if (attributeSettings.reference_data_id) {
            /* Input Type radio starts here */
            if (attributeSettings.reference_data_id.values.length <= 3) {
              delete attribute.category_details[0]['dropdownlists'];
              attribute.category_details[0]['radioLists'] =
                attributeSettings.reference_data_id.values;
              //if values exists bind it, if it doesn't then making it blank
              var radiocount = 0;
              attribute.category_details[0]['radioLists'].forEach(
                (element: any) => {
                  if (element.key == attribute.category_details[0].value) {
                    radiocount++;
                  }
                }
              );
              if (radiocount < 1) {
                attribute.category_details[0].value = '';
              }
            } else if (attributeSettings.reference_data_id.values.length > 3) {
              delete attribute.category_details[0]['radioLists'];

              /* Input Type radio ends here */

              /** Input Type dropdown starts here
               *
               *  if length is <=3 it's a dropdown
               */
              attribute.category_details[0]['dropdownlists'] =
                attributeSettings.reference_data_id.values;
              //if values exists bind it, if it doesn't then making it blank
              var dropdowncount = 0;
              attribute.category_details[0]['dropdownlists'].forEach(
                (element: any) => {
                  if (element.key == attribute.category_details[0].value) {
                    dropdowncount++;
                  }
                }
              );
              if (dropdowncount < 1) {
                attribute.category_details[0].value = '';
              }
            }
            /* Input Type dropdown starts here */
          }

          break;

        case 'Date':
          attribute.category_details[0]['isDate'] = 'true';
          var timestamp = Date.parse(attribute.category_details[0].value);
          if (isNaN(timestamp) == false) {
            try {
              attribute.category_details[0].value = this.datepipe.transform(
                attribute.category_details[0].value,
                'dd-MMM-yyyy'
              );
            } catch (error) {}
          } else {
            let dateValue = new Date(attribute.category_details[0].value);
            if (!isNaN(dateValue.getTime())) {
              attribute.category_details[0].value = this.datepipe.transform(
                dateValue,
                'dd-MMM-yyyy'
              );
            }
          }

          break;

        case 'Numeric':
          attribute = this.attributeInputTypeUpperAndLowerLimitValidator(
            attribute,
            attributeSettings
          );
          break;

        case 'Amount':
          attribute = this.attributeInputTypeUpperAndLowerLimitValidator(
            attribute,
            attributeSettings
          );
          break;

        default:
          delete attribute.category_details[0]['dropdownlists'];
          delete attribute.category_details[0]['radioLists'];
          attribute = attribute;
          break;
      }
    }

    return attribute;
  }

  getAllNotificationsOfUser(markAsRead?: boolean) {
    localStorage.setItem('notificanUrl', 'Yes');
    this.userId = localStorage.getItem('currentUserId');
    this.getNotifications(this.userId).subscribe(
      (res: any) => {
        // this.notificationMessages = res.notifications;
        this.notificationLength = res?.length;
        this.notificationMessages = res.notifications?.map(
          (notification: any) => {
            if (this.isToday(notification?.created_at)) {
              if (this.isWithinAMinute(notification?.created_at)) {
                notification.date = 'Just now';
                return notification;
              }
              notification.date = formatDate(
                notification?.created_at,
                'h:mm a',
                'en_US'
              );
              return notification;
            }
            notification.date = formatDate(
              notification?.created_at,
              'd-MMM, h:mm a',
              'en_US'
            );
            return notification;
          }
        );
        this.setNotification(this.notificationMessages);
        if (markAsRead) {
          this.showOrRemoveNotificationConnector();
          this.markUserNotificationsAsRead();
          this.unReadMessagesCount = 0;
          this.setReadMessageCount(this.unReadMessagesCount);
        } else {
          this.updateUnreadMessageCount();
        }
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }
  markUserNotificationsAsRead(): any {
    let latestMessageTimeStamp = this.latestMessageTimeStamp();

    if (!latestMessageTimeStamp) {
      // this.toastr.info('Do not have any notifications');
      return false;
    }

    this.commonService
      .markAllNotificationsRead(this.authService.getCurrentUserId(), {
        // payload
        latest_notification_date_time: latestMessageTimeStamp,
      })
      .subscribe(
        (response: any) => {},
        (err: any) => {
          if (this.authService.isNotAuthenticated(err.status)) {
            this.authService.clearCookiesAndRedirectToLogin();
            return;
          }
        }
      );
  }

  updateUnreadMessageCount() {
    this.unReadMessagesCount = 0;
    this.notificationMessages?.map((notification: any) => {
      if (!notification?.is_read) {
        this.unReadMessagesCount += 1;
        this.setReadMessageCount(this.unReadMessagesCount);
      }
      this.setReadMessageCount(this.unReadMessagesCount);
    });
  }

  latestMessageTimeStamp() {
    let latestMessageTimeStamp;

    if (this.notificationMessages?.length) {
      latestMessageTimeStamp = this.notificationMessages[0]?.created_at;
    }

    if (latestMessageTimeStamp == undefined) {
      // Toast.
      // this.toastr.info('Not have any notifications to clear');
      return false;
    }
    return latestMessageTimeStamp;
  }
  isToday(notificationDate: any): boolean {
    try {
      const nDate = new Date(notificationDate);
      const today = new Date();
      if (
        nDate.getFullYear() == today.getFullYear() &&
        nDate.getMonth() == today.getMonth() &&
        nDate.getDate() == today.getDate()
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  isWithinAMinute(notificationDate: any): boolean {
    try {
      const nDate = new Date(notificationDate);
      const now = new Date();
      return (now.getTime() - nDate.getTime()) / 1000 < 60 ? true : false;
    } catch (error) {
      return false;
    }
  }
  showOrRemoveNotificationConnector() {
    const notificationPanel = document.querySelector('.notification');
    const connector = document.querySelector('#notificationConnectorDiv');
    setTimeout(() => {
      if (notificationPanel?.className?.includes('show')) {
        connector?.classList?.add('show-connector');
      } else {
        connector?.classList?.remove('show-connector');
      }
    }, 0);
  }
}
