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
      // tap((teams) => console.log(`TEAMS from TOURNAMENT ID: ${id}`, teams)),
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

  // addTeamTournament(newTeamTournament: ITeamTournament): Observable<any> {
  //   return this.addItem(
  //     newTeamTournament,
  //     `${newTeamTournament.team_id}in${newTeamTournament.tournament_id}`,
  //   ).pipe(
  //     switchMap((team_tournament) => {
  //       console.log('CONNECTION TEAM WITH TOURNAMENT ADDED', team_tournament);
  //       let updated = [...this.teamTournamentSubject.value, team_tournament];
  //       this.teamTournamentSubject.next(updated);
  //
  //       return this.teamService.findById(team_tournament.team_id).pipe(
  //         map((team) => {
  //           let updatedTeams = [...this.teamsInTournamentSubject.value, team];
  //           updatedTeams = SortService.sort(updatedTeams, 'title');
  //           this.teamsInTournamentSubject.next(updatedTeams);
  //
  //           return team_tournament;
  //         }),
  //       );
  //     }),
  //   );
  // }

  addTeamTournamentState(
    newTeamTournament: ITeamTournament,
  ): Observable<ITeamTournament> {
    return this.addItem(
      newTeamTournament,
      `${newTeamTournament.team_id}in${newTeamTournament.tournament_id}`,
    ).pipe(
      tap((team_tournament) => {
        console.log('CONNECTION TEAM WITH TOURNAMENT ADDED', team_tournament);
        let updated = [...this.teamTournamentSubject.value, team_tournament];
        this.teamTournamentSubject.next(updated);
      }),
    );
  }

  deleteTeamTournament(
    team_id: number,
    tournament_id: number,
  ): Observable<any> {
    return new Observable<any>((subscriber) => {
      this.deleteAnyManyToManyConnection(team_id, tournament_id).subscribe(
        () => {
          const teamTournamentFiltered =
            this.teamsInTournamentSubject.value.filter(
              (t: ITeam) => t.id !== team_id,
            );
          this.teamsInTournamentSubject.next(teamTournamentFiltered);
          subscriber.next(teamTournamentFiltered);
          subscriber.complete();
        },
      );
    });
  }
}
