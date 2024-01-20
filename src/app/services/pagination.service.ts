import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import {PagedDataArgs} from "../type/base.type";

@Injectable({
  providedIn: 'root',
})
export class PaginationService {

  getPagedData<T>({data$, currentPage$, itemsPerPage$}: PagedDataArgs<T>): Observable<T[]> {
    return combineLatest([data$, currentPage$, itemsPerPage$])
      .pipe(
        map(([data, pageIndex, pageSize]) => {
          let startIndex = (pageIndex - 1) * pageSize;
          let endIndex = startIndex + pageSize;

          return data.slice(startIndex, endIndex);
        })
      );
  }
}


