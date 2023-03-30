import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

@Component({
  selector: 'app-calibrate-documents',
  templateUrl: './calibrate-documents.component.html',
  styleUrls: ['./calibrate-documents.component.scss']
})
export class CalibrateDocumentsComponent implements OnInit {
  // @ViewChildren(DataTableDirective)
  @ViewChild('cancelAddDocModel') cancelAddDocModel:ElementRef;
  dtElement: DataTableDirective;
dtInstance: Promise<DataTables.Api>;
//  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject<any>();
  calibrateDocumentsList:any=[];
  modelApiData:any=[];
  modelApiAttributeList:any=[];
  refrenceDataList:any=[];
  duplicateDocumentName:string;
  header:string="";
  addDocumentForm:any={
    id:null,
    documentName:"",
    modelApi:"",
    attributesArray:[{
      attribute_name: '',
      model_attribute_name: '',
      data_type: '',
      reference_data_id: null
    }]
  }
  datatypesarray:any = [
    'Text',
    'Alphanumeric',
    'Date',
    'Alpha',
    'Boolean',
    'Numeric',
    'Amount',
    'Reference Data'
  ];
  @ViewChild('closeDuplicateModel') closeDuplicateModel:ElementRef;
  @ViewChild('deleteDocumentbtn') deleteDocumentbtn:ElementRef;
  @ViewChild('openAddDocumentModel') openAddDocumentModel:ElementRef;
  attributesArray: any;
  selectedModelApis: any;
  calibrateDocuments: boolean;
  
  
  
  constructor(private smeService:SmeService,
    public toastService:ToasterService, private router: Router) { }

  ngOnInit(): void {
  
    this.loadDocuments();
    this.loadModelApi();
    this.getReferenceData();
    this.dtTrigger.next(null)

  }


  loadDocuments(){
    
    this.dtOptions= {
      processing:true,
      responsive:true,
      scrollY:"70vh",
      destroy:true,
      deferRender:true,
      pageLength: 5,

    };
    this.smeService.getCalibrateDocumentsList().subscribe((res:any)=>{
        this.calibrateDocumentsList = res; 
     
 
        this.calibrateDocuments = true;
      },
      error=>{
          this.toastService.add({
            type: 'error',
            message: error.error.message
          });
      });

   
  }
 
  
  onUploadTrainingDocData(file:any, doc:any ) {
 
    if (file.files.length === 0) {
      this.toastService.add({
        type: 'warning',
        message: 'Could not find file to upload'
      });	
      return;
    }
    var formData = new FormData();
    formData.append('file', file.files[0]);
    formData.append('document_type_id', doc._id);
    //this.overlay.activateOverlay(true, 'sk-circle');
    this.smeService.addTrainingDocumentData(formData).subscribe(
      (data:any) => {
        //this.overlay.activateOverlay(false, '');
        if(data["message"]) {
          this.toastService.add({
            type: 'error',
            message: data["message"]
          });
        } else {
          doc.training_data_docs_count += 1;
          this.toastService.add({
            type: 'success',
            message: "Document is uploaded successfully"
          })
        }
      },
      (err:any) => {
        //this.overlay.activateOverlay(false, '');
        this.toastService.add({
          type: 'error',
          message: 'Could not upload the document'
        });
    
      }
    );    
  }

  onUploadGoldenDataDoc(file:any, doc:any ) {
    if (file.files.length === 0) {
      this.toastService.add({
        type: 'warning',
        message: 'Could not find file to upload'
      });	
      return;
    }
    var formData = new FormData();
    formData.append('file', file.files[0]);
    formData.append('document_type_id', doc._id);
    //this.overlay.activateOverlay(true, 'sk-circle');
    this.smeService.addGoldenDocumentData(formData).subscribe(
      (data:any) => {
       // this.overlay.activateOverlay(false, '');
        if(data["message"]) {
          this.toastService.add({
            type: 'error',
            message: data["message"]
          });
        } else {
          doc.golden_data_docs_count += 1;
          this.toastService.add({
            type: 'success',
            message: "Document is uploaded successfully"
          })
        }
      },
      (err:any) => {
       // this.overlay.activateOverlay(false, '');
        this.toastService.add({
          type: 'error',
          message: 'Could not upload the document'
        });
        
      }
    );    
  }


  duplicateModelApi:any;
  duplicateAttributes:any;
  duplicateDocument(document:any){
    this.duplicateDocumentName=document.document_type + "_copy";
    this.duplicateModelApi = document.versioned_model_api;
    this.duplicateAttributes = document.attributes;
  }

  onChangeDocumentStatus(ev:any, doc:any) {
    let request:any = {};
    if (ev.checked) {
      request['isActive'] = true;
    } else {
      request['isActive'] = false;
    }
    request['document_type_id'] = doc._id;
    this.smeService.updateDocumentStatus(request).subscribe(
      (dataResult:any) => {
        const updateDocumentStatusResponse: any = dataResult;
        if (!updateDocumentStatusResponse.error) {
          this.toastService.add({
            type: 'success',
            message: "Document Status Succesfully!"
          })
          
        }
      },
      (err:any) => {
        // if (this.authService.isNotAuthenticated(err.status)) {
        //   this.authService.clearCookiesAndRedirectToLogin();
        //   return;
        // }
        this.toastService.add({
          type: 'error',
          message: 'Document Status cannot update'
        });
      }
    );
  }

  // rerender(): void {
  //   this.dtElements.forEach((dtElement: DataTableDirective) => {
  //     if (dtElement.dtInstance) {
  //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         dtInstance.destroy();
  //       });
  //     }
  //   });
  //   this.dtTrigger.next(null);
  // }

  ngAfterViewInit(): void {
     
  }

 

 
    // on click of create document button of duplicate document modal
    createDuplicateDocument() {
      if(this.duplicateDocumentName==""){
        this.toastService.add({
          type: 'warning',
          message: 'Enter document Name'
        });
        return;
      }
     
      const httpRequestBody = {
        document_type: this.duplicateDocumentName,
        versioned_model_api: this.duplicateModelApi,
        attributes: this.duplicateAttributes,
      };
      // this.dtTrigger.next(null);
      this.smeService.addDocument(httpRequestBody).subscribe(
        (data:any) => {
          const addDuplicateDocumentResponse: any = data;
          // this.dtTrigger.next(null);
          if (addDuplicateDocumentResponse.error) {
            this.toastService.add({
              type: 'error',
              message: 'Document cannot be created'
            });
          } else {
            // this.dtTrigger.next(null);       
            this.ngOnInit();
            this.toastService.add({
              type: 'success',
              message: "Document Created Succesfully!"
            })
          }
         // this.overlay.activateOverlay(false, '');
        },
        (err:any) => {
          this.toastService.add({
            type: 'error',
            message: err.error.message
          });
        }
      );
    }
    documentIdToDelete:any;
    deleteDocumentName:string;
    deleteDocument(document:any){
      this.deleteDocumentName = document.document_type;
      this.documentIdToDelete = document._id;
    }

    onDeleteDocument(){
      this.smeService.deleteDocument({ document_type_id: this.documentIdToDelete }).subscribe(
        (dataResult) => {
          const deleteDocumentStatusResponse: any = dataResult;
          // this.dtTrigger.next(null);  
          
          if (!deleteDocumentStatusResponse.error) { 
            this.loadDocuments();
          this.toastService.add({
            type: 'success',
            message: "Document Deleted Succesfully!"
          })
          this.reload();
          }
        },
        (err) => {
          this.toastService.add({
            type: 'error',
            message: 'Document type cannot be deleted'
          });
        }
      );
         this.deleteDocumentbtn.nativeElement.click();
    }

    loadModelApi(){
      this.smeService.getListOfModelApi().subscribe(res=>{
         this.modelApiData=res;
         this.selectedModelApis = this.modelApiData[0].modelApi.name
      },error=>{
        this.toastService.add({
          type: 'error',
          message: error.error.message
        });
      })
      
    }

    modelApidropdownChange(selectedmodelApi:any){
 
      this.setModalAtribute(selectedmodelApi);
    }

    setModalAtribute(selectedmodelApi:any){
      let selectedModel=this.modelApiData.filter((item:any)=>{
        if(item._id==selectedmodelApi){
          return item
        }});
        if(selectedModel.length>0){
         this.modelApiAttributeList=selectedModel[0]['attributes'];
        }
    }


    //get reference data list
  getReferenceData() {
    this.smeService.getReferenceData().subscribe(data => {
      const result: any = data;
      this.refrenceDataList = result;
    });
  }
  onListReviewDocumentsData(document:any) { 
    this.setDocTypeMetaData(document);
    this.router.navigate(['sme/calibrate-documents-review']);
  }
  
  addNewAtribute(){
    this.addDocumentForm['attributesArray'].push({
      attribute_name: '',
      model_attribute_name: '',
      data_type: '',
      reference_data_id: null
    });
  }
  removeAttributeRow(i: number) {
    this.addDocumentForm['attributesArray'].splice(i, 1);
  }

  btnAddDocument(){
    this.header="Add New Document Type";
    if(!this.isEdit){
    this.addDocumentForm={
      documentName:"",
      modelApi:"",
      attributesArray:[{
        attribute_name: '',
        model_attribute_name: '',
        data_type: '',
        reference_data_id: null
      }]
    }}
  }


  saveDocument(){

    if((this.addDocumentForm.documentName==undefined || this.addDocumentForm.documentName=="") || (this.addDocumentForm.modelApi==undefined || this.addDocumentForm.modelApi==""))
    {
      this.toastService.add({
        type: 'warning',
        message: 'Enter Values'
      });
      return;
    }

    if(this.addDocumentForm.attributesArray.length>0){
      this.addDocumentForm.attributesArray.forEach((item:any)=>{
         if(item.attribute_name==''||
         item.model_attribute_name==''||
         item.data_type==''||
         (item.reference_data_id=='' || item.reference_data_id==null)){
          this.toastService.add({
            type: 'warning',
            message: 'Enter Values'
          });
          return;
         }

      })
    }

 
        const payload = {
          document_type: this.addDocumentForm.documentName,
          versioned_model_api:  this.addDocumentForm.modelApi,
          attributes: this.addDocumentForm.attributesArray,
          document_type_id: this.addDocumentForm.id?this.addDocumentForm.id:null,
        };
        this.smeService.addDocument(payload).subscribe(
          (res) => {
              this.loadDocuments();
              this.cancelAddDocModel.nativeElement.click();
              this.toastService.add({
                type: 'success',
                message: "Document type is created successfully!"
              })
              
          },
          (err) => {
            // if (this.authService.isNotAuthenticated(err.status)) {
            //   this.authService.clearCookiesAndRedirectToLogin();
            //   return;
            // }
            this.toastService.add({
              type: 'error',
              message: err.error.message
            })
          }
        );

  }
 isEdit:boolean=false;
  btnEdit(document:any){
   
    this.isEdit=true;
    if(document?.versioned_model_api?._id){
      this.setModalAtribute(document.versioned_model_api._id);
    }
    
 
    this.addDocumentForm={
      documentName:document.document_type,
      modelApi:document?.versioned_model_api?._id?document?.versioned_model_api?._id:null,
      attributesArray:document.attributes,
      id:document._id
    }
    this.openAddDocumentModel.nativeElement.click();
    this.isEdit=false;
    this.header="Edit Document Type"
  }

  setDocTypeMetaData(document:any) {
    this.smeService.metaDataTrainingDoc = {
      trainingDocId : document?.training_document?.id,
      documentTypeName : document?.document_type,
      docType_id : document?._id
    }
  }

 // 
  onListTrainingDocumentsData(document:any) { 
    this.setDocTypeMetaData(document);
    this.router.navigate(['sme/calibrate-documents-training']); //sme/calibrate/training-data/', document._id
  }

  listGoldenDataSetDocs(document:any) { 
    this.setDocTypeMetaData(document);
    this.router.navigate(['sme/calibrate-documents-Golden']); //sme/calibrate/training-data/', document._id
  }
  
    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.calibrateDocumentsList.unsubscribe();
    }
    reload() {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload()
      });
    }
 
}

