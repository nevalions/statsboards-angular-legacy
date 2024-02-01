import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilteringService } from './filter.service';
import { FilterStrategy } from '../type/filter.type';

@Injectable({
  providedIn: 'root',
})
export class SearchListService<T> {
  private allData$ = new BehaviorSubject<T[]>([]);
  private filteredDataSubject$ = new BehaviorSubject<T[]>([]);
  public filteredData$ = this.filteredDataSubject$.asObservable();

  private defaultFilterStrategy: FilterStrategy = 'startsWith';

  constructor(private filteringService: FilteringService) {}

  updateData(data$: Observable<T[]>): void {
    data$.subscribe((data) => {
      this.allData$.next(data);
      this.filteredDataSubject$.next(data);
    });
  }

  updateFilteredData(
    searchString?: string,
    parameter?: string,
    filterStrategy: FilterStrategy = this.defaultFilterStrategy,
  ): void {
    if (!searchString) {
      // Return all data if searchString is empty
      this.filteredDataSubject$.next(this.allData$.getValue());
      return;
    }

    const filteredData = this.filteringService.filterItems(
      this.allData$.getValue(),
      searchString,
      parameter!,
      filterStrategy,
    );
    this.filteredDataSubject$.next(filteredData);
  }
}
