import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import {} from '../../type/match.type';
import { IScoreboard } from '../../type/matchdata.type';

@Injectable({
  providedIn: 'root',
})
export class ScoreboardDataService extends BaseApiService<IScoreboard> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('scoreboards', http, errorHandlingService);
  }

  getScoreboardDataByMatchId(matchId: number): Observable<IScoreboard> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      matchId,
      'scoreboard_data/',
    ).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  editScoreboardData(
    id: number | string,
    data: IScoreboard,
  ): Observable<IScoreboard> {
    // console.log(data);
    return this.editItem(id, data).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  //
  // fetchMatchWithDataById(id: number): Observable<IMatchWithFullData> {
  //   return this.findByFirstKeyValue(
  //     'matches',
  //     'id',
  //     id,
  //     'scoreboard/full_data',
  //   );
  // }
  //
  // fetchFullMatchDataWithScoreboardSettingsById(
  //   id: number,
  // ): Observable<IMatchWithFullData> {
  //   return this.findByFirstKeyValue(
  //     'matches',
  //     'id',
  //     id,
  //     'scoreboard/full_data/scoreboard_settings',
  //   );
  // }
  //
  // fetchMatchesWithFullDataByTournamentId(
  //   id: number,
  // ): Observable<IMatchWithFullData[]> {
  //   return this.findByFirstKeyValue(
  //     'tournaments',
  //     'id',
  //     id,
  //     'matches/all/data',
  //   ).pipe(
  //     tap((matches) =>
  //       console.log(`MATCHES from TOURNAMENT ID: ${id}`, matches),
  //     ),
  //     map((data) => SortService.sort(data, '-date')),
  //   );
  // }
}
