import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SearchListService<T> {
  private allData$ = new BehaviorSubject<T[]>([]);
  private filteredDataSubject$ = new BehaviorSubject<T[]>([]);
  public filteredData$ = this.filteredDataSubject$.asObservable();


  updateData(data$: Observable<T[]>): void {
    data$.subscribe(data => {
      this.allData$.next(data);
      this.filteredDataSubject$.next(data); // Add this line
    });
  }

  updateFilteredData(searchString?: string, parameter?: string): void {
  if (!searchString) {
    // Return all data if searchString is empty
    this.filteredDataSubject$.next(this.allData$.getValue());
    return;
  }
  // Your existing filter code
  const filteredData = this.filterItems(this.allData$.getValue(), searchString, parameter);
  this.filteredDataSubject$.next(filteredData);
}

  public filterItems(items: T[], searchString?: string, parameter?: string): T[] {
    if (!searchString) {
      return items;
    }

    const lowerCaseSearch = searchString.toLowerCase();
    return items.filter((item) => {
      const paramValue = String(item[parameter as keyof T]).toLowerCase();
      return paramValue.startsWith(lowerCaseSearch);
    });
  }
}
