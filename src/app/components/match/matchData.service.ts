import { Injectable, inject } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { IMatchData } from '../../type/matchdata.type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MatchDataService extends BaseApiService<IMatchData> {
  private router = inject(Router);

  constructor() {
    const http = inject(HttpClient);
    const errorHandlingService = inject(ErrorHandlingService);

    super('matchdata', http, errorHandlingService);
  }

  getMatchDataByMatchId(matchId: number): Observable<IMatchData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      matchId,
      'match_data/',
    ).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  editMatchData(id: number | string, data: IMatchData): Observable<IMatchData> {
    return this.editItem(id, data).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  editMatchDataKeyValue(
    id: number | string,
    data: any,
  ): Observable<IMatchData> {
    console.log('edit match data key value', data);
    return this.editItemKeyValue(id, data).pipe(
      tap((data) => {
        console.log('edit match data key value response', data);
      }),
    );
  }
}
