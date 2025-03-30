import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { IMatch, IMatchWithFullData } from '../../type/match.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { TournamentService } from '../tournament/tournament.service';
import { MatchWithFullDataService } from '../match-with-full-data/matchfulldata.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService extends BaseApiService<IMatch> {
  private matchesSubject = new BehaviorSubject<IMatch[]>([]);
  public matches$ = this.matchesSubject.asObservable();

  private matchWithFullDataService = inject(MatchWithFullDataService);
  private tournamentService = inject(TournamentService);

  // matchWithFullData$ = this.matchWithFullDataService.matchWithFullData$;

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matches', http, errorHandlingService);
  }

  fetchMatchesByTournamentId(id: number): Observable<IMatch[]> {
    return this.findByFirstKeyValue('tournaments', 'id', id, 'matches').pipe(
      // tap((matches) =>
      //   console.log(`MATCHES from TOURNAMENT ID: ${id}`, matches),
      // ),
      map((data) => SortService.sort(data, '-date')),
    );
  }

  fetchMatchesByTournamentIdWithPagination(id: number, page: number = 1, items_per_page: number = 6): Observable<IMatch[]> {
    return this.getItemsByFirstAndSecondValueWithPagginationAndSort(
      'tournaments', 'id', id, 'matches', page, items_per_page, 'week', 'match_date').pipe(
        tap((matches) =>
          console.log(`MATCHES from TOURNAMENT ID: ${id}`, matches),
        ),
        // map((data) => SortService.sort(data, '-date')),
      );
  }


  editMatch(id: number | string, data: IMatch): Observable<IMatch> {
    return this.editItem(id, data).pipe(
      tap((updatedMatch: IMatch) => {
        // this.matchWithFullDataService.refreshMatchWithFullData(
        //   updatedMatch.id!,
        // );
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

  parsMatchesFromTournamentEESL(
    tournamentEESLId: number,
  ): Observable<IMatchWithFullData[]> {
    return this.parsByFirstKeyValue(
      'matches/pars_and_create',
      'tournament',
      tournamentEESLId,
    ).pipe(
      tap((matches) =>
        console.log(
          `MATCHES from TOURNAMENT EESL ID: ${tournamentEESLId}`,
          matches,
        ),
      ),
    );
  }
}
