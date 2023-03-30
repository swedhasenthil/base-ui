import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-analyst',
  templateUrl: './analyst.component.html',
  styleUrls: ['./analyst.component.scss']
})
export class AnalystComponent implements OnInit {

  constructor(
    private commonService: CommonService,
  ) {
    this.commonService.setParentComponent('analyst');
   }

  ngOnInit(): void {
  }

}
