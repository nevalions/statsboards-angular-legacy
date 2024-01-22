import { Injectable } from '@angular/core';
import {combineLatest, Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import {PagedDataArgs} from "../type/base.type";

@Injectable({
  providedIn: 'root',
})
export class PaginationService<T> {
  paginateData(data$: Observable<T[]>, currentPageIndex: number, itemsPerPage: number): Observable<T[]> {
    return data$.pipe(
      switchMap((data) => {
        const startIndex = (currentPageIndex - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        return of(paginatedData);
      })
    );
  }
}


