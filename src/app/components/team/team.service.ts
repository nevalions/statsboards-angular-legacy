import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import { SortService } from '../../services/sort.service';
import { ITeam } from '../../type/team.type';

@Injectable({
  providedIn: 'root',
})
export class TeamService extends BaseApiService<ITeam> {
  private teamsSubject = new BehaviorSubject<ITeam[]>([]);
  public teams$ = this.teamsSubject.asObservable();

  // public teamsInTournamentSubject = new BehaviorSubject<ITeam[]>([]);
  // public teamsInTournament$ = this.teamsInTournamentSubject.asObservable();

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
    // console.log('fetchTeamsBySportId sportId: ', id);
    return this.findByFirstKeyValue('sports', 'id', id, 'teams').pipe(
      // tap((teams) => console.log(`TEAMS from SPORT ID: ${id}`, teams)),
      map((data) => SortService.sort(data, 'title')),
    );
  }

  fetchTeamsByMatchId(
    id: number,
  ): Observable<{ homeTeam: ITeam; awayTeam: ITeam }> {
    // console.log('fetchTeamsBySportId sportId: ', id);
    return this.findByFirstKeyValue('matches', 'id', id, 'teams')
      .pipe
      // tap((teams) => console.log(`TEAMS from SPORT ID: ${id}`, teams)),
      ();
  }

  // fetchTeamsByTournamentId(id: number): Observable<ITeam[]> {
  //   return this.findByFirstKeyValue('tournaments', 'id', id, 'teams').pipe(
  //     tap((teams) => console.log(`TEAMS from TOURNAMENT ID: ${id}`, teams)),
  //     map((data) => SortService.sort(data, 'title')),
  //   );
  // }

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
      // tap((items) =>
      //   console.log(
      //     `Items fetched by findByFirstKeyValue: ID ${firstValue}`,
      //     items,
      //   ),
      // ),
      map((data) => SortService.sort(data, 'title')),
    );
  }

  addTeam(newTeam: ITeam): void {
    this.addItem(newTeam)
      .pipe(
        tap((team: ITeam) => {
          console.log('ADDED TEAM', team);
          let updatedTeams = [...this.teamsSubject.value, team];
          updatedTeams = SortService.sort(updatedTeams, 'title');
          this.teamsSubject.next(updatedTeams);
        }),
      )
      .subscribe();
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
