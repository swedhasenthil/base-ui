import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-qc',
  templateUrl: './qc.component.html',
  styleUrls: ['./qc.component.scss']
})
export class QcComponent implements OnInit {

  constructor(
    private commonService: CommonService,
  ) {
    this.commonService.setParentComponent('qc');
   }

  ngOnInit(): void {
  }

}
