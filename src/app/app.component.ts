import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import {
  POST_LOGOUT_REDIRECT_URI,
  SESSION_TIMEOUT,
} from '../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
// import { Tooltip } from 'bootstrap';
// import Tooltip from 'bootstrap/dist/js/bootstrap.esm.min.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'skense';
  // $.fn.dataTable.defaults({
  //   searching: false,
  //   ordering: false,
  // });
  image: any;
  constructor(
    private bnIdle: BnNgIdleService,
    private msalService: MsalService
  ) {
    this.bnIdle.startWatching(SESSION_TIMEOUT).subscribe((res:any) => {
      if (res) {
        this.logout()
      }
    });
  }
  ngOnInit(){
  }
  logout(){
    {
      let user = this.msalService.getAccount();
      if (user) {
        sessionStorage.clear();
        window.location.href =
          'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' +
          POST_LOGOUT_REDIRECT_URI;
      }
    }
  }
  
}
