import { Injectable } from '@angular/core';
import { BaseApiService } from './base.api.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { ErrorHandlingService } from './error.service';
import { ITeam } from '../type/team.type';
import { tap } from 'rxjs/operators';
import { SortService } from './sort.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService extends BaseApiService<ITeam> {
  itemSig: Subject<ITeam> = new Subject<ITeam>();

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('teams', http, errorHandlingService);
  }

  fetchTeamsBySportId(params: Params): Observable<ITeam[]> {
    const firstItem = 'sports';
    const firstKey = 'id';
    const firstValue = params['id']; // Get id from parent route
    const optionalValue = 'teams';

    return this.findByFirstKeyValue(
      firstItem,
      firstKey,
      firstValue,
      optionalValue,
    ).pipe(
      tap((items) =>
        console.log(
          `Items fetched by findByFirstKeyValue: ID ${firstValue}`,
          items,
        ),
      ),
      map((data) => SortService.sort(data, 'title')),
    );
  }
}
