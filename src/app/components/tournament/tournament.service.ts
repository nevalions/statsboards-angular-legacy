import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { ITournament } from '../../type/tournament.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { ISponsor } from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class TournamentService extends BaseApiService<ITournament> {
  // private tournamentsSubject = new BehaviorSubject<ITournament[]>([]);
  // public tournaments$ = this.tournamentsSubject.asObservable();

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
}
