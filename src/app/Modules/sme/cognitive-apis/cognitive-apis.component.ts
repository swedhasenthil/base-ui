import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/toaster/toaster.service';
import { Subject } from 'rxjs';
import { SmeService } from '../sme.service';
import { SharedService } from 'src/app/shared/shared.service';
@Component({
  selector: 'app-cognitive-apis',
  templateUrl: './cognitive-apis.component.html',
  styleUrls: ['./cognitive-apis.component.scss'],
})
export class CognitiveApisComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  modelApis: any;
  expandData: any;
  modelViewList: any;
  constructor(
    public smeService: SmeService,
    public toastr: ToasterService,
    public router: Router,
    private sharedService:SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.smeMenuChanges();
    this.getModelApis();
  }
  getModelApis() {
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
      columnDefs: [
        {
          targets: [7], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
        { targets: [5,6], type: 'date' }

      ],
    };
    this.smeService.getModelApis().subscribe(
      (data: any) => {
        this.modelApis = data;
        this.modelViewList = true;
      },
      (err) => {
        this.toastr.add({
          type: 'error',
          message: err.error.message,
        });
      }
    );
  }
  routerNagivate(modelApi: any) {
    this.smeService.modelApi = modelApi;
    this.router.navigate(['/sme/cognitive-apis-model']);
  }

  expandMoreRow(modelApi: any) {
    this.expandData = modelApi;
 
  }
}
