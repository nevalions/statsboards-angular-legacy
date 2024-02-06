import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { ITeam } from '../../type/team.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { TournamentService } from '../tournament/tournament.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService extends BaseApiService<ITeam> {
  private teamsSubject = new BehaviorSubject<ITeam[]>([]);
  public teams$ = this.teamsSubject.asObservable();

  private tournamentService = inject(TournamentService);

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('teams', http, errorHandlingService);
  }

  refreshTeamsInSport(sportId: number): void {
    this.fetchTeamsBySportId(sportId).subscribe((teams: ITeam[]) => {
      this.teamsSubject.next(teams);
    });
  }

  fetchTeamsBySportId(id: number): Observable<ITeam[]> {
    return this.findByFirstKeyValue('sports', 'id', id, 'teams').pipe(
      tap((teams) => console.log(`TEAMS from SPORT ID: ${id}`, teams)),
      map((data) => SortService.sort(data, 'title')),
    );
  }

  fetchAllTeamsBySportId(params: Params): Observable<ITeam[]> {
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

  deleteTeam(id: number): Observable<ITeam> {
    return new Observable<any>((subscriber) => {
      this.deleteItem(id).subscribe(() => {
        const teamsFiltered: ITeam[] = this.teamsSubject.value.filter(
          (t: ITeam): boolean => t.id !== id,
        );
        this.teamsSubject.next(teamsFiltered);
        subscriber.next();
        subscriber.complete();
      });
    });
  }
}
