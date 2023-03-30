import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../toaster/toast.interface';
@Injectable({
  providedIn: 'root'
})


export class ToasterService {
  remove //   this.subject.next(this.toasts);
    (index: number) {
      throw new Error('Method not implemented.');
  }

  toasts: Toast[] = [];
  delay = 3000;

  subject = new BehaviorSubject<Toast[]>(null!);
   toast = this.subject.asObservable();

  add(toast: Toast) {
 
    this.toasts = [toast, ...this.toasts];
    this.subject.next(this.toasts);

    setTimeout(() => {
      this.toasts = this.toasts.filter(v => v !== toast);
      this.subject.next(this.toasts);
    }, this.delay);
  }

  // remove(index: number) {
  //   this.toasts = this.toasts.filter((toast, i) => i !== index);
  //   this.subject.next(this.toasts);
  // }
}
