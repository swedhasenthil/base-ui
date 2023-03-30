import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SmeService } from '../../sme.service';

@Component({
  selector: 'app-add-new-and-edit-document',
  templateUrl: './add-new-and-edit-document.component.html',
  styleUrls: ['./add-new-and-edit-document.component.scss']
})
export class AddNewAndEditDocumentComponent implements OnInit {
  modelApiData: any;
  selectedModelApis: any;
  refrenceDataList: any;
   header:any
  modelApiAttributeList: any;
  addDocumentForm: any = {
    id: null,
    documentName: '',
    modelApi: '',
    attributesArray: [
      {
        attribute_name: '',
        model_attribute_name: '',
        data_type: '',
        reference_data_id: null,
      },
    ],
  };
  datatypesarray: any = [
    'Text',
    'Alphanumeric',
    'Date',
    'Alpha',
    'Boolean',
    'Numeric',
    'Amount',
    'Reference Data',
  ];
  updateButton: boolean;
  submitButton: boolean;
  item: any;
  constructor(
    public smeService: SmeService,
    public toastr: ToasterService,
    private router: Router,
    private sharedService:SharedService
  ) {  
   
  this.loadModelApi();
  this.getReferenceData()
}

  ngOnInit() {
    
    this.smeService.DocumentForm.subscribe((res: any) => {
      
      if(res != null){
      this.addDocumentForm = res;
      this.modelApidropdownChange(res.modelApi)
      }
    }); 
    this.smeService.headerValue.subscribe((res:any)=>{
      this.updateButton = res
    })
  }
 /***
   * @desc getting in service list out modelApi data
   */
 loadModelApi() {
  this.smeService.getListOfModelApi().subscribe(
    (res) => {
      this.modelApiData = res;
      this.selectedModelApis = this.modelApiData[0]?.modelApi.name;
    },
    (error) => {
      this.toastr.add({
        type: 'error',
        message: error.error.message,
      });
    }
  );
}
/***
 * @desc getting in service list out referenced data
 */
getReferenceData() {
  this.smeService.getReferenceData().subscribe((data) => {
    const result: any = data;
    this.refrenceDataList = result;
  });
}

  /***
   * @desc model api for drop down listing
   */
  modelApidropdownChange(selectedmodelApi: any) {
    this.setModalAtribute(selectedmodelApi);
  }

  /***
   * @desc settig the data in model attributes
   */
  setModalAtribute(selectedmodelApi: any) {
    let selectedModel = this.modelApiData.filter((item: any) => {
      if (item._id == selectedmodelApi) {
        return item;
      }
    });
    if (selectedModel.length > 0) {
      this.modelApiAttributeList = selectedModel[0]['attributes'];
    }
  }
  /***
   * @desc added new attribute input field
   */
  addNewAtribute() {
    this.addDocumentForm['attributesArray'].push({
      attribute_name: '',
      model_attribute_name: '',
      data_type: '',
      reference_data_id: null,
    });
  }
  /***
   * @desc remove attribute input field
   */
  removeAttributeRow(i: number) {
    this.addDocumentForm['attributesArray'].splice(i, 1);
  }
  isValid:boolean=true;
  /***
   * @desc on click of submit in edit document form
   */
  onSubmitEditDocument() {
   let hasError = false;
   this.addDocumentForm.attributesArray.forEach((e:any) => {
     if (!e.attribute_name.trim()) {
       hasError = true;
     }
   });
   if (hasError) {
     return;
   }
   const request = {
     document_type: this.addDocumentForm.documentName,
     versioned_model_api: this.addDocumentForm.modelApi,
     attributes: this.addDocumentForm.attributesArray,
     document_type_id: this.addDocumentForm.id
       ? this.addDocumentForm.id
       : null,
   };
   this.smeService.updateDocumentStatus(request).subscribe(
     (dataResult) => {
       const updateDocumentStatusResponse: any = dataResult;
       if (!updateDocumentStatusResponse.error) {
         this.toastr.add({
           type: 'success',
           message: 'Document type is updated successfully!',
         });
         location.reload();       
       }
     },
    
   );
 }
  /***
   * @desc on click of submit in add new document form
   */
   saveDocument() {
     this.isValid=true;
     if (
       this.addDocumentForm.documentName == undefined || this.addDocumentForm.documentName == '' || this.addDocumentForm.modelApi == undefined ||this.addDocumentForm.modelApi == '') {
       this.toastr.add({
         type: 'warning',
         message: 'Attribute name cannot be empty',
       });
       this.isValid=false;
       return;
     }
 
     if (this.addDocumentForm.attributesArray.length > 0) {
        for(var i=0;i<this.addDocumentForm.attributesArray.length;i++){
          if(this.addDocumentForm.attributesArray[i].attribute_name=='' || this.addDocumentForm.attributesArray[i].model_attribute_name==''){
                   this.toastr.add({
                   type: 'warning',
                     message: 'Enter mandatory fields',
                   });
                   this.isValid=false;
                   break;
          }
 
        }
     }
 
     if(this.isValid){
     const payload = {
       document_type: this.addDocumentForm.documentName,
       versioned_model_api: this.addDocumentForm.modelApi,
       attributes: this.addDocumentForm.attributesArray,
       document_type_id: this.addDocumentForm.id
         ? this.addDocumentForm.id
         : null,
     };
     this.smeService.addDocument(payload).subscribe(
       (res) => {
         this.toastr.add({
           type: 'success',
           message: 'Document type is created successfully!',
         });
         location.reload();        
       },
       (err) => {
         this.toastr.add({
           type: 'error',
           message: err.error.message,
         });
       }
     );
     }
     
   }
   
  onDataTypeChange(seletedDataType:any,index:any){
    this.addDocumentForm.attributesArray[index].reference_data_id=null;
    if(seletedDataType=='Reference Data'){
      (<HTMLInputElement>document.getElementById('select_'+index)).disabled  = false;

    }else{
      (<HTMLInputElement>document.getElementById('select_'+index)).disabled  = true;
      this.addDocumentForm.attributesArray[index].reference_data_id=null;
    } 
  }
 /***
   * @desc on click of delete button we delte document list
   */

onDeleteDocument() {
  this.smeService
    .deleteDocument({ document_type_id: this.addDocumentForm._id })
    .subscribe(
      (dataResult) => {
        const deleteDocumentStatusResponse: any = dataResult;
        if (!deleteDocumentStatusResponse.error) {
          window.location.reload();
          this.toastr.add({
            type: 'success',
            message: 'Document Deleted Succesfully!',
          });
        }
      },
      (err) => {
        this.toastr.add({
          type: 'error',
          message: 'Document type cannot be deleted',
        });
      }
    );
}
}
