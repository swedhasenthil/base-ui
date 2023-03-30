import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-assignee-filter',
  templateUrl: './assignee-filter.component.html',
  styleUrls: ['./assignee-filter.component.scss'],
})
export class AssigneeFilterComponent implements OnInit {
  @Output() selectedAssignee = new EventEmitter();

  assignedTo: any;
  currentAssignee: any;
  subscriptionstausListObserval: any;
  assigneeOptions = [
    {
      name: 'Assigned to me',
      value: 'Assigned to me',
    },
    {
      name: 'Assigned to my team',
      value: 'Assigned to my team',
    },
  ];

  constructor(
    public sharedService: SharedService,
    private commonService: CommonService
  ) {}
/**
   * @desc filter for assign to me or my tream
   */
  ngOnInit(): void {
    this.subscriptionstausListObserval =
      this.commonService.stausListObserval.subscribe((documentStatus) => {
        if (documentStatus) {
          documentStatus.every((status: any) => {
            if (status.default) {
              this.assignedTo = this.assigneeOptions[0].value;
              this.sharedService.setAssignee(this.assignedTo);
              return false;
            }
            return true;
          });
        }
      });
    // Set default status of assigned to me
    this.assignedTo = this.assigneeOptions[1].value;
    this.sharedService.setAssignee(this.assignedTo);
  }
/**
   * @desc on change filter for assign to me or my tream
   */
  filterByAssignedTo(assignee: any) {
    this.assignedTo = assignee;
    this.sharedService.setAssignee(assignee);
  }
}
