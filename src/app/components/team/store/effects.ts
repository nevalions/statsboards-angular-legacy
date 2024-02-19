import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TeamService } from '../team.service';
import { teamActions } from './actions';
import { ITeam } from '../../../type/team.type';
import { TeamTournamentService } from '../../team-tournament/team-tournament.service';

@Injectable()
export class TeamEffects {
  createTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.create),
        switchMap(({ request }) => {
          return this.teamService.addItem(request).pipe(
            map((currentTeam: ITeam) => {
              return teamActions.createdSuccessfully({
                currentTeam,
              });
            }),
            catchError(() => {
              return of(teamActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllTeamsEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getAll),
        switchMap(() => {
          return this.teamService.findAll().pipe(
            map((teams: ITeam[]) => {
              return teamActions.getAllItemsSuccess({
                teams,
              });
            }),
            catchError(() => {
              return of(teamActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllTeamsBySportIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getTeamsBySportId),
        switchMap(({ id }) => {
          return this.teamService.fetchTeamsBySportId(id).pipe(
            map((teams: ITeam[]) => {
              return teamActions.getTeamsBySportIDSuccess({
                teams,
              });
            }),
            catchError(() => {
              return of(teamActions.getTeamsBySportIDFailure);
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTeamsByTournamentIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getTeamsByTournamentId),
        switchMap(({ id }) => {
          return this.teamTournamentService.fetchTeamsByTournamentId(id).pipe(
            map((teams: ITeam[]) => {
              return teamActions.getTeamsByTournamentIDSuccess({
                teams,
              });
            }),
            catchError(() => {
              return of(teamActions.getTeamsByTournamentIDFailure);
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTeamByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.teamService.findById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((team: ITeam) => {
              return teamActions.getItemSuccess({
                team,
              });
            }),
            catchError(() => {
              return of(teamActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deleteTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.teamService.deleteItem(id).pipe(
            map(() => {
              return teamActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(teamActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnTeamDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private teamService: TeamService,
    private teamTournamentService: TeamTournamentService,
  ) {}
}
