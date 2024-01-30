import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, combineLatest, of} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaginationService<T> {

  // Declare itemsPerPage as BehaviorSubject to allow it to be dynamically updated
  itemsPerPage: BehaviorSubject<number> = new BehaviorSubject(2);

  // Maintain current page index as a BehaviorSubject
  currentPageIndex: BehaviorSubject<number> = new BehaviorSubject(1);

  // Declare totalPages$ Observable
  totalPages$: Observable<number> = of(0);

  // Declare paginatedItems$ Observable
  paginatedItems$: Observable<T[]> = of([]);

  constructor() {}

  initializePagination(data$: Observable<T[]>): void {
    this.totalPages$ = data$.pipe(
      map(teams => Math.ceil(teams.length / this.itemsPerPage.value)),
    );

    this.paginatedItems$ = combineLatest([
      data$,
      this.currentPageIndex,
      this.itemsPerPage
    ]).pipe(
      map(([items, currentPageIndex, itemsPerPage]) => {
        const start = (currentPageIndex - 1) * itemsPerPage;
        const end = currentPageIndex * itemsPerPage;
        return items.slice(start, end);
      })
    );
  }

  setPage(pageIndex: number): void {
    this.currentPageIndex.next(pageIndex);
  }
}

