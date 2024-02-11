import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import {
  getDefaultFullData,
  IMatch,
  IMatchFullData,
} from '../../type/match.type';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TournamentService } from '../tournament/tournament.service';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';

@Injectable({
  providedIn: 'root',
})
export class MatchFullDataService extends BaseApiService<IMatchFullData> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matches', http, errorHandlingService);
  }

  dataLoaded = new Subject<boolean>();

  private matchesWithFullDataSubject = new BehaviorSubject<IMatchFullData[]>(
    [],
  );
  public matchesWithFullData$ = this.matchesWithFullDataSubject.asObservable();

  matchWithFullDataSubject = new BehaviorSubject<IMatchFullData>(
    getDefaultFullData(),
  );
  public matchWithFullData$ = this.matchWithFullDataSubject.asObservable();

  private tournamentService = inject(TournamentService);

  fetchMatchWithDataById(id: number): Observable<IMatchFullData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'scoreboard/full_data',
    );
  }

  fetchFullMatchDataWithScoreboardSettingsById(
    id: number,
  ): Observable<IMatchFullData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'scoreboard/full_data/scoreboard_settings',
    );
  }

  refreshMatchWithFullData(id: number): void {
    this.fetchFullMatchDataWithScoreboardSettingsById(id).subscribe(
      (match: IMatchFullData) => {
        this.matchWithFullDataSubject.next(match);
        this.dataLoaded.next(true); // Emit true when data has finished loading
      },
    );
  }

  refreshMatchesWithDataInTournament(tournament_id: number): void {
    this.tournamentService
      .fetchAllMatchesWithDataByTournamentId(tournament_id)
      .subscribe((matches: IMatchFullData[]) => {
        this.matchesWithFullDataSubject.next(matches);
      });
  }

  addMatchWithFullData(newMatch: IMatch): void {
    this.addAnyItem(newMatch, 'create_with_full_data')
      .pipe(
        tap((match: IMatchFullData) => {
          console.log(`ADDED MATCH`, match);
          let updatedMatches: IMatchFullData[] = [
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
