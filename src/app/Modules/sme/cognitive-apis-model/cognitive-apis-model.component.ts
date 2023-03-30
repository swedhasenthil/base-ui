import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { interval, Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { Router } from '@angular/router';
import { routers } from 'jointjs';

@Component({
  selector: 'app-cognitive-apis-model',
  templateUrl: './cognitive-apis-model.component.html',
  styleUrls: ['./cognitive-apis-model.component.scss'],
})
export class CognitiveApisModelComponent implements OnInit {
  [x: string]: any;
  modelApi: any;
  versionedModelApis: any;
  refreshInterval: any;
  expandData: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  versionModal: any;

  constructor(public smeService: SmeService, public toastr: ToasterService,public route:Router) {}

  ngOnInit(): void {
    this.dtOptions = {
      order: [[6, 'desc']],
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 20, 30, -1],
        [10, 20, 30, 'All'],
      ],
      retrieve: true,
      scrollX: true,
      scrollCollapse: true,
      responsive: true,
      columnDefs: [
       
        { targets: [3,4,5], type: 'date' }

      ],
    };
    
  
    if(this.smeService.modelApi !== null && this.smeService.modelApi !== undefined){
      this.modelApi = this.smeService.modelApi;
      this.endPoint = this.modelApi?.endpoint;
      this.selectedName = this.modelApi.name;
      this.getVersionedModelApis();
    }
    else{
    this.route.navigate(['sme/cognitive-apis'])
    }
 
  }
  getVersionedModelApis() {
    this.smeService
      .getVersionedModelApis(this.modelApi._id)
      .subscribe((data: any) => {
        if (data) {
          this.versionedModelApis = data;
 
          this.filterModelApis = new Set(
            data.map((v: { name: any }) => v.name)
          );
 
          this.versionModal = true;
          var branch = 'BENCHMARK_REQ_PENDING';
          const pendingItem = this.versionedModelApis.find(
            (item: any) => item?.benchmark?.result_status === branch
          );
          if (pendingItem) {
            if (!this.refreshInterval || this.refreshInterval?.isStopped) {
              this.subscribeToRefresh();
            }
          } else {
            this.unSubscribeToRefresh();
          }
        }

        (err: any) => {
          this.toastr.add({
            type: 'error',
            message: err.error.message,
          });
        };
      });
  }
  onChangeVersionedApiStatus(event: any, versionedModelApi: any) {
    versionedModelApi.is_active = !versionedModelApi.is_active;
    if (!versionedModelApi.version) {
      return;
    }
    const versionedModelApiIdAndStatus = {
      id: versionedModelApi._id,
      model_api: versionedModelApi.model_api,
      is_active: versionedModelApi.is_active,
    };
    this.smeService
      .changeVersionedApiStatus(versionedModelApiIdAndStatus)
      .subscribe(
        (data) => {
          if (data) {
          }
        },
        (err) => {
          this.toastr.add({
            type: 'error',
            message: err.error.message,
          });
          this.getVersionedModelApis();
        }
      );
  }

  makeVersion(versionedModelApi: any) {
    if (!versionedModelApi.hasOwnProperty('is_active')) {
      versionedModelApi.is_active = false;
    }
    const modelApiMetaData = {
      model_api: versionedModelApi.model_api,
      is_active: versionedModelApi.is_active,
    };
    this.smeService.makeVersion(modelApiMetaData).subscribe(
      (data) => {
        if (data) {
          this.getVersionedModelApis();
        }
      },
      (err) => {
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
      }
    );
  }

  refreshVersionsList(event: any) {
    this.getVersionedModelApis();
  }

  benchmarkThisVersionedModelApi(versionedModelApi: any) {
    const cannotRequest = this.cannotRequestForBenchmarking(versionedModelApi);
    if (cannotRequest) {
      this.toastr.add({
        type: 'warning',
        message: cannotRequest,
      });
      return;
    }
    const defaultSuccessMessage = 'Requested to get accuracy for benchmarking';
    const defaultErrorMessage =
      'Could not process the request, try again later';
    this.smeService
      .benchmarkVersionedModelApi({
        versioned_model_api: versionedModelApi._id,
      })
      .subscribe(
        (result: any) => {
          this.toastr.add({
            type: 'success',
            message: defaultErrorMessage,
          });
          this.getVersionedModelApis();
        },
        (error: any) => {
          if (error?.error?.message) {
            this.toastr.add({
              type: 'error',
              message: error.error.message,
            });
          } else {
            this.toastr.add({
              type: 'error',
              message: defaultErrorMessage,
            });
          }
          this.getVersionedModelApis();
        }
      );
  }

  getBenchmarkAccuracy(versionedModelApi: any) {
    if (versionedModelApi?.benchmark?.accuracy_percent) {
      return versionedModelApi?.benchmark?.accuracy_percent + '%';
    } else if (versionedModelApi?.benchmark?.result_status == 'Pending') {
      return '';
    } else {
      return 'NA';
    }
  }

  getBenchmarkStatus(versionedModelApi: any) {
    var bench = 'BENCHMARK_REQ_PENDING';
    return versionedModelApi?.benchmark?.result_status == bench ? bench : '';
  }

  subscribeToRefresh() {
    var name: any = 'REFRESH_DURATION';
    this.refreshInterval = interval(name).subscribe(() => {
      this.getVersionedModelApis();
    });
  }
  unSubscribeToRefresh() {
    if (this.refreshInterval) {
      this.refreshInterval.next();
      this.refreshInterval.complete();
    }
  }

  hasGoldenDataDeletedAfterBenchmarked(versionedModelApi: any) {
    try {
      if (!versionedModelApi?.recent_approved_golden_data_deleted_at) {
        return false;
      }
      let benchmarked = new Date(
        versionedModelApi?.benchmark?.updated_at
      ).getTime();
      let goldenDataDeleted = new Date(
        versionedModelApi?.recent_approved_golden_data_deleted_at
      ).getTime();
      if (goldenDataDeleted > benchmarked) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  hasNewlyApprovedGoldenData(versionedModelApi: any) {
    try {
      let benchmarked = new Date(
        versionedModelApi?.benchmark?.updated_at
      ).getTime();
      let goldenData = new Date(
        versionedModelApi?.recent_golden_data_approved_at
      ).getTime();
      if (goldenData > benchmarked) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  cannotRequestForBenchmarking(versionedModelApi: any) {
    if (this.hasGoldenDataDeletedAfterBenchmarked(versionedModelApi)) {
      return null;
    }
    if (
      !versionedModelApi?.benchmark &&
      !versionedModelApi.recent_golden_data_approved_at
    ) {
      return 'You need to have approved golden data set to request for benchmarking';
    } else if (
      versionedModelApi?.benchmark &&
      !this.hasNewlyApprovedGoldenData(versionedModelApi)
    ) {
      return 'Already upto date, there is no change in golden data set to benchmark';
    } else {
      return null;
    }
  }

  expandMoreRow(modelApi: any) {
    this.expandData = modelApi;
  }
  changedStatus() {
    if (this.is_active) {
      this.is_active = false;
    } else {
      this.is_active = true;
    }
  }
  submitModalApiVersion() {
    const modelApiMetaData = {
      model_api: this.modelApi._id,
      is_active: this.is_active,
      endpoint: this.endPoint,
    };
    this.smeService.makeVersion(modelApiMetaData).subscribe(
      (data) => {
        if (data) {
          this.getVersionedModelApis();
          this.ngOnInit();
          this.toastr.add({
            type: 'sucsess',
            message: 'Versioned model has been created successfully',
          });
          this.newItemEvent.emit('version-created');
        }
      },
      (err) => {
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
      }
    );
  }
  filterModelName($event: any) {
    if (this.selectedName != 'All') {
      var modelApis = this.versionedModelApis.filter(
        (t: { name: any }) => t.name === this.selectedName
      );
      this.versionedModelApis = modelApis;
    } else this.selectedName === 'All';
    {
      this.versionedModelApis;
    }
  }
}
