import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private subject = new Subject<any>();

  showDialog() {
    this.subject.next(undefined);
  }

  getDialogEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
