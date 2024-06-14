import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { IMatchWithFullData } from '../../type/match.type';
import { map, Observable } from 'rxjs';
import { SortService } from '../../services/sort.service';

@Injectable({
  providedIn: 'root',
})
export class MatchWithFullDataService extends BaseApiService<IMatchWithFullData> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matches', http, errorHandlingService);
  }

  fetchMatchWithDataById(id: number): Observable<IMatchWithFullData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'scoreboard/full_data',
    );
  }

  fetchFullMatchDataWithScoreboardSettingsById(
    id: number,
  ): Observable<IMatchWithFullData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'scoreboard/full_data/scoreboard_settings',
    );
  }

  fetchMatchesWithFullDataByTournamentId(
    id: number,
  ): Observable<IMatchWithFullData[]> {
    return this.findByFirstKeyValue(
      'tournaments',
      'id',
      id,
      'matches/all/data',
    ).pipe(
      // tap((matches) =>
      //   console.log(`MATCHES from TOURNAMENT ID: ${id}`, matches),
      // ),
      map((data) => SortService.sort(data, '-date')),
    );
  }
}
