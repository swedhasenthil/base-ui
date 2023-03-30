import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SmeService } from '../../sme.service';

@Component({
  selector: 'app-manage-attributes',
  templateUrl: './manage-attributes.component.html',
  styleUrls: ['./manage-attributes.component.scss']
})
export class ManageAttributesComponent implements OnInit {
  term:any;
  isCheckAll: any = false;
  selectedColumn: any[];
  columnList: any[];
  target:any = [];
  isCheckAlls: any = false;
  docType_id: any;
  disableLeft: boolean = false;
  disableRight: boolean = false;
  @ViewChildren('checkbox') checkbox: any;
  @ViewChildren('checkboxRight') checkboxRight: any;
  @ViewChild('slider')slider:any;
  isCheckLeft: boolean = false;
  leftAllCheckBox: any;
  rightAllCheckBox: any;
  isDefineRules: boolean;
  projectDocumentList: any =[];
  selectedProjectId: any;
  selectedAttibutes: any =[];
  selectedField: any;
  submitButton: boolean
  updateButton: boolean;
  rightAttributeList:any = [];
  leftAttributeList:any = [];
  editStatus:any =[];
  selectedIndex: any;
  IndexAttributes: any;
  subscriptionselectedAttributes: any;
  subscriptionleftAttributes: any;
  subscriptionrightAttributes: any;
  subscriptionEditStatus: any;
  constructor(private api: SmeService,
    private toastr: ToasterService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedService:SharedService) 
    { 
this.subscriptionselectedAttributes = this.api.selectedAttributes.subscribe(data=>{
  this.selectedAttibutes = data
});
this.subscriptionleftAttributes = this.api.leftAttributes.subscribe(data=>{
  this.leftAttributeList = data
})
this.subscriptionrightAttributes = this.api.rightAttributes.subscribe(data=>{
  this.rightAttributeList = data
})
this.subscriptionEditStatus = this.api.EditStatus.subscribe(data=>{
  this.editStatus = data
})

    }

  ngOnInit(): void {
  }
  /**
   * @desc select Left All
   */ 
  selectLeftAll(event: any) {
     this.selectedColumn = [];
     if (event.checked) {
       this.isCheckAll = true;
       this.isCheckLeft = true;
     } else {
       this.isCheckAll = false;
       this.isCheckLeft = false;
     }
     if (this.isCheckAll) {
       this.disableLeft = true;
       this.leftAttributeList.forEach((item: any) =>
         this.leftChekedAttributes.push(item)
       );
       this.checkbox._results.forEach((element: any) => {
         element.nativeElement.checked = true;
       });
     } else {
       this.leftChekedAttributes = [];
       this.checkbox._results.forEach((element: any) => {
         element.nativeElement.checked = false;
       });
     }
   }
   /**
   * @desc on change left attributes value
   */
   onChangeLeft(name: any, event: any, index: any) {
     if (event.checked) {
       this.disableLeft = true
       this.isCheckLeft = true;
       this.leftChekedAttributes.push(name);
     } else {
       this.disableLeft = false
       var Index = this.leftChekedAttributes.findIndex((value: any) => value.user_name == name.user_name);
       this.leftChekedAttributes.splice(Index, 1)
 
       if (this.leftChekedAttributes.length == 0) {
         this.isCheckLeft = false
       }
     }
   }
  /**
   * @desc select right all 
   */
   selectRightAll(event: any) {
     this.selectedColumn = [];
     if (event.checked) {
       this.isCheckAlls = true;
     } else {
       this.isCheckAlls = false;
     }
     if (this.isCheckAlls) {
       this.disableRight = true;
       this.rightAttributeList.forEach((item: any) =>
         this.rightChekedAttributes.push(item)
       );
       this.checkboxRight._results.forEach((element: any) => {
         element.nativeElement.checked = true;
       });
     } else {
       this.disableRight = false;
       this.rightChekedAttributes = [];
       this.checkboxRight._results.forEach((element: any) => {
         element.nativeElement.checked = false;
       });
     }
   }
   /**
   * @desc on change right attributes values
   */
   onChangeRight(name: any, event: any, index: any) {
     if (event.checked) {
       this.disableRight = true;
       this.rightChekedAttributes.push(name);
     } else {
       var Index = this.rightChekedAttributes.findIndex((value: any) => value.name == name.name);
       this.rightChekedAttributes.splice(Index, 1)
       if (this.rightChekedAttributes.length == 0) {
         this.disableRight = false
       }
     }
   }
 
   leftChekedAttributes: any = [];
   rightChekedAttributes: any = [];
   /**
   * @desc   add Atributes
   */
   addAtributes() {
    this.leftChekedAttributes.forEach((item: any) => {
      var check = this.rightAttributeList.some(
        (event: any) => event.attribute_name == item.attribute_name
      );
      if (!check) {
        this.rightAttributeList.push(item);
        var Index = this.leftAttributeList.findIndex(
          (event: any) => event.attribute_name == item.attribute_name
        );
        this.leftAttributeList.splice(Index, 1);
      }
      this.selectedAttibutes = this.rightAttributeList;
       this.api.setSelectedAttributes(this.selectedAttibutes,)

    });
    this.leftChekedAttributes = [];
    this.isCheckLeft = false;
    this.isCheckAll = false;
  }
 /**
   * @desc   remove Atributes
   */
  removeAttributes() {
    this.rightChekedAttributes.forEach((item: any) => {
      var check = this.leftAttributeList.some(
        (event: any) => event.attribute_name == item.attribute_name
      );
      if (!check) {
        this.leftAttributeList.push(item);
        var Index = this.rightAttributeList.findIndex(
          (event: any) => event.attribute_name == item.attribute_name
        );
        this.rightAttributeList.splice(Index, 1);
      }
    });
    this.selectedAttibutes = this.rightAttributeList;
    this.rightChekedAttributes = [];
    this.disableRight = false;
    this.isCheckAlls = false;
    this.isCheckAll = false;
    this.api.setSelectedAttributes(this.selectedAttibutes)

  }
  closeModel(){
    this.leftAttributeList=[];
    this.selectedAttibutes=[];
    this.leftChekedAttributes = [];
    this.rightChekedAttributes = [];
    this.rightAttributeList=[];
  }
  ngOnDestroy(): void {
    this.subscriptionselectedAttributes.unsubscribe();
    this.subscriptionleftAttributes.unsubscribe();
    this.subscriptionrightAttributes.unsubscribe();
    this.subscriptionEditStatus.unsubscribe();
  }
}
