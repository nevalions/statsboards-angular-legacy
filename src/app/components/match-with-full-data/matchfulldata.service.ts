import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import {
  getDefaultFullData,
  IMatch,
  IMatchWithFullData,
} from '../../type/match.type';
import { BehaviorSubject, map, Observable, of, Subject } from 'rxjs';
import { TournamentService } from '../tournament/tournament.service';
import { tap } from 'rxjs/operators';
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

  dataLoaded = new Subject<boolean>();

  private matchesWithFullDataSubject = new BehaviorSubject<
    IMatchWithFullData[]
  >([]);
  public matchesWithFullData$ = this.matchesWithFullDataSubject.asObservable();

  matchWithFullDataSubject = new BehaviorSubject<IMatchWithFullData>(
    getDefaultFullData(),
  );
  public matchWithFullData$ = this.matchWithFullDataSubject.asObservable();

  private tournamentService = inject(TournamentService);

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

  refreshMatchWithFullData(id: number): void {
    this.fetchFullMatchDataWithScoreboardSettingsById(id).subscribe(
      (match: IMatchWithFullData) => {
        this.matchWithFullDataSubject.next(match);
        this.dataLoaded.next(true); // Emit true when data has finished loading
      },
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
      tap((matches) =>
        console.log(`MATCHES from TOURNAMENT ID: ${id}`, matches),
      ),
      map((data) => SortService.sort(data, '-date')),
    );
  }

  refreshMatchesWithDataInTournament(tournament_id: number): void {
    this.tournamentService
      .fetchAllMatchesWithDataByTournamentId(tournament_id)
      .subscribe((matches: IMatchWithFullData[]) => {
        this.matchesWithFullDataSubject.next(matches);
      });
  }

  addMatchWithFullData(newMatch: IMatch): void {
    this.addAnyItem(newMatch, 'create_with_full_data')
      .pipe(
        tap((match: IMatchWithFullData) => {
          console.log(`ADDED MATCH`, match);
          let updatedMatches: IMatchWithFullData[] = [
            ...this.matchesWithFullDataSubject.value,
            match,
          ];
          updatedMatches = SortService.sort(
            updatedMatches,
            'match.week',
            '-match.match_date',
          );
          this.matchesWithFullDataSubject.next(updatedMatches);
        }),
      )
      .subscribe();
  }
}
