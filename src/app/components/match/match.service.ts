import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { IMatch, IMatchFullData } from '../../type/match.type';
import { ITournament } from '../../type/tournament.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { TournamentService } from '../tournament/tournament.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService extends BaseApiService<IMatch> {
  private matchesSubject = new BehaviorSubject<IMatch[]>([]);
  public matches$ = this.matchesSubject.asObservable();

  private tournamentService = inject(TournamentService);

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matches', http, errorHandlingService);
  }

  fetchFullMatchDataById(id: number): Observable<IMatchFullData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'scoreboard/full_data',
    );
  }

  refreshMatchesInTournament(tournament_id: number): void {
    this.tournamentService
      .fetchMatchesByTournamentId(tournament_id)
      .subscribe((matches: IMatch[]) => {
        this.matchesSubject.next(matches);
      });
  }

  addMatch(newMatch: IMatch): void {
    this.addItem(newMatch)
      .pipe(
        tap((match: IMatch) => {
          console.log(`ADDED MATCH`, match);
          let updatedMatches: IMatch[] = [...this.matchesSubject.value, match];
          updatedMatches = SortService.sort(
            updatedMatches,
            'week',
            'match_date',
          );
          this.matchesSubject.next(updatedMatches);
        }),
      )
      .subscribe();
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

  deleteMatch(id: number): Observable<any> {
    return new Observable<any>((subscriber) => {
      this.deleteItem(id).subscribe(() => {
        const matchFiltered = this.matchesSubject.value.filter(
          (m) => m.id !== id,
        );
        this.matchesSubject.next(matchFiltered);
        subscriber.next(matchFiltered);
        subscriber.complete();
      });
    });
  }
}
