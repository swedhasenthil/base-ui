import { Component, OnInit,ViewChildren  } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { OrchestrationService } from '../orchestration.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-manage-api',
  templateUrl: './manage-api.component.html',
  styleUrls: ['./manage-api.component.scss']
})
export class ManageApiComponent implements OnInit {

  constructor(private orchestrationService: OrchestrationService,public sharedService:SharedService ) { }

  ngOnInit(): void {
    this.sharedService.adminMenuChanges();

  }


 

  
  

}
