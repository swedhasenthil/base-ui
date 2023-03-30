import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements OnInit {
  @Input() document: any;
  documentAttributes: any = [];
  className: any;
  activeTab: string;
  lastClickedElement: any;

  // Check from which module we are calling this component
  calledBy: any;

  // To highlight Select input
  activeAttribute: any;
  activeAttributeSubscription: any;

  /* Subscriptions varables start */
  subscriptionParentComponent: Subscription;
  mandatoryCount: any = 0;
  subscriptionMandatoryCount: Subscription;
  disableButton: boolean;
  documentSubscription: Subscription;
  /* Subscriptions varables end */

  constructor(
    public commonService: CommonService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptionParentComponent =
      this.commonService.parentComponent.subscribe((flag) => {
        this.calledBy = flag;
      });
    this.documentSubscription = this.commonService.document.subscribe(
      (document) => {
        if (document) {
          this.document = document;
          this.validateDocument(
            this.document._id,
            this.document.updatedAttributes
          );
        }
        if (this.documentAttributes.length === 0) {
          this.disableButton = false;
          this.commonService.setSubmitButton(this.disableButton);
        } else {
          this.disableButton = true;
          this.commonService.setSubmitButton(this.disableButton);
        }
        this.countMandatoryAttributes(this.document?.updatedAttributes);

        this.filterCategory('all');
      }
    );
  }
    /**
   * @desc  mandatory Attributes count
   * @param attributes
   */
  countMandatoryAttributes(attributes: any) {
    let mandatoryAtrributesCount = 0;
    attributes.map((attribute: any) => {
      if (attribute.mandatory) {
        mandatoryAtrributesCount += 1;
      }
    });
    this.mandatoryCount = mandatoryAtrributesCount;
  }
    /**
   * @desc  validate the attributes document 
   */
  validateDocument(documentId: any, updatedDocumentAttributes: any) {
    let payload = { ...this.document };
    payload.details = updatedDocumentAttributes;
    payload.document_id = documentId;
    this.commonService.validDocument(payload).subscribe(
      (data: any) => {
        this.document.updatedAttributes.forEach(
          (attribute: any, index: any) => {
            if (attribute) {
              attribute.has_error = data[index].has_error;
            }
          }
        );
        this.documentAttributes = this.document.updatedAttributes;
        this.commonService.enableSubmitButton(this.documentAttributes);
      },
      (err) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
      }
    );
  }

  saveLastClickedElement() {
    this.commonService.setActiveAttribute(document.activeElement);
  }
  /**
   * @desc filter the attributes details based on the category name
   * @param category
   */
  filterCategory(category: string) {
    this.activeTab = category;
    var x, i;
    x = document.getElementsByClassName('attributes');
    if (category == 'all') category = '';
    for (i = 0; i < x.length; i++) {
      this.categoryRemoveClass(x[i], 'd-flex');
      if (x[i].className.indexOf(category) > -1)
        this.categoryAddClass(x[i], 'd-flex');
    }
  }
  /**
   * @desc  category name add class
   * @param element
   * @param name
   */
  categoryAddClass(element: any, name: any) {
    var i, arr1, arr2;
    arr1 = element.className.split(' ');
    arr2 = name.split(' ');
    for (i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) == -1) {
        element.className += ' ' + arr2[i];
      }
    }
  }
  /**
   * @desc  category name remove class
   * @param element
   * @param name
   */
  categoryRemoveClass(element: any, name: any) {
    var i, arr1, arr2;
    arr1 = element.className.split(' ');
    arr2 = name.split(' ');
    for (i = 0; i < arr2.length; i++) {
      while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
      }
    }
    element.className = arr1.join(' ');
  }
  /**
   * @desc  unsubscribe the subcribe method
   */
  ngOnDestroy(): void {
    this.subscriptionParentComponent.unsubscribe();
    this.documentSubscription.unsubscribe();
    
  }
}
