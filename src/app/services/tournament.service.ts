import { Injectable } from '@angular/core';
import { BaseApiService } from './base.api.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { ErrorHandlingService } from './error.service';
import { ITournament } from '../type/tournament.type';
import { IMatchFullData } from '../type/match.type';
import { tap } from 'rxjs/operators';
import { SortService } from './sort.service';
import { ITeam } from '../type/team.type';

@Injectable({
  providedIn: 'root',
})
export class TournamentService extends BaseApiService<ITournament> {
  itemSig: Subject<ITournament> = new Subject<ITournament>();
  matchesSig: Subject<IMatchFullData[]> = new Subject<IMatchFullData[]>();

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('tournaments', http, errorHandlingService);
  }

  // fetchMatchByTournamentId(id: number) {
  //   return this.http
  //     .get<IMatchFullData[]>(`${this.endpoint}/id/${id}/matches/all/data`)
  //     .pipe(
  //       tap((matches: IMatchFullData[]) => {
  //         this.matchesSig.next(matches);
  //       }),
  //     );
  // }

  fetchMatchByTournamentId(id: number) {
    return this.http
      .get<IMatchFullData[]>(`${this.endpoint}/id/${id}/matches/all/data`)
      .pipe(
        tap((items) => console.log(`TEAMS from TOURNAMENT ID ${id}`, items)),
        map((data) =>
          SortService.sort(data, 'match.week', '-match.match_date'),
        ),
      );
  }

  fetchTeamsByTournamentId(id: number): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(`${this.endpoint}/id/${id}/teams`).pipe(
      tap((items) => console.log(`TEAMS from TOURNAMENT ID ${id}`, items)),
      map((data) => SortService.sort(data, 'title')),
    );
  }

  fetchTournamentsBySportAndSeason(params: {
    id: number;
    year: number;
  }): Observable<ITournament[]> {
    const firstItem = 'seasons';
    const firstKey = 'year';
    const firstValue = params.year;
    const secondItem = 'sports';
    const secondKey = 'id';
    const secondValue = params.id;
    const optionalValue = 'tournaments';

    return this.findByFirstItemKeyValueAndSecondItemSecondKeyValue(
      firstItem,
      firstKey,
      firstValue,
      secondItem,
      secondKey,
      secondValue,
      optionalValue,
    ).pipe(
      tap((items) =>
        console.log(
          `Items fetched by findByValueAndSecondId: ID ${secondValue}`,
          items,
        ),
      ),
      map((data) => SortService.sort(data, 'title')),
    );
  }
}
