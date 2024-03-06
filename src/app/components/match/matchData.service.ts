import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { IMatchData } from '../../type/matchdata.type';
import { IMatch } from '../../type/match.type';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MatchDataService extends BaseApiService<IMatchData> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matchdata', http, errorHandlingService);
  }

  getMatchDataByMatchId(matchId: number): Observable<IMatchData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      matchId,
      'match_data',
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
}
