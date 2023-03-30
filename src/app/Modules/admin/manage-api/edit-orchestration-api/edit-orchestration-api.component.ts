import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrchestrationService } from '../../orchestration.service';
import { ToasterService } from 'src/app/core/toaster/toaster.service';

const IPP_KEY = "input_params";
const IFF_KEY = "input_filter_fields";
const OPP_KEY = "output_params";
const OFF_KEY = "output_filter_fields";
const TOASTER_TIMEOUT = 4000;

@Component({
  selector: 'app-edit-orchestration-api',
  templateUrl: './edit-orchestration-api.component.html',
  styleUrls: ['./edit-orchestration-api.component.scss']
})
export class EditOrchestrationApiComponent implements OnInit {

  apiData = [
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      description: String,
      api_url: {
        type: String,
        required: true,
      },
      api_endpoint: {
        type: String,
        required: true,
      },
      source_path: {
        type: String,
        default: '',
      },
      destination_path: {
        type: String,
        default: '',
      },
      stage_name: {
        type: String,
        default: ' stage name 23',
      },
      input_params: [],
      input_filter_fields: ['input field'],
      input_param_collection: {
        type: String,
        default: 'default input collection',
      },
      output_params: [],
      output_filter_fields: [ 'output field'],
      output_param_collection: {
        type: String,
        default: 'default output collection',
      },
      is_ocr_req: {
        type: Boolean,
        default: false,
      },
      is_binary_req: {
        type: Boolean,
        default: false,
      },
      is_doc_ini: {
        type: Boolean,
        default: false,
      },
      is_txt_ini: {
        type: Boolean,
        default: false,
      },
      is_it_for_contx: {
        type: Boolean,
        default: false,
      },
    }
  ];

  fordata:any={ 
    api_name:'',
    is_binary_req:'',
    description:'',
    api_url:'',
    api_endpoint:'',
    source_path:'',
    destination_path:'',
    stage_name:'',
    input_params:'',
    input_filter_fields:'',
    input_param_collection:'',
    output_params:'',
    output_filter_fields:'',
    output_param_collection:'',
    is_ocr_req:'',   
    is_doc_ini:'',
    is_txt_ini:'',
    is_it_for_contx:'',
    sequence_no:'',
    project_id:'',
    is_custom_event:'',
    pending_status:'',
    failure_status:'',
    status_collection:'',
    is_insertion_req:'',
    call_frequency:'',
    call_frequency_collection:'',
    custom_topic_key:'',
    custom_topic_url:'',
    event_subject:'',
    _id:'',
    name:'',

  };
  
  
  // @Input() api:any;
  @Input() set api(value: any) {     
 
    this.fordata = {
                  api_name:value?.api_name,
                  is_binary_req:value.is_binary_req,
                  description:value.description,
                  api_url:value.api_url,
                  api_endpoint:value.api_endpoint,
                  source_path:value.source_path,
                  destination_path:value.destination_path,
                  stage_name:value.stage_name,
                  input_params:value.input_params,
                  input_filter_fields:value.input_filter_fields,
                  input_param_collection:value.input_param_collection,
                  output_params:value.output_params,
                  output_filter_fields:value.output_filter_fields,
                  output_param_collection:value.output_param_collection,
                  is_ocr_req:value.is_ocr_req,   
                  is_doc_ini:value.is_doc_ini,
                  is_txt_ini:value.is_txt_ini,
                  is_it_for_contx:value.is_it_for_contx,                

                  sequence_no:value.sequence_no,
                  project_id:value.project_id,
                  is_custom_event:value.is_custom_event,
                  pending_status:value.pending_status,
                  failure_status:value.failure_status,
                  status_collection:value.status_collection,
                  is_insertion_req:value.is_insertion_req,
                  call_frequency:value.call_frequency,
                  call_frequency_collection:value.call_frequency_collection,
                  custom_topic_key:value.custom_topic_key,
                  custom_topic_url:value.custom_topic_url,
                  event_subject:value.event_subject,
                  _id:value._id,
                  name:value.name,
                  
                  }
   }

  @Output() apiUpdatedEvent = new EventEmitter<string>();
  constructor(
    private orchestrationService: OrchestrationService,
    public toastService:ToasterService
  ) {}

  ngOnInit(): void {
  }

  updateOrchestrationApi() {
    const inValid = this.isMandatoryFieldsMissing();
    if (inValid) {
      this.toastService.add({
        type: 'warning',
        message: inValid
      });	
      return;
    }
    let tempApi = { ...this.fordata };
    tempApi.id = tempApi._id;
    delete tempApi._id;
    try {
      tempApi[IPP_KEY]? tempApi[IPP_KEY] = JSON.parse(tempApi[IPP_KEY]): tempApi[IPP_KEY] = null;
      tempApi[IFF_KEY]? tempApi[IFF_KEY] = JSON.parse(tempApi[IFF_KEY]): tempApi[IFF_KEY] = null;
      tempApi[OPP_KEY]? tempApi[OPP_KEY] = JSON.parse(tempApi[OPP_KEY]): tempApi[OPP_KEY] = null;
      tempApi[OFF_KEY]? tempApi[OFF_KEY] = JSON.parse(tempApi[OFF_KEY]): tempApi[OFF_KEY] = null; 
    } catch (error) {     
      this.toastService.add({
        type: 'error',
        message: 'Input/Output params & filter fields should have valid JSON as array of objects","Update Failed"'
      });
      return;
    } 

    this.orchestrationService.updateOrchestrationApi(tempApi).subscribe(
      (result) => {
        this.apiUpdatedEvent.emit(tempApi.api_name);
      },
      (error) => {
        if(error?.error?.message) {
          this.toastService.add({
            type: 'error',
            message: error.error.message
          });
        } else {
          this.toastService.add({
            type: 'error',
            message: 'APIs used in Orchestration, can not be edit'
          });
        }
      }
    );
  }

  isMandatoryFieldsMissing() {
    if (!this.fordata.api_name || !this.fordata.api_url || !this.fordata.api_endpoint) {
      return 'API name, url & endpoint are required';
    } else {
      return null;
    }
  }


}
