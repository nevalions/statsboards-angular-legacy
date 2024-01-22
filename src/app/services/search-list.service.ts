import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchListService<T> {

  private filteredDataSubject = new BehaviorSubject<T[]>([]);
  filteredData$ = this.filteredDataSubject.asObservable();

  updateFilteredData(data: T[]) {
    // console.log('FFFFFFFFILLLLL', data)
    this.filteredDataSubject.next(data);
  }
}
