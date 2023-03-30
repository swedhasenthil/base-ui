import { Component, OnInit } from '@angular/core';
import { Toast } from './toast.interface';
import { ToasterService } from './toaster.service';
@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {
  toast :any 
  toasts: Toast[] = [];

  displaySuccess: boolean = false;
  constructor(public toastService: ToasterService) {
    toastService.toast.subscribe((toasts: any) => this.toasts = toasts);
    this.toast = this.toasts
 
      if(this.toast === null){

      }
      else(this.toast[0].type === "success")
    {
         this.displaySuccess = true
      }
   }

  ngOnInit(): void {
   
  }


  remove(index: number) {
    // this.toasts = this.toasts.filter((toast, i) => i !== index);
    this.toastService.remove(index);
  }

}
