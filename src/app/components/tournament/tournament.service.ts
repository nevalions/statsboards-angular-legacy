import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { ITournament } from '../../type/tournament.type';
import { IMatchFullData } from '../../type/match.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { ITeam } from '../../type/team.type';

@Injectable({
  providedIn: 'root',
})
export class TournamentService extends BaseApiService<ITournament> {
  private tournamentsSubject = new BehaviorSubject<ITournament[]>([]);
  public tournaments$ = this.tournamentsSubject.asObservable();

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('tournaments', http, errorHandlingService);
  }

  refreshTournaments(sportId: number, seasonYear: number): void {
    // call to fetch new data
    this.fetchTournamentsBySportAndSeason({
      id: sportId,
      year: seasonYear,
    }).subscribe((tournaments: ITournament[]) => {
      // when new data arrives, update the tournaments$ source
      this.tournamentsSubject.next(tournaments);
    });
  }

  addTournament(newTournament: ITournament): void {
    this.addItem(newTournament)
      .pipe(
        tap((tournament: ITournament) => {
          console.log(`ADDED TOURNAMENT`, tournament);
          let updatedTournaments = [
            ...this.tournamentsSubject.value,
            tournament,
          ];
          // Sort tournaments based on their title
          updatedTournaments = SortService.sort(updatedTournaments, 'title');
          this.tournamentsSubject.next(updatedTournaments);
        }),
      )
      .subscribe();
  }

  deleteTournament(id: number): Observable<any> {
    return new Observable<any>((subscriber) => {
      this.deleteItem(id).subscribe(() => {
        const tournamentFiltered = this.tournamentsSubject.value.filter(
          (t) => t.id !== id,
        );
        this.tournamentsSubject.next(tournamentFiltered);
        subscriber.next(tournamentFiltered);
        subscriber.complete();
      });
    });
  }

  //TODO replace with base
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

  //TODO replace with base
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
