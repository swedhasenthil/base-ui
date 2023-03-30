import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SmeService } from '../../sme.service';

@Component({
  selector: 'app-define-rules',
  templateUrl: './define-rules.component.html',
  styleUrls: ['./define-rules.component.scss']
})
export class DefineRulesComponent implements OnInit {
  selectedAttibutes: any;
  leftAttributeList: any;
  rightAttributeList: any;
  selectedField: any;
  updatedDocId: any;
  docId: any;
  finalArr: any;
  submitButton: any ;
  updateButton: any;
  value = 0;
  min: number;
  max: number;
  style: any;
  sliderTooltip: any;
  divStyle:any ;
  subscriptionselectedAttributes: any;
  subscriptionFieldValue: any;
  subscriptionUpdateDocId: any;
  subscriptionSubmitFinalArr: any;
 
  constructor(private api: SmeService,
    private toastr: ToasterService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService) {
      this.subscriptionselectedAttributes =  this.api.selectedAttributes.subscribe(data => {
      this.selectedAttibutes = data;
    
    });
 
   this.subscriptionFieldValue = this.api.fieldValue.subscribe(data => {
      this.selectedField = data
    })
    this.subscriptionUpdateDocId = this.api.updateDocId.subscribe(data => {
      this.updatedDocId = data
    })
    this.subscriptionSubmitFinalArr =  this.api.submitFinalArr.subscribe(data => {
      this.finalArr = data
      if (this.finalArr == null) {
        this.updateButton = true;
        this.submitButton = false;

      }
      else {
        this.submitButton = true;
        this.updateButton = false
      }
    })
  }
 
  ngOnInit(): void {
  
  }
  

updateTooltip(i:any) {
 this.selectedAttibutes[i].threshold
  this.sliderTooltip = this.selectedAttibutes[i].threshold;
}
setMyStyles(value:any) {
  let styles = {
    'margin-left':value+ 'px',
  };
  return styles;
}
// setMyBackgroundStyles(value:any){
//   // let styles = {
//   //   'background': "linear-gradient"+"("+"to right"+',' +"red  0% ," +"red ," + value + '%' +", green ," +value +'%', "green) +" 
//   // }
//   return styles;
// }
 /**
   * @desc   update Doc type submit button
   */
  updateDocument() {
    this.selectedAttibutes.forEach((element: { threshold: number; }) => {
      element.threshold = element.threshold / 100;
    });

    if (this.updatedDocId) {
      this.docId = this.updatedDocId;
    }

    const updateJson = {
      id: this.selectedField._id,
      document_type_id: this.selectedField.document_type_id,
      project_id: this.selectedField.project_id,
      document_type: this.selectedField.documentName,
      document_type_description: this.selectedField.description,
      attributes: this.selectedAttibutes
    };

 /**
   * @desc   api call to edit document type
   */
    this.api.editDocType(updateJson).subscribe(
      (updateResponse: any) => {
        if (updateResponse) {

          this.toastr.add({
            type: 'success',
            message: 'Updated Successfully',
          });
          location.reload();
        }
      },
      (err: { status: any; error: { message: string | undefined; }; }) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: err.error.message ? err.error.message : 'Error',
        });
      }
    );
  }
 /**
   * @desc   on click of submit button
   */
  onSubmit() {

    const finalArr = {
      document_type_id: this.finalArr.document_type_id,
      project_id: this.finalArr.project_id,
      document_type: this.finalArr.document_type,
      document_type_description: this.finalArr.document_type_description,
      attributes: this.selectedAttibutes,
    };
    finalArr.attributes.forEach((element: { threshold: number; }) => {
      element.threshold = element.threshold / 100;
    });
    // api call to submit data
    this.api.submit(finalArr).subscribe(
      (submitted: any) => {
        if (submitted) {
          this.toastr.add({
            type: 'success',
            message: 'Submitted Successfully',
          });
          location.reload();
        }
      },
      (err: { status: any; error: { message: string | undefined; }; }) => {
        if (this.authService.isNotAuthenticated(err.status)) {
          this.authService.clearCookiesAndRedirectToLogin();
          return;
        }
        this.toastr.add({
          type: 'error',
          message: 'err.error.message ? err.error.message ',
        });
      }
    );
  }
  ngOnDestroy(): void {
    this.subscriptionselectedAttributes.unsubscribe();
    this.subscriptionFieldValue.unsubscribe();
    this.subscriptionUpdateDocId.unsubscribe();
    this.subscriptionSubmitFinalArr.unsubscribe();
  }
}
