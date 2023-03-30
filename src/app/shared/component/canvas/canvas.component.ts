import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  document: any;
  openWindowDocument: any;
  constructor(private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.getTask('');
  }
  /**
   * @desc get document from backend
   **/
  getTask(document: any) {
    let payload = {
      role_id: localStorage.getItem('currentUserRoleId'),
      user_id: localStorage.getItem('currentUserId'),
      project_id: localStorage.getItem('project_id'),
      document_id: localStorage.getItem('document_id'),
    };
    this.commonService.getTaskFromBackend(payload).subscribe(
      (response: any) => {
        response[0].isNewWindow = true;
        this.openWindowDocument = response[0];
        this.commonService.getImageFromBlob(this.openWindowDocument);
 
      },
    );
  }
}
