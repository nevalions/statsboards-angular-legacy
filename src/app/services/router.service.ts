import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class RouteParamsService {

  constructor(private route: ActivatedRoute) { }

  getParamAndFetchData(fetchDataFn: (id: number) => Observable<any>, tapFn: (data: any) => void) {
    return this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return fetchDataFn(id).pipe(tap(tapFn));
      })
    );
  }

}
