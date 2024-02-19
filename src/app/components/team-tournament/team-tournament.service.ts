import { inject, Injectable, Input } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { ITeam, ITeamTournament } from '../../type/team.type';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  delay,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { tap } from 'rxjs/operators';
import { TeamService } from '../team/team.service';
import { SortService } from '../../services/sort.service';

@Injectable({
  providedIn: 'root',
})
export class TeamTournamentService extends BaseApiService<ITeamTournament> {
  teamService = inject(TeamService);

  public teamsInTournamentSubject = new BehaviorSubject<ITeam[]>([]);
  public teamsInTournament$ = this.teamsInTournamentSubject.asObservable();

  private teamTournamentSubject = new BehaviorSubject<ITeamTournament[]>([]);
  public teamTournament$ = this.teamTournamentSubject.asObservable();

  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('team_in_tournament', http, errorHandlingService);
  }

  refreshTeamsInTournament(tournamentId: number): void {
    this.fetchTeamsByTournamentId(tournamentId).subscribe((teams: ITeam[]) => {
      this.teamsInTournamentSubject.next(teams);
    });
  }

  fetchTeamsByTournamentId(id: number): Observable<ITeam[]> {
    return this.findByFirstKeyValue(
      'team_in_tournament/tournament',
      'id',
      id,
      'teams',
    ).pipe(
      tap((teams) => console.log(`TEAMS from TOURNAMENT ID: ${id}`, teams)),
      map((data) => SortService.sort(data, 'title')),
    );
  }

  fetchTeamTournament(
    teamId: number,
    tournamentId: number,
  ): Observable<ITeamTournament> {
    return this.http
      .get<ITeamTournament>(`${this.endpoint}/${teamId}in${tournamentId}`)
      .pipe(
        tap((teamTournament) =>
          console.log('Fetched teamTournament:', teamTournament),
        ),
        catchError(this.errorHandlingService.handleError),
      );
  }

  addTeamTournament(newTeamTournament: ITeamTournament): Observable<any> {
    return this.addItem(
      newTeamTournament,
      `${newTeamTournament.team_id}in${newTeamTournament.tournament_id}`,
    ).pipe(
      switchMap((team_tournament) => {
        console.log('CONNECTION TEAM WITH TOURNAMENT ADDED', team_tournament);
        let updated = [...this.teamTournamentSubject.value, team_tournament];
        this.teamTournamentSubject.next(updated);

        return this.teamService.findById(team_tournament.team_id).pipe(
          // map to keep the switchMap chain
          map((team) => {
            let updatedTeams = [...this.teamsInTournamentSubject.value, team];
            updatedTeams = SortService.sort(updatedTeams, 'title');
            this.teamsInTournamentSubject.next(updatedTeams);

            // Pass along the original team_tournament result
            return team_tournament;
          }),
        );
      }),
    );
  }

  deleteTeamTournament(teamId: number, tournamentId: number): Observable<any> {
    return new Observable<any>((subscriber) => {
      this.fetchTeamTournament(teamId, tournamentId).subscribe({
        next: (teamTournament) => {
          this.deleteItem(teamTournament.id!)
            .pipe(
              switchMap(() => {
                const teamTournamentFiltered =
                  this.teamTournamentSubject.value.filter(
                    (tt): boolean => tt.id !== teamTournament.id,
                  );
                this.teamTournamentSubject.next(teamTournamentFiltered);

                let updatedTeams = this.teamsInTournamentSubject.value.filter(
                  (team) => team.id !== teamId,
                );
                updatedTeams = SortService.sort(updatedTeams, 'title');
                this.teamsInTournamentSubject.next(updatedTeams);

                return of(teamTournamentFiltered);
              }),
            )
            .subscribe(() => {
              subscriber.next();
              subscriber.complete();
            });
        },
        error: (error) => {
          console.error(error);
          subscriber.error(error);
        },
      });
    });
  }
}
