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
import { MatchFullDataService } from './matchfulldata.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService extends BaseApiService<IMatch> {
  private matchesSubject = new BehaviorSubject<IMatch[]>([]);
  public matches$ = this.matchesSubject.asObservable();

  private matchWithFullDataService = inject(MatchFullDataService);
  private tournamentService = inject(TournamentService);

  matchWithFullData$ = this.matchWithFullDataService.matchWithFullData$;

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matches', http, errorHandlingService);
  }

  refreshMatchesInTournament(tournament_id: number): void {
    this.tournamentService
      .fetchAllMatchesWithDataByTournamentId(tournament_id)
      .subscribe((matches: IMatch[]) => {
        this.matchesSubject.next(matches);
      });
  }

  editMatch(id: number | string, data: IMatch): Observable<IMatch> {
    return this.editItem(id, data).pipe(
      tap((updatedMatch: IMatch) => {
        this.matchWithFullDataService.refreshMatchWithFullData(
          updatedMatch.id!,
        );
        const updatedMatches = this.matchesSubject.value.map((match) =>
          match.id === updatedMatch.id ? updatedMatch : match,
        );
        this.matchesSubject.next(updatedMatches);
      }),
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
