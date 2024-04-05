import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { ITournament } from '../../type/tournament.type';
import { IMatchWithFullData } from '../../type/match.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { ITeam } from '../../type/team.type';
import { ISponsor } from '../../type/sponsor.type';

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

  fetchMainSponsorByTournamentId(id: number) {
    return this.http
      .get<ISponsor>(`${this.endpoint}/id/${id}/main_sponsor/`)
      .pipe(tap((items) => console.log('SPONSORS', items)));
  }

  // addTournament(newTournament: ITournament): void {
  //   this.addItem(newTournament)
  //     .pipe(
  //       tap((tournament: ITournament) => {
  //         console.log(`ADDED TOURNAMENT`, tournament);
  //         let updatedTournaments = [
  //           ...this.tournamentsSubject.value,
  //           tournament,
  //         ];
  //         // Sort tournaments based on their title
  //         updatedTournaments = SortService.sort(updatedTournaments, 'title');
  //         this.tournamentsSubject.next(updatedTournaments);
  //       }),
  //     )
  //     .subscribe();
  // }

  // addTournamentStore(newTournament: ITournament): Observable<ITournament> {
  //   return this.addItem(newTournament);
  // }

  // //TODO replace with base
  // fetchAllMatchesWithDataByTournamentId(id: number) {
  //   return this.http
  //     .get<IMatchWithFullData[]>(`${this.endpoint}/id/${id}/matches/all/data`)
  //     .pipe(
  //       tap((items) => console.log(`MATCHES from TOURNAMENT ID ${id}`, items)),
  //       map((data) =>
  //         SortService.sort(data, 'match.week', '-match.match_date'),
  //       ),
  //     );
  // }

  // fetchTournamentsBySportAndSeason(params: {
  //   id: number;
  //   year: number;
  // }): Observable<ITournament[]> {
  //   const firstItem = 'seasons';
  //   const firstKey = 'year';
  //   const firstValue = params.year;
  //   const secondItem = 'sports';
  //   const secondKey = 'id';
  //   const secondValue = params.id;
  //   const optionalValue = 'tournaments';
  //
  //   return this.findByFirstItemKeyValueAndSecondItemSecondKeyValue(
  //     firstItem,
  //     firstKey,
  //     firstValue,
  //     secondItem,
  //     secondKey,
  //     secondValue,
  //     optionalValue,
  //   ).pipe(
  //     tap((items) =>
  //       console.log(
  //         `Items fetched by findByValueAndSecondId: ID ${secondValue}`,
  //         items,
  //       ),
  //     ),
  //     map((data) => SortService.sort(data, 'title')),
  //   );
  // }

  fetchTournamentsBySportAndSeasonId(params: {
    sport_id: number;
    season_id: number;
  }): Observable<ITournament[]> {
    const firstItem = 'seasons';
    const firstKey = 'id';
    const firstValue = params.season_id;
    const secondItem = 'sports';
    const secondKey = 'id';
    const secondValue = params.sport_id;
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

  // deleteTournament(id: number): Observable<any> {
  //   return new Observable<any>((subscriber) => {
  //     this.deleteItem(id).subscribe(() => {
  //       const tournamentFiltered = this.tournamentsSubject.value.filter(
  //         (t) => t.id !== id,
  //       );
  //       this.tournamentsSubject.next(tournamentFiltered);
  //       subscriber.next(tournamentFiltered);
  //       subscriber.complete();
  //     });
  //   });
  // }
}
