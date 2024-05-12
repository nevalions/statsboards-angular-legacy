import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private subjects = new Map<string, Subject<any>>();

  showDialog(dialogId: string) {
    let subject = this.subjects.get(dialogId);
    if (subject === undefined) {
      subject = new Subject();
      this.subjects.set(dialogId, subject);
    }
    subject.next(undefined);
  }

  getDialogEvent(dialogId: string): Observable<any> {
    let subject = this.subjects.get(dialogId);
    if (subject === undefined) {
      subject = new Subject();
      this.subjects.set(dialogId, subject);
    }
    return subject.asObservable();
  }

  // Reset a dialog event, so it can start fresh when dialogId changes
  resetDialog(dialogId: string) {
    this.subjects.delete(dialogId);
  }

  // showDialog(dialogId: string) {
  //   let subject = this.subjects.get(dialogId);
  //   if (subject === undefined) {
  //     subject = new Subject();
  //     this.subjects.set(dialogId, subject);
  //   }
  //   subject.next(undefined);
  // }
  //
  // getDialogEvent(dialogId: string): Observable<any> {
  //   let subject = this.subjects.get(dialogId);
  //   if (subject === undefined) {
  //     subject = new Subject();
  //     this.subjects.set(dialogId, subject);
  //   }
  //   return subject.asObservable();
  // }
}
