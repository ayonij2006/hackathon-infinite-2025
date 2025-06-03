import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  private showToast = new Subject<any>();
  show$ = this.showToast.asObservable();

  show(toastMessage: any) {
    this.showToast.next(toastMessage);
  }
}
